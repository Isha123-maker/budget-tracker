import { generateObject } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/get-or-create-user";
import { z } from "zod";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const insightSchema = z.object({
  summary: z
    .string()
    .describe("A short, 1-2 sentence summary of spending patterns"),

  tip: z
    .string()
    .describe("One short, practical tip to help the user save money"),
});

export async function GET() {
  try {
    const dbUser = await getOrCreateUser();

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: dbUser.id,
        type: "EXPENSE",
      },
      orderBy: {
        date: "desc",
      },
      take: 20,
    });

    if (transactions.length === 0) {
      return NextResponse.json({
        summary: "You don't have any expenses recorded yet.",
        topCategory: "None",
        tip: "Add a few expenses to start getting personalized spending insights.",
      });
    }

    // Calculate total spending
    const totalSpending = transactions.reduce(
      (sum, transaction) => sum + Number(transaction.amount),
      0,
    );

    // Calculate spending by category
    const categoryTotals: Record<string, number> = {};

    for (const transaction of transactions) {
      const category = transaction.category;
      const amount = Number(transaction.amount);

      categoryTotals[category] =
        (categoryTotals[category] || 0) + amount;
    }

    // Find the category with the highest spending
    const topCategory = Object.entries(categoryTotals).reduce(
      (top, current) => {
        return current[1] > top[1] ? current : top;
      },
    );

    const topCategoryName = topCategory[0];
    const topCategoryAmount = topCategory[1];

    // Prepare category information for the AI
    const categoryBreakdown = Object.entries(categoryTotals)
      .map(
        ([category, amount]) =>
          `${category}: Rs.${amount.toLocaleString("en-PK")}`,
      )
      .join("\n");

    const prompt = `Analyze the user's recent spending based on these calculated facts.

Total spending: Rs.${totalSpending.toLocaleString("en-PK")}

Spending by category:
${categoryBreakdown}

Top spending category: ${topCategoryName}
Top category amount: Rs.${topCategoryAmount.toLocaleString("en-PK")}

Rules:
- Write plain text only.
- No markdown, bullet points, bold text, or asterisks.
- summary: exactly 1-2 short sentences describing the user's spending.
- tip: one short, practical and actionable suggestion for reducing spending.
- All monetary amounts must use Pakistani Rupees with "Rs.".
- Do not convert PKR to USD or any other currency.
- Do not invent financial numbers.
- Do not change or contradict the calculated facts above.`;

    const { object } = await generateObject({
      model: openrouter("openrouter/free"),
      schema: insightSchema,
      prompt,
    });

    return NextResponse.json({
      summary: object.summary,
      topCategory: topCategoryName,
      tip: object.tip,
    });
  } catch (error) {
    console.error("AI INSIGHT ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to generate insight",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}