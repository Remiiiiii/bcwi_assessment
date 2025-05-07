/*
  Warnings:

  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Client";

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthday" TEXT NOT NULL,
    "checkingAccountNumber" TEXT,
    "checkingBalance" DECIMAL(10,2),
    "savingsAccountNumber" TEXT,
    "savingsBalance" DECIMAL(10,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_checkingAccountNumber_key" ON "clients"("checkingAccountNumber");

-- CreateIndex
CREATE UNIQUE INDEX "clients_savingsAccountNumber_key" ON "clients"("savingsAccountNumber");
