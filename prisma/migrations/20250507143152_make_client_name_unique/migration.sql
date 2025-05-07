/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Client_account_key";

-- CreateIndex
CREATE UNIQUE INDEX "Client_name_key" ON "Client"("name");
