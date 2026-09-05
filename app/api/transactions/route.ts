import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET /api/transactions — fetch all transactions
export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: "desc" },
    })
    return NextResponse.json(transactions)
  } catch (error) {
     console.error(error)
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    )
  }
}

// POST /api/transactions — create a new transaction
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, type, category, note, date, userId } = body

    const transaction = await prisma.transaction.create({
      data: {
        amount,
        type,
        category,
        note,
        date: new Date(date),
        userId,
      },
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
     console.error(error)
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 400 }
    )
  }
}