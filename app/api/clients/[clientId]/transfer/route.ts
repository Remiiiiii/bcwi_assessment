import { NextResponse, type NextRequest } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { auth } from "../../../auth/[...nextauth]/route";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

interface TransferRequestBody {
  amount: number;
  fromAccountType: "checking" | "savings";
  toAccountType: "checking" | "savings";
}

export async function POST(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
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
    const body = (await request.json()) as TransferRequestBody;
    const { amount, fromAccountType, toAccountType } = body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid transfer amount" },
        { status: 400 }
      );
    }

    if (!fromAccountType || !toAccountType) {
      return NextResponse.json(
        { error: "fromAccountType and toAccountType are required" },
        { status: 400 }
      );
    }

    if (fromAccountType === toAccountType) {
      return NextResponse.json(
        { error: "Cannot transfer to the same account type" },
        { status: 400 }
      );
    }

    if (
      !["checking", "savings"].includes(fromAccountType) ||
      !["checking", "savings"].includes(toAccountType)
    ) {
      return NextResponse.json(
        { error: "Invalid account type specified" },
        { status: 400 }
      );
    }

    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const amountToTransfer = new Decimal(amount);
    let newCheckingBalance = client.checkingBalance
      ? new Decimal(client.checkingBalance)
      : new Decimal(0);
    let newSavingsBalance = client.savingsBalance
      ? new Decimal(client.savingsBalance)
      : new Decimal(0);

    if (fromAccountType === "checking") {
      if (newCheckingBalance.lessThan(amountToTransfer)) {
        return NextResponse.json(
          { error: "Insufficient funds in checking account" },
          { status: 400 }
        );
      }
      newCheckingBalance = newCheckingBalance.minus(amountToTransfer);
      newSavingsBalance = newSavingsBalance.plus(amountToTransfer);
    } else {
      if (newSavingsBalance.lessThan(amountToTransfer)) {
        return NextResponse.json(
          { error: "Insufficient funds in savings account" },
          { status: 400 }
        );
      }
      newSavingsBalance = newSavingsBalance.minus(amountToTransfer);
      newCheckingBalance = newCheckingBalance.plus(amountToTransfer);
    }

    const updatedClient = await prisma.client.update({
      where: { id: clientId },
      data: {
        checkingBalance: newCheckingBalance,
        savingsBalance: newSavingsBalance,
      },
    });

    return NextResponse.json(updatedClient, { status: 200 });
  } catch (error) {
    console.error("Error processing transfer:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "An error occurred during the transfer." },
      { status: 500 }
    );
  }
}
