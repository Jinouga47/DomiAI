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
      where: { userId: session.user.id }
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const tickets = await prisma.maintenanceTicket.findMany({
      where: {
        tenantId: tenant.id
      },
      include: {
        unit: {
          include: {
            property: {
              select: {
                addressLine1: true
              }
            }
          }
        },
        ticketResponses: {
          include: {
            author: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error('Failed to fetch tenant tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch maintenance tickets' },
      { status: 500 }
    );
  }
} 