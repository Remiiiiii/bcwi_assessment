import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "../../../generated/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const name = url.searchParams.get("name");
    const birthday = url.searchParams.get("birthday");
    const accountType = url.searchParams.get("accountType");

    const whereConditions: Prisma.ClientWhereInput = {};

    if (name) {
      whereConditions.name = {
        contains: name,
        mode: "insensitive",
      };
    }

    if (birthday) {
      const parts = birthday.split(/[-/]/);
      if (parts.length === 3) {
        const month = parseInt(parts[0], 10);
        const day = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);

        if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
          const date = new Date(Date.UTC(year, month - 1, day));

          if (
            date.getUTCFullYear() === year &&
            date.getUTCMonth() === month - 1 &&
            date.getUTCDate() === day
          ) {
            whereConditions.birthday = date;
          }
        }
      }
    }

    if (accountType) {
      if (accountType === "Checking") {
        whereConditions.checkingAccountNumber = { not: null };
      } else if (accountType === "Savings") {
        whereConditions.savingsAccountNumber = { not: null };
      }
    }

    if (url.searchParams.get("activeOnly") === "true") {
      whereConditions.isActive = true;
    }

    const clients = await prisma.client.findMany({
      where: whereConditions,
      orderBy: {
        displayOrder: "asc",
      },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: "Failed to fetch clients", details: errorMessage },
      { status: 500 }
    );
  }
}
