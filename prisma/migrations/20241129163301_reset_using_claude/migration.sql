/*
  Warnings:

  - You are about to drop the column `allPropertyId` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `bathrooms` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `bedrooms` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `postCode` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `all_properties` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cityTown` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `councilTaxBand` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `epcRating` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `landlordId` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postcode` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenure` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `propertyType` on the `properties` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('DETACHED', 'SEMI_DETACHED', 'TERRACED', 'FLAT');

-- CreateEnum
CREATE TYPE "TenureType" AS ENUM ('FREEHOLD', 'LEASEHOLD');

-- CreateEnum
CREATE TYPE "FurnishedStatus" AS ENUM ('FURNISHED', 'PART_FURNISHED', 'UNFURNISHED');

-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('EMPLOYED', 'SELF_EMPLOYED', 'RETIRED', 'STUDENT', 'UNEMPLOYED');

-- CreateEnum
CREATE TYPE "ReferenceCheckStatus" AS ENUM ('PENDING', 'PASSED', 'FAILED', 'IN_PROGRESS');

-- CreateEnum
CREATE TYPE "TenancyType" AS ENUM ('AST', 'ROOM_ONLY', 'HMO');

-- CreateEnum
CREATE TYPE "AgreementStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "RenewalStatus" AS ENUM ('NOT_RENEWING', 'PENDING_RENEWAL', 'RENEWED');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('BANK_TRANSFER', 'STANDING_ORDER', 'DIRECT_DEBIT');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('ROUTINE', 'URGENT', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'AWAITING_PARTS', 'REQUIRES_QUOTE', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ContactMethod" AS ENUM ('EMAIL', 'PHONE', 'SMS');

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_allPropertyId_fkey";

-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_ownerId_fkey";

-- DropIndex
DROP INDEX "properties_allPropertyId_key";

-- AlterTable
ALTER TABLE "properties" DROP COLUMN "allPropertyId",
DROP COLUMN "bathrooms",
DROP COLUMN "bedrooms",
DROP COLUMN "city",
DROP COLUMN "description",
DROP COLUMN "ownerId",
DROP COLUMN "postCode",
DROP COLUMN "title",
ADD COLUMN     "cityTown" TEXT NOT NULL,
ADD COLUMN     "councilTaxBand" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "epcRating" TEXT NOT NULL,
ADD COLUMN     "landlordId" TEXT NOT NULL,
ADD COLUMN     "postcode" TEXT NOT NULL,
ADD COLUMN     "purchaseDate" TIMESTAMP(3),
ADD COLUMN     "tenure" "TenureType" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "propertyType",
ADD COLUMN     "propertyType" "PropertyType" NOT NULL,
ALTER COLUMN "addressLine2" DROP NOT NULL,
ALTER COLUMN "county" DROP NOT NULL;

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "VerificationToken";

-- DropTable
DROP TABLE "all_properties";

-- CreateTable
CREATE TABLE "landlords" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "utrNumber" TEXT NOT NULL,
    "gasSafetyCertificateExpiry" TIMESTAMP(3),
    "epcCertificateExpiry" TIMESTAMP(3),
    "electricalSafetyCertExpiry" TIMESTAMP(3),
    "depositProtectionSchemeId" TEXT,

    CONSTRAINT "landlords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "propertyId" TEXT NOT NULL,
    "unitNumber" TEXT,
    "squareMetres" DOUBLE PRECISION,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "baseRentPcm" DECIMAL(10,2) NOT NULL,
    "furnishedStatus" "FurnishedStatus" NOT NULL,
    "hmoLicense" TEXT,
    "councilTaxReference" TEXT,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "nationalInsuranceNo" TEXT NOT NULL,
    "rightToRentCheckDate" TIMESTAMP(3) NOT NULL,
    "rightToRentExpiry" TIMESTAMP(3),
    "employmentStatus" "EmploymentStatus" NOT NULL,
    "annualIncome" DECIMAL(10,2),
    "referenceCheckStatus" "ReferenceCheckStatus" NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenancy_agreements" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "unitId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "tenancyType" "TenancyType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "monthlyRent" DECIMAL(10,2) NOT NULL,
    "depositAmount" DECIMAL(10,2) NOT NULL,
    "depositProtectionRef" TEXT NOT NULL,
    "breakClauseDate" TIMESTAMP(3),
    "noticePeriodDays" INTEGER NOT NULL,
    "status" "AgreementStatus" NOT NULL,
    "renewalStatus" "RenewalStatus" NOT NULL,

    CONSTRAINT "tenancy_agreements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rent_payments" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenancyAgreementId" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "paymentType" "PaymentType" NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "isLate" BOOLEAN NOT NULL DEFAULT false,
    "referenceNumber" TEXT,

    CONSTRAINT "rent_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_tickets" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "unitId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "TicketPriority" NOT NULL,
    "status" "TicketStatus" NOT NULL,
    "isEmergency" BOOLEAN NOT NULL DEFAULT false,
    "accessInstructions" TEXT,
    "preferredContact" "ContactMethod" NOT NULL,
    "availableDates" TIMESTAMP(3)[],

    CONSTRAINT "maintenance_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_updates" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ticketId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "statusChange" "TicketStatus" NOT NULL,
    "scheduledVisitDate" TIMESTAMP(3),
    "contractorDetails" TEXT,

    CONSTRAINT "ticket_updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_comments" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ticketId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "followUpRequired" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ticket_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "landlords_email_key" ON "landlords"("email");

-- CreateIndex
CREATE UNIQUE INDEX "landlords_utrNumber_key" ON "landlords"("utrNumber");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_email_key" ON "tenants"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_nationalInsuranceNo_key" ON "tenants"("nationalInsuranceNo");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_landlordId_fkey" FOREIGN KEY ("landlordId") REFERENCES "landlords"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenancy_agreements" ADD CONSTRAINT "tenancy_agreements_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenancy_agreements" ADD CONSTRAINT "tenancy_agreements_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rent_payments" ADD CONSTRAINT "rent_payments_tenancyAgreementId_fkey" FOREIGN KEY ("tenancyAgreementId") REFERENCES "tenancy_agreements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_tickets" ADD CONSTRAINT "maintenance_tickets_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_tickets" ADD CONSTRAINT "maintenance_tickets_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_updates" ADD CONSTRAINT "ticket_updates_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "maintenance_tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_comments" ADD CONSTRAINT "ticket_comments_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "maintenance_tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_comments" ADD CONSTRAINT "ticket_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
