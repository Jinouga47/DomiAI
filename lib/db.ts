import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

// Remove the direct instantiation and use the global singleton
declare global {
  var prisma: PrismaClient | undefined
}

const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export { prisma }

// Property operations
export async function createProperty(userId: string, propertyData: any) {
  console.log('1. Starting property creation process');
  return await prisma.$transaction(async (tx) => {
    console.log('2. Creating AllProperty record');
    const allProperty = await tx.allProperty.create({
      data: {
        fullAddress: `${propertyData.addressLine1}, ${propertyData.addressLine2}, ${propertyData.city}, ${propertyData.county}, ${propertyData.postCode}`,
        currentOwner: userId,
        ownershipStart: new Date(),
        ownershipHistory: [{
          ownerId: userId,
          startDate: new Date(),
          action: 'REGISTERED'
        }],
        previousOwners: []
      }
    });
    console.log('3. AllProperty created:', allProperty.id);

    console.log('4. Creating Property record');
    const property = await tx.property.create({
      data: {
        ...propertyData,
        ownerId: userId,
        allPropertyId: allProperty.id
      }
    });
    console.log('5. Property created successfully:', property.id);

    return property;
  });
}

export async function getPropertyWithDetails(propertyId: string) {
  return prisma.property.findUnique({
    where: { id: propertyId },
    include: {
      allProperty: true,
      owner: true,
    }
  });
}

export async function getLandlordProperties(userId: string) {
  console.log('Fetching properties for user:', userId);
  return await prisma.property.findMany({
    where: { ownerId: userId },
    include: {
      allProperty: true
    }
  });
}

export async function deleteProperty(propertyId: string, userId: string) {
  const property = await prisma.property.findUnique({
    where: { id: propertyId }
  });

  if (!property || property.ownerId !== userId) {
    throw new Error('Property not found or unauthorized');
  }

  return prisma.property.delete({
    where: { id: propertyId }
  });
}
