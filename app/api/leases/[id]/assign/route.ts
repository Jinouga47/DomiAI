import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { AgreementStatus } from '@prisma/client';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // console.log('Starting lease assignment');
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tenantId } = await request.json();
    const leaseId = params.id;

    // console.log('Assigning tenant:', tenantId, 'to lease:', leaseId);

    // Update the lease with the tenant and set status to ACTIVE
    const updatedLease = await prisma.tenancyAgreement.update({
      where: { id: leaseId },
      data: {
        tenantId,
        // If tenant is being assigned (not removed), set status to ACTIVE
        status: tenantId ? AgreementStatus.ACTIVE : AgreementStatus.INACTIVE
      }
    });

    // console.log('Updated lease:', updatedLease);
    return NextResponse.json(updatedLease);
  } catch (error) {
    // console.error('Failed to assign tenant:', error);
    return NextResponse.json(
      { error: 'Failed to assign tenant to lease' },
      { status: 500 }
    );
  }
} 