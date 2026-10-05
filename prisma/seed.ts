// prisma/seed.ts

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";

const prisma = new PrismaClient();

const SEED_CLERK_ID = process.env.SEED_CLERK_ID;

async function main() {
  if (!SEED_CLERK_ID) {
    throw new Error(
      "SEED_CLERK_ID is not set. Add it to your environment variables before running the seed."
    );
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: SEED_CLERK_ID },
  });

  if (!user) {
    throw new Error(
      "Seed user not found. Sign in through Clerk at least once so getOrCreateUser() creates the user row, then run the seed again."
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
    where: {
      committeeId_userId: {
        committeeId: committee.id,
        userId: user.id,
      },
    },
    update: {},
    create: {
      committeeId: committee.id,
      userId: user.id,
      turnOrder: 1,
      hasReceivedPayout: false,
    },
  });

  // Delete ONLY transactions created by this seed.
  await prisma.transaction.deleteMany({
    where: {
      userId: user.id,
      note: {
        startsWith: "[SEED]",
      },
    },
  });

  await prisma.transaction.createMany({
    data: [
      {
        userId: user.id,
        amount: 45000,
        type: "INCOME",
        category: "OTHER",
        note: "[SEED] Monthly stipend",
        date: new Date("2026-08-01"),
      },
      {
        userId: user.id,
        amount: 3500,
        type: "EXPENSE",
        category: "UTILITIES",
        note: "[SEED] Electricity bill",
        date: new Date("2026-08-03"),
      },
      {
        userId: user.id,
        amount: 1200,
        type: "EXPENSE",
        category: "TRANSPORT",
        note: "[SEED] Fuel",
        date: new Date("2026-08-05"),
      },
      {
        userId: user.id,
        amount: 8000,
        type: "EXPENSE",
        category: "GROCERIES",
        note: "[SEED] Monthly groceries",
        date: new Date("2026-08-07"),
      },
      {
        userId: user.id,
        committeeId: committee.id,
        amount: 5000,
        type: "EXPENSE",
        category: "COMMITTEES",
        note: "[SEED] Kameti - August",
        date: new Date("2026-08-10"),
      },
      {
        userId: user.id,
        amount: 2500,
        type: "EXPENSE",
        category: "GROCERIES",
        note: "[SEED] Extra groceries",
        date: new Date("2026-08-14"),
      },
      {
        userId: user.id,
        amount: 1800,
        type: "EXPENSE",
        category: "TRANSPORT",
        note: "[SEED] Fuel",
        date: new Date("2026-08-18"),
      },
      {
        userId: user.id,
        amount: 4500,
        type: "EXPENSE",
        category: "RENT",
        note: "[SEED] Rent - August",
        date: new Date("2026-08-20"),
      },
      {
        userId: user.id,
        amount: 900,
        type: "EXPENSE",
        category: "OTHER",
        note: "[SEED] Misc",
        date: new Date("2026-08-24"),
      },
      {
        userId: user.id,
        amount: 45000,
        type: "INCOME",
        category: "OTHER",
        note: "[SEED] Monthly stipend",
        date: new Date("2026-09-01"),
      },
      {
        userId: user.id,
        amount: 3800,
        type: "EXPENSE",
        category: "UTILITIES",
        note: "[SEED] Electricity bill",
        date: new Date("2026-09-04"),
      },
      {
        userId: user.id,
        amount: 7500,
        type: "EXPENSE",
        category: "GROCERIES",
        note: "[SEED] Monthly groceries",
        date: new Date("2026-09-08"),
      },
      {
        userId: user.id,
        committeeId: committee.id,
        amount: 5000,
        type: "EXPENSE",
        category: "COMMITTEES",
        note: "[SEED] Kameti - September",
        date: new Date("2026-09-10"),
      },
      {
        userId: user.id,
        amount: 1500,
        type: "EXPENSE",
        category: "TRANSPORT",
        note: "[SEED] Fuel",
        date: new Date("2026-09-13"),
      },
      {
        userId: user.id,
        amount: 4500,
        type: "EXPENSE",
        category: "RENT",
        note: "[SEED] Rent - September",
        date: new Date("2026-09-20"),
      },
    ],
  });

  console.log("Seed finished successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });