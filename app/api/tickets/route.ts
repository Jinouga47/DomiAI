import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the tenant record
    const tenant = await prisma.tenant.findFirst({
      where: { userId: session.user.id }
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.unitId || !data.title || !data.description || !data.priority || !data.preferredContact) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the maintenance ticket
    const ticket = await prisma.maintenanceTicket.create({
      data: {
        tenantId: tenant.id,
        unitId: data.unitId,
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: 'NEW',
        isEmergency: Boolean(data.isEmergency),
        accessInstructions: data.accessInstructions || null,
        preferredContact: data.preferredContact,
        availableDates: data.availableDates?.map((date: string) => new Date(date)) || [],
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
      }
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Failed to create ticket:', error);
    return NextResponse.json(
      { error: 'Failed to create maintenance ticket' },
      { status: 500 }
    );
  }
} 