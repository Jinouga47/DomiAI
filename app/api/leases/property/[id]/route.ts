import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const property = await prisma.property.findUnique({
      where: { id },
      include: { units: true }
    });

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const leases = await prisma.tenancyAgreement.findMany({
      where: {
        unit: {
          propertyId: id
        }
      },
      include: {
        tenant: true,
        unit: true
      }
    });

    return NextResponse.json({ property, leases });
  } catch (error) {
    console.error('Failed to fetch property leases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property leases' },
      { status: 500 }
    );
  }
} 