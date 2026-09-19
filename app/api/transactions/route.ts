import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/get-or-create-user"; // NEW import
import { z } from "zod";

const transactionSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.enum([
    "UTILITIES",
    "COMMITTEES",
    "GROCERIES",
    "TRANSPORT",
    "RENT",
    "OTHER",
  ]),
  note: z.string().optional(),
  date: z.string(),
});

// GET /api/transactions — fetch all transactions
export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
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
  try {
    const body = await request.json();

    const result = transactionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
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
      { status: 400 }
    );
  }
}