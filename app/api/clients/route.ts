import { NextResponse, NextRequest } from "next/server";
// import { PrismaClient } from "../../generated/prisma"; // Remove old import
import { auth } from "../auth/[...nextauth]/route";
import { Prisma } from "../../generated/prisma";
import prisma from "@/lib/prisma"; // Import shared instance

// Temporarily removing auth to test Prisma access
// import { NextAuth } from "@auth/nextjs"; // Named import for NextAuth
// import { authOptions as baseAuthOptions } from "../auth/[...nextauth]/route"; // Your AuthConfig

// const prisma = new PrismaClient(); // Remove instantiation here

// No longer need localV4AuthOptions
// const localV4AuthOptions: NextAuthOptions = { ... };

// const nextAuthConfigForHelper = {
//   ...baseAuthOptions,
//   callbacks: {
//     ...(baseAuthOptions.callbacks || {}),
//     authorized: ({ auth }) => !!auth, // If auth object exists, consider authorized for this helper's purpose
//   },
// };
// const { auth: getSession } = NextAuth(nextAuthConfigForHelper);

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const nameParam = request.nextUrl.searchParams.get("name");
  const birthdayParam = request.nextUrl.searchParams.get("birthday");
  const accountType = request.nextUrl.searchParams.get("accountType");
  const activeOnly = request.nextUrl.searchParams.get("activeOnly") === "true";

  const whereConditions: Prisma.ClientWhereInput[] = [];

  if (nameParam) {
    whereConditions.push({
      name: { contains: nameParam.trim(), mode: "insensitive" },
    });
  }

  if (birthdayParam) {
    try {
      const parts = birthdayParam.split("/");
      if (parts.length === 3) {
        const month = parseInt(parts[0], 10);
        const day = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);

        const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
        const endDate = new Date(
          Date.UTC(year, month - 1, day, 23, 59, 59, 999)
        );

        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
          whereConditions.push({
            birthday: {
              gte: startDate,
              lte: endDate,
            } as Prisma.DateTimeFilter,
          });
        } else {
          console.warn(
            "Invalid date components received for birthday:",
            birthdayParam
          );
        }
      } else {
        console.warn(
          "Invalid date string structure for birthday (expected MM/DD/YYYY):",
          birthdayParam
        );
      }
    } catch (e) {
      console.error("Error parsing birthday parameter:", e);
    }
  }

  if (accountType === "Checking") {
    whereConditions.push({ checkingAccountNumber: { not: null } });
  } else if (accountType === "Savings") {
    whereConditions.push({ savingsAccountNumber: { not: null } });
  }

  if (activeOnly) {
    whereConditions.push({ isActive: true });
  }

  const whereClause =
    whereConditions.length > 0 ? { AND: whereConditions } : {};

  try {
    const clients = await prisma.client.findMany({
      where: whereClause,
      orderBy: {
        displayOrder: "asc",
      },
    });

    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching clients." },
      { status: 500 }
    );
  }
}
