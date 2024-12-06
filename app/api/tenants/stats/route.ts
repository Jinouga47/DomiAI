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

    // Get landlord ID
    const landlord = await prisma.landlord.findFirst({
      where: { userId: session.user.id }
    });

    if (!landlord) {
      return NextResponse.json({ error: 'Landlord not found' }, { status: 404 });
    }

    // Get all tenants with active leases for this landlord's properties
    const tenancyAgreements = await prisma.tenancyAgreement.findMany({
      where: {
        unit: {
          property: {
            landlordId: landlord.id
          }
        },
        status: 'ACTIVE'
      },
      include: {
        tenant: true
      }
    });

    // Calculate stats
    const uniqueTenants = new Set(tenancyAgreements.map(lease => lease.tenantId).filter(Boolean));
    const totalRent = tenancyAgreements.reduce((sum, lease) => {
      // Convert Decimal to number for calculation
      const rentAmount = lease.monthlyRent ? Number(lease.monthlyRent) : 0;
      return sum + rentAmount;
    }, 0);

    return NextResponse.json({
      totalTenants: uniqueTenants.size,
      activeLeases: tenancyAgreements.length,
      totalRent: Math.round(totalRent * 100) / 100 // Round to 2 decimal places
    });
  } catch (error) {
    // console.error('Error fetching tenant stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tenant statistics' },
      { status: 500 }
    );
  }
} 