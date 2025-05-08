/*
  Warnings:

  - Changed the type of `birthday` on the `clients` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "clients" DROP COLUMN "birthday",
ADD COLUMN     "birthday" TIMESTAMP(3) NOT NULL;
