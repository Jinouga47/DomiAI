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

    // Fetch maintenance tickets for properties owned by this landlord
    const tickets = await prisma.maintenanceTicket.findMany({
      where: {
        unit: {
          property: {
            landlordId: landlord.id
          }
        }
      },
      include: {
        tenant: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        unit: {
          include: {
            property: {
              select: {
                addressLine1: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Add default status if missing
    const formattedTickets = tickets.map(ticket => ({
      ...ticket,
      status: ticket.status || 'NEW',
      priority: ticket.priority || 'ROUTINE'
    }));

    return NextResponse.json({ tickets: formattedTickets });
  } catch (error) {
    console.error('Failed to fetch landlord tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch maintenance tickets' },
      { status: 500 }
    );
  }
} 