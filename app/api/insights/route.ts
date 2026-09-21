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
  topCategory: z
    .string()
    .describe("The category the user spent the most money in"),
  tip: z
    .string()
    .describe("One short, practical tip to help the user save money"),
});

export async function GET() {
  try {
    const dbUser = await getOrCreateUser();

    const transactions = await prisma.transaction.findMany({
      where: { userId: dbUser.id },
      orderBy: { date: "desc" },
      take: 20,
    });

    const prompt = `Here is a list of recent transactions: ${JSON.stringify(
      transactions,
    )}.

All amounts are in Pakistani Rupees (PKR). Display monetary amounts using "Rs." only (for example, Rs.5,000). Do not convert amounts to USD or any other currency.

Rules:
- Write plain text only. No markdown, no bullet points, no bold text, no asterisks.
- summary: exactly 1-2 short sentences describing overall spending.
- topCategory: just the category name, nothing else.
- tip: a real, actionable suggestion for how the user could spend less money. It must be a piece of advice, not an observation about past spending.`;

    const { object } = await generateObject({
      model: openrouter("z-ai/glm-5.2:free"),
      schema: insightSchema,
      prompt,
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate insight" },
      { status: 500 },
    );
  }
}
