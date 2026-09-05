import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// PATCH /api/transactions/[id] — update one transaction
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { amount, type, category, note, date } = body

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        amount,
        type,
        category,
        note,
        date: date ? new Date(date) : undefined,
      },
    })

    return NextResponse.json(transaction)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 400 }
    )
  }
}

// DELETE /api/transactions/[id] — delete one transaction
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.transaction.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Transaction deleted" })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 400 }
    )
  }
}