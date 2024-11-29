/*
  Warnings:

  - You are about to drop the column `dummy` on the `properties` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[allPropertyId]` on the table `properties` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `all_properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `allPropertyId` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_address_fkey";

-- AlterTable
ALTER TABLE "all_properties" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "zipCode" TEXT;

-- AlterTable
ALTER TABLE "properties" DROP COLUMN "dummy",
ADD COLUMN     "allPropertyId" TEXT NOT NULL,
ALTER COLUMN "address" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "properties_allPropertyId_key" ON "properties"("allPropertyId");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_allPropertyId_fkey" FOREIGN KEY ("allPropertyId") REFERENCES "all_properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
