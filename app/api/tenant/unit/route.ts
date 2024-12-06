import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenant = await prisma.tenant.findFirst({
      where: { userId: session.user.id },
      include: {
        tenancyAgreements: {
          where: { status: 'ACTIVE' },
          include: {
            unit: {
              include: {
                property: true
              }
            }
          }
        }
      }
    });

    if (!tenant?.tenancyAgreements?.[0]?.unit) {
      return NextResponse.json({ error: 'No active lease found' }, { status: 404 });
    }

    const unit = tenant.tenancyAgreements[0].unit;
    return NextResponse.json({
      unit: {
        id: unit.id,
        propertyAddress: unit.property.addressLine1,
        unitNumber: unit.unitNumber
      }
    });
  } catch (error) {
    console.error('Error fetching tenant unit:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unit details' },
      { status: 500 }
    );
  }
} 