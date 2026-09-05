// prisma/seed.ts
// This file puts a few practice rows into your empty database tables.
// Run it with: npx prisma db seed

import { PrismaClient } from "../lib/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Create one user.
  // Every transaction and committee membership needs to belong to a user,
  // so this has to exist first.
  const user = await prisma.user.create({
    data: {
      name: "Noor",
      email: "noor@example.com",
    },
  });

  // 2. Create a committee (kameti).
  // contributionAmount = how much each member pays per cycle.
  // cycleLengthDays = how long one rotation lasts (e.g. 30 for monthly).
  const committee = await prisma.committee.create({
    data: {
      name: "Family Kameti",
      contributionAmount: 5000,
      cycleLengthDays: 30,
    },
  });

  // 3. Add our user as a member of that committee.
  // turnOrder = 1 means they're first in line to receive the payout.
  await prisma.committeeMember.create({
    data: {
      committeeId: committee.id,
      userId: user.id,
      turnOrder: 1,
      hasReceivedPayout: false,
    },
  });

  // 4. Add a handful of realistic transactions.
  // Mix of INCOME and EXPENSE, across a few categories,
  // so your dashboard has something real to display.
  await prisma.transaction.createMany({
    data: [
      {
        userId: user.id,
        amount: 45000,
        type: "INCOME",
        category: "OTHER",
        note: "Monthly stipend",
        date: new Date("2026-08-01"),
      },
      {
        userId: user.id,
        amount: 3500,
        type: "EXPENSE",
        category: "UTILITIES",
        note: "Electricity bill",
        date: new Date("2026-08-05"),
      },
      {
        userId: user.id,
        amount: 1200,
        type: "EXPENSE",
        category: "TRANSPORT",
        note: "Fuel for the week",
        date: new Date("2026-08-07"),
      },
      {
        userId: user.id,
        amount: 8000,
        type: "EXPENSE",
        category: "GROCERIES",
        note: "Monthly groceries",
        date: new Date("2026-08-10"),
      },
      {
        // This one is linked to the committee, since it's a kameti contribution
        userId: user.id,
        committeeId: committee.id,
        amount: 5000,
        type: "EXPENSE",
        category: "COMMITTEES",
        note: "Kameti contribution - August",
        date: new Date("2026-08-12"),
      },
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