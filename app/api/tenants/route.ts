import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the landlord record
    const landlord = await prisma.landlord.findFirst({
      where: { userId: session.user.id }
    });

    if (!landlord) {
      return NextResponse.json({ error: 'Landlord not found' }, { status: 404 });
    }

    // Get all tenants associated with this landlord's properties
    const tenants = await prisma.tenant.findMany({
      where: {
        tenancyAgreements: {
          some: {
            unit: {
              property: {
                landlordId: landlord.id
              }
            }
          }
        }
      },
      include: {
        tenancyAgreements: {
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

    // Format tenant data
    const formattedTenants = tenants.map(tenant => ({
      id: tenant.id,
      firstName: tenant.firstName,
      lastName: tenant.lastName,
      status: tenant.tenancyAgreements[0]?.status || 'PENDING_VERIFICATION',
      rentAmount: tenant.tenancyAgreements[0]?.monthlyRent || null,
      propertyAddress: tenant.tenancyAgreements[0]?.unit.property.addressLine1 || null
    }));

    return NextResponse.json({ tenants: formattedTenants });
  } catch (error) {
    console.error('Error fetching tenants:', error);
    return NextResponse.json(
      { message: 'Error fetching tenants' },
      { status: 500 }
    );
  }
} 