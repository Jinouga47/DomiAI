import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Starting leased tenants fetch');
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.log('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the landlord
    const landlord = await prisma.landlord.findFirst({
      where: { userId: session.user.id }
    });

    if (!landlord) {
      console.log('Landlord not found');
      return NextResponse.json({ error: 'Landlord not found' }, { status: 404 });
    }

    console.log('Found landlord:', landlord.id);

    // Get all tenants with active leases on landlord's properties
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
        },
        user: {
          select: {
            email: true,
            status: true
          }
        }
      }
    });

    console.log(`Found ${tenants.length} tenants with leases`);

    // Format the response
    const formattedTenants = tenants.map(tenant => ({
      id: tenant.id,
      firstName: tenant.firstName,
      lastName: tenant.lastName,
      email: tenant.user.email,
      phone: tenant.phone,
      status: tenant.user.status,
      leases: tenant.tenancyAgreements.map(lease => ({
        id: lease.id,
        startDate: lease.startDate,
        endDate: lease.endDate,
        status: lease.status,
        property: {
          id: lease.unit.property.id,
          address: lease.unit.property.addressLine1,
          unitNumber: lease.unit.unitNumber,
          rent: lease.monthlyRent
        }
      }))
    }));

    return NextResponse.json({ tenants: formattedTenants });
  } catch (error) {
    console.error('Error fetching leased tenants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tenants' },
      { status: 500 }
    );
  }
} 