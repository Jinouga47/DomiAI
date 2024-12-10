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

    // Find the landlord record
    const landlord = await prisma.landlord.findFirst({
      where: { userId: session.user.id }
    });

    if (!landlord) {
      return NextResponse.json({ error: 'Landlord not found' }, { status: 404 });
    }

    // Get properties for this landlord
    const properties = await prisma.property.findMany({
      where: { landlordId: landlord.id },
      include: {
        units: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ properties });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get the request body
    const body = await request.json();
    console.log('Received property data:', body);

    // Validate the body has required fields
    if (!body || !body.addressLine1 || !body.cityTown || !body.postcode) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Get the landlord associated with the user
    const landlord = await prisma.landlord.findUnique({
      where: { userId: session.user.id }
    });

    if (!landlord) {
      return new NextResponse('Landlord not found', { status: 404 });
    }

    // Extract units from the body
    const { units, ...propertyData } = body;
    console.log('Separated property data:', { propertyData, units });

    // Create the property with its units
    const property = await prisma.property.create({
      data: {
        landlordId: landlord.id,
        addressLine1: propertyData.addressLine1,
        addressLine2: propertyData.addressLine2,
        cityTown: propertyData.cityTown,
        county: propertyData.county,
        postcode: propertyData.postcode,
        purchaseDate: propertyData.purchaseDate ? new Date(propertyData.purchaseDate) : null,
        propertyType: propertyData.propertyType,
        tenure: propertyData.tenure,
        councilTaxBand: propertyData.councilTaxBand,
        epcRating: propertyData.epcRating,
        units: {
          create: units.map((unit: any) => ({
            unitNumber: unit.unitNumber || null,
            squareMetres: unit.squareMetres ? Number(unit.squareMetres) : null,
            bedrooms: Number(unit.bedrooms),
            bathrooms: Number(unit.bathrooms),
            baseRentPcm: Number(unit.baseRentPcm),
            furnishedStatus: unit.furnishedStatus,
            hmoLicense: unit.hmoLicense || null,
            councilTaxReference: unit.councilTaxReference || null,
          }))
        }
      },
      include: {
        units: true
      }
    });

    console.log('Created property with units:', property);
    return NextResponse.json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    return new NextResponse('Internal Error', { status: 500 });
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
      where: { landlordId: session.user.id }
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