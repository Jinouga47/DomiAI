import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { AgreementStatus, TenancyType, RenewalStatus } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.unitId || !data.startDate || !data.endDate || !data.monthlyRent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the lease
    const lease = await prisma.tenancyAgreement.create({
      data: {
        unit: {
          connect: { id: data.unitId }  // Connect to existing unit
        },
        tenant: {
          connect: undefined
        },
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        monthlyRent: data.monthlyRent,
        depositAmount: data.depositAmount,
        status: AgreementStatus.INACTIVE,
        tenancyType: TenancyType.AST,
        depositProtectionRef: '',
        noticePeriodDays: 30,
        renewalStatus: RenewalStatus.PENDING_RENEWAL
      },
      include: {
        unit: true
      }
    });

    return NextResponse.json(lease);
  } catch (error) {
    console.error('Failed to create lease:', error);
    return NextResponse.json(
      { error: 'Failed to create lease' },
      { status: 500 }
    );
  }
} 