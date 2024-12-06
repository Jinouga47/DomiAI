import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, status } = await request.json();

    // Create response and update ticket status
    const updatedTicket = await prisma.maintenanceTicket.update({
      where: { id: params.id },
      data: {
        status,
        ticketResponses: {
          create: {
            message,
            isLandlord: true,
            author: {
              connect: { id: session.user.id }
            }
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
        },
        ticketResponses: {
          include: {
            author: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    return NextResponse.json({ ticket: updatedTicket });
  } catch (error) {
    console.error('Error responding to ticket:', error);
    return NextResponse.json(
      { error: 'Failed to respond to ticket' },
      { status: 500 }
    );
  }
} 