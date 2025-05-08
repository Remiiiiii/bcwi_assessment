/*
  Warnings:

  - You are about to drop the column `account` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `balance` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "account",
DROP COLUMN "balance",
DROP COLUMN "type",
ADD COLUMN     "checkingAccountNumber" TEXT,
ADD COLUMN     "checkingBalance" DECIMAL(10,2) DEFAULT 0,
ADD COLUMN     "savingsAccountNumber" TEXT,
ADD COLUMN     "savingsBalance" DECIMAL(10,2) DEFAULT 0;
