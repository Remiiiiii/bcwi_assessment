/*
  Warnings:

  - A unique constraint covering the columns `[account]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Client_account_key" ON "Client"("account");
