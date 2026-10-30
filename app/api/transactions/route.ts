import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/get-or-create-user"; // NEW import
import { transactionSchema } from "@/lib/validation/transaction";
import { auth } from "@clerk/nextjs/server";

// GET /api/transactions — fetch all transactions
export async function GET() {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const dbUser = await getOrCreateUser();

    const transactions = await prisma.transaction.findMany({
      where: { userId: dbUser.id },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(transactions);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 },
    );
  }
}

// POST /api/transactions — create a new transaction

export async function POST(request: Request) {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();

    const result = transactionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const { amount, type, category, note, date } = result.data;

    const dbUser = await getOrCreateUser();

    const transaction = await prisma.transaction.create({
      data: {
        amount,
        type,
        category,
        note,
        date: new Date(date),
        userId: dbUser.id,
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 400 },
    );
  }
}
