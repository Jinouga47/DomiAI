/*
  Warnings:

  - You are about to drop the column `address` on the `properties` table. All the data in the column will be lost.
  - Made the column `city` on table `all_properties` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `all_properties` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `all_properties` required. This step will fail if there are existing NULL values in that column.
  - Made the column `zipCode` on table `all_properties` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `bathrooms` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bedrooms` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyType` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "all_properties" ADD COLUMN     "currentOwner" TEXT,
ADD COLUMN     "ownershipHistory" JSONB[],
ADD COLUMN     "ownershipStart" TIMESTAMP(3),
ADD COLUMN     "previousOwners" TEXT[],
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL,
ALTER COLUMN "state" SET NOT NULL,
ALTER COLUMN "zipCode" SET NOT NULL;

-- AlterTable
ALTER TABLE "properties" DROP COLUMN "address",
ADD COLUMN     "bathrooms" INTEGER NOT NULL,
ADD COLUMN     "bedrooms" INTEGER NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "propertyType" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
