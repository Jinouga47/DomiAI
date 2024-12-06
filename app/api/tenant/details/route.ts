import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Starting tenant details fetch');
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.log('No authenticated session found');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    console.log('Session user ID:', session.user.id);

    // Find tenant and their active lease
    const tenant = await prisma.tenant.findFirst({
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

    if (!tenant) {
      console.log('No tenant found');
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const activeLease = tenant.tenancyAgreements[0];
    if (!activeLease) {
      console.log('No active lease found');
      return NextResponse.json({ error: 'No active lease found' }, { status: 404 });
    }

    const response = {
      id: tenant.id,
      firstName: tenant.firstName,
      lastName: tenant.lastName,
      phone: tenant.phone,
      dateOfBirth: tenant.dateOfBirth,
      employmentStatus: tenant.employmentStatus,
      annualIncome: tenant.annualIncome,
      propertyDetails: {
        address: `${activeLease.unit.property.addressLine1}, ${activeLease.unit.property.cityTown}`,
        rentAmount: activeLease.monthlyRent,
        leaseStartDate: activeLease.startDate,
        leaseEndDate: activeLease.endDate,
        unitId: activeLease.unit.id
      },
      landlordDetails: {
        name: `${activeLease.unit.property.landlord.firstName} ${activeLease.unit.property.landlord.lastName}`,
        email: activeLease.unit.property.landlord.user.email,
        phone: activeLease.unit.property.landlord.phone
      }
    };

    console.log('Sending response:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in tenant details API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tenant details' },
      { status: 500 }
    );
  }
} 