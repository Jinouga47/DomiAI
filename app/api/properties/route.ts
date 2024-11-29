import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createProperty, getLandlordProperties } from '@/lib/db';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const properties = await getLandlordProperties(session.user.id);
    return NextResponse.json({ properties });
  } catch (error) {
    console.error('Properties fetch error:', error);
    return NextResponse.json(
      { message: 'Error fetching properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const property = await createProperty(session.user.id, data);
    return NextResponse.json(property);
  } catch (error) {
    console.error('Failed to create property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}

// Optional: Add a HEAD method for checking resource availability
export async function HEAD(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response('', { status: 401 });
    }
    
    const count = await prisma.property.count({
      where: { ownerId: session.user.id }
    });
    
    return new Response('', {
      status: 200,
      headers: {
        'X-Total-Count': count.toString(),
      },
    });
  } catch (error) {
    console.error('HEAD request error:', error);
    return new Response('', { status: 500 });
  }
}

// Optional: Add an OPTIONS method to describe available methods
export async function OPTIONS(req: Request) {
  console.log('OPTIONS request received');
  return new Response('', {  // Changed from null to empty string
    headers: {
      'Allow': 'GET, POST, HEAD, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, POST, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 