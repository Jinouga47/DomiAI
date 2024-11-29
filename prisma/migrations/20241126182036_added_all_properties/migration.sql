-- CreateTable
CREATE TABLE "all_properties" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "all_properties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "all_properties_address_key" ON "all_properties"("address");

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_address_fkey" FOREIGN KEY ("address") REFERENCES "all_properties"("address") ON DELETE RESTRICT ON UPDATE CASCADE;
