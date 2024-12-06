-- Create a new migration
ALTER TABLE "users" ADD COLUMN "firstName" TEXT NOT NULL DEFAULT '';
ALTER TABLE "users" ADD COLUMN "lastName" TEXT NOT NULL DEFAULT '';

-- Remove defaults after adding columns
ALTER TABLE "users" ALTER COLUMN "firstName" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "lastName" DROP DEFAULT; 