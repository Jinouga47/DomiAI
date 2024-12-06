import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get landlord ID
    const landlord = await prisma.landlord.findFirst({
      where: { userId: session.user.id }
    });

    if (!landlord) {
      return NextResponse.json({ error: 'Landlord not found' }, { status: 404 });
    }

    // Fetch tenant details
    const tenant = await prisma.tenant.findFirst({
      where: {
        id: params.id,
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
        user: {
          select: {
            email: true,
            status: true
          }
        },
        tenancyAgreements: {
          where: {
            status: 'ACTIVE'
          },
          include: {
            unit: {
              include: {
                property: true
              }
            }
          },
          orderBy: {
            startDate: 'desc'
          },
          take: 1
        }
      }
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Format the response
    const activeLease = tenant.tenancyAgreements[0];
    const formattedTenant = {
      id: tenant.id,
      firstName: tenant.firstName,
      lastName: tenant.lastName,
      email: tenant.user.email,
      phone: tenant.phone,
      dateOfBirth: tenant.dateOfBirth,
      employmentStatus: tenant.employmentStatus,
      annualIncome: tenant.annualIncome,
      rightToRentCheckDate: tenant.rightToRentCheckDate,
      rightToRentExpiry: tenant.rightToRentExpiry,
      referenceCheckStatus: tenant.referenceCheckStatus,
      lease: activeLease ? {
        startDate: activeLease.startDate,
        endDate: activeLease.endDate,
        monthlyRent: activeLease.monthlyRent,
        status: activeLease.status,
        property: {
          addressLine1: activeLease.unit.property.addressLine1,
          unitNumber: activeLease.unit.unitNumber
        }
      } : null
    };

    return NextResponse.json({ tenant: formattedTenant });
  } catch (error) {
    console.error('Error fetching tenant details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tenant details' },
      { status: 500 }
    );
  }
} 