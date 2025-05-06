-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('SAVINGS', 'CHECKING');

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthday" TEXT NOT NULL,
    "type" "ClientType" NOT NULL,
    "account" TEXT NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);
