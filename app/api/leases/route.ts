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

    const landlord = await prisma.landlord.findFirst({
      where: { userId: session.user.id }
    });

    if (!landlord) {
      return NextResponse.json({ error: 'Landlord not found' }, { status: 404 });
    }

    const leases = await prisma.tenancyAgreement.findMany({
      where: {
        unit: {
          property: {
            landlordId: landlord.id
          }
        }
      },
      include: {
        tenant: true,
        unit: {
          include: {
            property: true
          }
        }
      }
    });

    return NextResponse.json({ leases });
  } catch (error) {
    console.error('Failed to fetch leases:', error);
    return NextResponse.json({ error: 'Failed to fetch leases' }, { status: 500 });
  }
} 