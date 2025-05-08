import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import { auth } from "../../auth/[...nextauth]/route";

export async function GET(
  request: NextRequest,
  context: { params: { clientId: string } }
) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientId = context.params.clientId;
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
    return NextResponse.json(
      { error: "An error occurred while fetching the client." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { clientId: string } }
) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientId = context.params.clientId;
  if (!clientId) {
    return NextResponse.json(
      { error: "Client ID is required" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const {
      name,
      birthday,
      checkingAccountNumber,
      savingsAccountNumber,
      isActive,
    } = body;

    const updateData: Prisma.ClientUpdateInput = {};
    if (name !== undefined) updateData.name = name;
    if (birthday !== undefined) updateData.birthday = birthday;
    if (checkingAccountNumber !== undefined)
      updateData.checkingAccountNumber = checkingAccountNumber;
    if (savingsAccountNumber !== undefined)
      updateData.savingsAccountNumber = savingsAccountNumber;
    if (isActive !== undefined && typeof isActive === "boolean")
      updateData.isActive = isActive;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update" },
        { status: 400 }
      );
    }

    const existingClient = await prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true },
    });
    if (!existingClient) {
      return NextResponse.json(
        { error: "Client not found for update" },
        { status: 404 }
      );
    }

    const updatedClient = await prisma.client.update({
      where: { id: clientId },
      data: updateData,
    });

    return NextResponse.json(updatedClient, { status: 200 });
  } catch (error) {
    console.error(`Error updating client ${clientId}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            error: "A client with this detail already exists.",
            fields: error.meta?.target,
          },
          { status: 409 }
        );
      }
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "An error occurred while updating the client." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { clientId: string } }
) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientId = context.params.clientId;
  if (!clientId) {
    return NextResponse.json(
      { error: "Client ID is required" },
      { status: 400 }
    );
  }

  try {
    const existingClient = await prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true },
    });

    if (!existingClient) {
      return NextResponse.json(
        { error: "Client not found for deactivation" },
        { status: 404 }
      );
    }

    const updatedClient = await prisma.client.update({
      where: { id: clientId },
      data: { isActive: false },
    });

    return NextResponse.json(
      { message: "Client deactivated successfully", client: updatedClient },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deactivating client ${clientId}:`, error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Client not found during update operation" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "An error occurred while deactivating the client." },
      { status: 500 }
    );
  }
}
