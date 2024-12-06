import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        units: true
      }
    });
    
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json({ property });
  } catch (error) {
    // console.error('Property fetch error:', error);
    return NextResponse.json(
      { message: 'Error fetching property' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    await prisma.property.delete({
      where: { id }
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    // console.error('Property deletion error:', error);
    return NextResponse.json(
      { message: 'Error deleting property' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // console.log('Starting PUT request');
    
    const session = await getServerSession(authOptions);
    // console.log('Session:', session);
    
    if (!session?.user?.id) {
      // console.log('Unauthorized - no session user id');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    // console.log('Property ID:', id);

    const data = await request.json();
    // console.log('Request data:', data);
    
    const { units, deletedUnitIds, ...propertyData } = data;
    // console.log('Separated data:', {
    //   propertyData,
    //   units,
    //   deletedUnitIds
    // });

    // First, delete any units that were removed
    if (deletedUnitIds?.length > 0) {
      // console.log('Deleting units:', deletedUnitIds);
      await prisma.unit.deleteMany({
        where: {
          id: {
            in: deletedUnitIds
          }
        }
      });
      // console.log('Units deleted successfully');
    }

    // Separate new and existing units
    const existingUnits = units.filter((unit: any) => !unit.id.startsWith('temp-'));
    const newUnits = units.filter((unit: any) => unit.id.startsWith('temp-'));
    // console.log('Separated units:', {
    //   existingUnits,
    //   newUnits
    // });

    // console.log('Attempting property update');
    // Update the property and handle unit changes
    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        ...propertyData,
        units: {
          update: existingUnits.map((unit: any) => {
            // console.log('Updating unit:', unit);
            return {
              where: { id: unit.id },
              data: {
                unitNumber: unit.unitNumber,
                squareMetres: unit.squareMetres,
                bedrooms: unit.bedrooms,
                bathrooms: unit.bathrooms,
                baseRentPcm: unit.baseRentPcm,
                furnishedStatus: unit.furnishedStatus,
                hmoLicense: unit.hmoLicense,
                councilTaxReference: unit.councilTaxReference
              }
            };
          }),
          create: newUnits.map((unit: any) => {
            // console.log('Creating unit:', unit);
            return {
              unitNumber: unit.unitNumber,
              squareMetres: unit.squareMetres,
              bedrooms: unit.bedrooms,
              bathrooms: unit.bathrooms,
              baseRentPcm: unit.baseRentPcm,
              furnishedStatus: unit.furnishedStatus,
              hmoLicense: unit.hmoLicense,
              councilTaxReference: unit.councilTaxReference
            };
          })
        }
      },
      include: {
        units: true
      }
    });

    // console.log('Property updated successfully:', updatedProperty);
    return NextResponse.json(updatedProperty);
  } catch (error) {
    // console.error('Property update error - Full error:', error);
    // console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
} 