import { NextResponse, NextRequest } from "next/server";
import { PrismaClient, ClientType } from "../../generated/prisma"; // Corrected path
import { auth } from "../auth/[...nextauth]/route";
import { Prisma } from "../../generated/prisma";

// Temporarily removing auth to test Prisma access
// import { NextAuth } from "@auth/nextjs"; // Named import for NextAuth
// import { authOptions as baseAuthOptions } from "../auth/[...nextauth]/route"; // Your AuthConfig

const prisma = new PrismaClient();

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
  // Use the imported auth helper from your v5 setup
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log(
    "Authenticated user attempting to fetch clients:",
    session.user?.email
  );

  // Get specific query parameters based on UI
  const name = request.nextUrl.searchParams.get("name") || "";
  const birthday = request.nextUrl.searchParams.get("birthday") || ""; // Expecting MM / DD / YYYY format potentially
  const type = request.nextUrl.searchParams.get("type") as ClientType | null;

  // Build Prisma where clause for specific fields
  const whereConditions: Prisma.ClientWhereInput[] = []; // Use an array for AND conditions

  if (name) {
    whereConditions.push({ name: { contains: name, mode: "insensitive" } });
  }

  if (birthday) {
    // Basic search for birthday string. Consider more robust date parsing/comparison if needed.
    whereConditions.push({ birthday: { contains: birthday } });
  }

  if (type && Object.values(ClientType).includes(type)) {
    whereConditions.push({ type: type });
  }

  // Combine conditions with AND
  const whereClause =
    whereConditions.length > 0 ? { AND: whereConditions } : {};

  console.log(
    "Fetching clients with where clause:",
    JSON.stringify(whereClause)
  );

  try {
    const clients = await prisma.client.findMany({
      where: whereClause,
      orderBy: { name: "asc" },
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
