/*
  Warnings:

  - You are about to drop the column `address` on the `all_properties` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `all_properties` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `all_properties` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `all_properties` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `all_properties` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[fullAddress]` on the table `all_properties` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addressLine1` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressLine2` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `county` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postCode` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_ownerId_fkey";

-- DropIndex
DROP INDEX "all_properties_address_key";

-- AlterTable
ALTER TABLE "all_properties" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "state",
DROP COLUMN "zipCode",
ADD COLUMN     "fullAddress" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "properties" DROP COLUMN "location",
DROP COLUMN "price",
ADD COLUMN     "addressLine1" TEXT NOT NULL,
ADD COLUMN     "addressLine2" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "county" TEXT NOT NULL,
ADD COLUMN     "postCode" TEXT NOT NULL;

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Landlord" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "password" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "Landlord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Landlord_email_key" ON "Landlord"("email");

-- CreateIndex
CREATE UNIQUE INDEX "all_properties_fullAddress_key" ON "all_properties"("fullAddress");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Landlord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Landlord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Landlord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
