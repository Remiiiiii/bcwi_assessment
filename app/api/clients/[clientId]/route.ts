import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "../../../generated/prisma";
import { auth } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

interface RouteParams {
  params: {
    clientId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { clientId } = params;

  if (!clientId) {
    return NextResponse.json(
      { error: "Client ID is required" },
      { status: 400 }
    );
  }

  try {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json(client, { status: 200 });
  } catch (error) {
    console.error(`Error fetching client ${clientId}:`, error);
    // Check if error is due to invalid ID format (if applicable, e.g., not a valid UUID/CUID)

    return NextResponse.json(
      { error: "An error occurred while fetching the client." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { clientId } = params;

  if (!clientId) {
    return NextResponse.json(
      { error: "Client ID is required" },
      { status: 400 }
    );
  }

  try {
    // Check if client exists before attempting update (optional but good practice)
    const existingClient = await prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true }, // Only select id to check existence
    });

    if (!existingClient) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Update the client to set isActive to false
    const updatedClient = await prisma.client.update({
      where: { id: clientId },
      data: { isActive: false },
    });

    return NextResponse.json(updatedClient, { status: 200 });
  } catch (error) {
    console.error(`Error closing account for client ${clientId}:`, error);
    // Add specific error handling if needed, e.g., Prisma errors
    return NextResponse.json(
      { error: "An error occurred while closing the account." },
      { status: 500 }
    );
  }
}

// Placeholder for DELETE (Hard Delete - less likely needed if soft deleting)
// export async function DELETE(request: NextRequest, { params }: RouteParams) { ... }
