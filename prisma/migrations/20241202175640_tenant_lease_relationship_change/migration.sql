-- DropForeignKey
ALTER TABLE "tenancy_agreements" DROP CONSTRAINT "tenancy_agreements_tenantId_fkey";

-- AlterTable
ALTER TABLE "tenancy_agreements" ALTER COLUMN "tenantId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "tenancy_agreements" ADD CONSTRAINT "tenancy_agreements_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;
