import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Starting landlord fetch through lease');
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.log('No authenticated session found');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Find tenant and their active lease, then get the landlord through the property
    const tenantWithLease = await prisma.tenant.findFirst({
      where: { 
        userId: session.user.id,
        tenancyAgreements: {
          some: {
            status: 'ACTIVE'
          }
        }
      },
      include: {
        tenancyAgreements: {
          where: {
            status: 'ACTIVE'
          },
          include: {
            unit: {
              include: {
                property: {
                  include: {
                    landlord: {
                      include: {
                        user: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!tenantWithLease || !tenantWithLease.tenancyAgreements[0]) {
      console.log('No active lease found for tenant');
      return NextResponse.json({ error: 'No active lease found' }, { status: 404 });
    }

    const activeLease = tenantWithLease.tenancyAgreements[0];
    const landlord = activeLease.unit.property.landlord;

    const response = {
      landlordDetails: {
        name: `${landlord.firstName} ${landlord.lastName}`,
        email: landlord.user.email,
        phone: landlord.phone,
        propertyAddress: activeLease.unit.property.addressLine1,
        unitNumber: activeLease.unit.unitNumber
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching landlord details:', error);
    return NextResponse.json({ error: 'Failed to fetch landlord details' }, { status: 500 });
  }
} 