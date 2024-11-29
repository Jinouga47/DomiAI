import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateFullAddresses() {
  const allProperties = await prisma.allProperty.findMany({
    include: {
      property: true
    }
  })

  for (const ap of allProperties) {
    if (ap.property) {
      const fullAddress = [
        ap.property.addressLine1,
        ap.property.addressLine2,
        ap.property.city,
        ap.property.county,
        ap.property.postCode
      ].filter(Boolean).join(', ')

      await prisma.allProperty.update({
        where: { id: ap.id },
        data: { fullAddress }
      })
    }
  }
}

updateFullAddresses()
  .catch(console.error)
  .finally(() => prisma.$disconnect()) 