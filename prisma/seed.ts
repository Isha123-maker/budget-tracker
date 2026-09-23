// prisma/seed.ts
import { PrismaClient } from "../lib/generated/prisma/client";

const prisma = new PrismaClient();

const ISHA_CLERK_ID = "user_3J31F8GA4qaE0fvgYyQmINm9Fyu";

async function main() {
  const user = await prisma.user.findUnique({
    where: { clerkId: ISHA_CLERK_ID },
  });

  if (!user) {
    throw new Error(
      "Isha's user not found. Sign in through Clerk at least once so getOrCreateUser() creates her row, then re-run this seed."
    );
  }

  const committee = await prisma.committee.upsert({
    where: { id: "seed-committee-id" },
    update: {},
    create: {
      id: "seed-committee-id",
      name: "Family Kameti",
      contributionAmount: 5000,
      cycleLengthDays: 30,
    },
  });

  await prisma.committeeMember.upsert({
    where: { committeeId_userId: { committeeId: committee.id, userId: user.id } },
    update: {},
    create: {
      committeeId: committee.id,
      userId: user.id,
      turnOrder: 1,
      hasReceivedPayout: false,
    },
  });

  // Clear old transactions for Isha so re-running this doesn't pile up duplicates
  await prisma.transaction.deleteMany({ where: { userId: user.id } });

  await prisma.transaction.createMany({
    data: [
      { userId: user.id, amount: 45000, type: "INCOME", category: "OTHER", note: "Monthly stipend", date: new Date("2026-08-01") },
      { userId: user.id, amount: 3500, type: "EXPENSE", category: "UTILITIES", note: "Electricity bill", date: new Date("2026-08-03") },
      { userId: user.id, amount: 1200, type: "EXPENSE", category: "TRANSPORT", note: "Fuel", date: new Date("2026-08-05") },
      { userId: user.id, amount: 8000, type: "EXPENSE", category: "GROCERIES", note: "Monthly groceries", date: new Date("2026-08-07") },
      { userId: user.id, committeeId: committee.id, amount: 5000, type: "EXPENSE", category: "COMMITTEES", note: "Kameti - August", date: new Date("2026-08-10") },
      { userId: user.id, amount: 2500, type: "EXPENSE", category: "GROCERIES", note: "Extra groceries", date: new Date("2026-08-14") },
      { userId: user.id, amount: 1800, type: "EXPENSE", category: "TRANSPORT", note: "Fuel", date: new Date("2026-08-18") },
      { userId: user.id, amount: 4500, type: "EXPENSE", category: "RENT", note: "Rent - August", date: new Date("2026-08-20") },
      { userId: user.id, amount: 900, type: "EXPENSE", category: "OTHER", note: "Misc", date: new Date("2026-08-24") },
      { userId: user.id, amount: 45000, type: "INCOME", category: "OTHER", note: "Monthly stipend", date: new Date("2026-09-01") },
      { userId: user.id, amount: 3800, type: "EXPENSE", category: "UTILITIES", note: "Electricity bill", date: new Date("2026-09-04") },
      { userId: user.id, amount: 7500, type: "EXPENSE", category: "GROCERIES", note: "Monthly groceries", date: new Date("2026-09-08") },
      { userId: user.id, committeeId: committee.id, amount: 5000, type: "EXPENSE", category: "COMMITTEES", note: "Kameti - September", date: new Date("2026-09-10") },
      { userId: user.id, amount: 1500, type: "EXPENSE", category: "TRANSPORT", note: "Fuel", date: new Date("2026-09-13") },
      { userId: user.id, amount: 4500, type: "EXPENSE", category: "RENT", note: "Rent - September", date: new Date("2026-09-20") },
    ],
  });

  console.log("Seed finished. Check Prisma Studio to see the rows.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });