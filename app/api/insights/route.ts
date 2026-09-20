import { generateText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/get-or-create-user";


const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
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

Analyze these transactions and give a short, 2-sentence summary of spending patterns.
All amounts are in Pakistani Rupees (PKR). Display monetary amounts using "Rs." only (for example, Rs.5,000). Do not convert amounts to USD or any other currency.`;

    const { text } = await generateText({
      model: openrouter("z-ai/glm-5.2:free"),
      prompt,
    });

    return NextResponse.json({ insight: text });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate insight" },
      { status: 500 },
    );
  }
}
