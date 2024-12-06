import { PrismaClient } from '@prisma/client'

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
  console.log('2. Looking up landlord for user:', userId);
  
  // First find the landlord record for this user
  const landlord = await prisma.landlord.findFirst({
    where: { user: { id: userId } }
  });

  if (!landlord) {
    console.log('3. No landlord profile found for user:', userId);
    throw new Error('Landlord profile not found');
  }

  console.log('4. Found landlord profile:', landlord.id);
  console.log('5. Creating property record');

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
    }
  });

  console.log('6. Property created successfully:', property.id);
  return property;
}

export async function getPropertyWithDetails(propertyId: string) {
  console.log('Fetching property details for:', propertyId);
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: {
      landlord: true,
      units: true
    }
  });
  console.log('Property details retrieved:', property?.id);
  return property;
}

export async function getLandlordProperties(userId: string) {
  console.log('1. Fetching properties for user:', userId);
  
  // First find the landlord record
  console.log('2. Looking up landlord profile');
  const landlord = await prisma.landlord.findFirst({
    where: { user: { id: userId } }
  });

  if (!landlord) {
    console.log('3. No landlord profile found');
    throw new Error('Landlord profile not found');
  }

  console.log('4. Found landlord profile:', landlord.id);
  console.log('5. Fetching properties');

  const properties = await prisma.property.findMany({
    where: { landlordId: landlord.id },
    include: {
      units: true
    }
  });

  console.log(`6. Found ${properties.length} properties`);
  return properties;
}

export async function deleteProperty(propertyId: string, userId: string) {
  console.log('1. Starting property deletion process');
  console.log('2. Looking up landlord profile');
  
  // First find the landlord record
  const landlord = await prisma.landlord.findFirst({
    where: { user: { id: userId } }
  });

  if (!landlord) {
    console.log('3. No landlord profile found');
    throw new Error('Landlord profile not found');
  }

  console.log('4. Found landlord profile:', landlord.id);
  console.log('5. Verifying property ownership');

  const property = await prisma.property.findUnique({
    where: { id: propertyId }
  });

  if (!property || property.landlordId !== landlord.id) {
    console.log('6. Property not found or unauthorized');
    throw new Error('Property not found or unauthorized');
  }

  console.log('7. Deleting property');
  const deletedProperty = await prisma.property.delete({
    where: { id: propertyId }
  });

  console.log('8. Property deleted successfully:', deletedProperty.id);
  return deletedProperty;
}
