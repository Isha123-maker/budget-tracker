"use client";

import { useState, useEffect, useCallback } from "react";
import { fromDbCategory, type CategoryId } from "@/lib/categories";
import { Category as PrismaCategory } from "@/lib/generated/prisma/client";
import { BalanceCard } from "@/components/budget/BalanceCard";
import { CategoryFilter } from "@/components/budget/CategoryFilter";
import { TransactionList } from "@/components/budget/TransactionList";
import { aggregateWeekly } from "@/lib/aggregateWeekly";
import { SpendingTrendChart } from "@/components/budget/SpendingTrendChart";
import { AIInsightCard } from "@/components/budget/AIInsightCard";
import { AddTransactionDialog } from "@/components/budget/AddTransactionDialog";

type Transaction = {
  id: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  category: PrismaCategory;
  note: string | null;
  date: string;
};

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(
    null,
  );

  const fetchTransactions = useCallback(async () => {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setTransactions(data);
  }, []);

  useEffect(() => {
    async function loadTransactions() {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data);
    }

    void loadTransactions();
  }, []);

  const totalBalance = transactions.reduce((sum, t) => {
    const amt = Number(t.amount);
    return t.type === "INCOME" ? sum + amt : sum - amt;
  }, 0);

  const filteredTransactions = selectedCategory
    ? transactions.filter(
        (t) => fromDbCategory(t.category) === selectedCategory,
      )
    : transactions;

  const weeklyData = aggregateWeekly(transactions);

  return (
    <main className="min-h-screen bg-background pb-36">
      <header className="max-w-5xl mx-auto pt-10 px-5">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Personal Ledger
        </span>
        <h1 className="font-heading text-3xl mt-1">PKR Budget Tracker</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your expenses and manage your budget
        </p>
      </header>

      <section className="max-w-5xl mx-auto mt-6 px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AIInsightCard />

          <BalanceCard totalBalance={totalBalance} />
        </div>
      </section>

      <section className="max-w-5xl mx-auto mt-6 px-5">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={(id) => setSelectedCategory(id)}
        />
      </section>

      <section className="max-w-5xl mx-auto mt-6 px-5">
        <TransactionList
          transactions={filteredTransactions}
          selectedCategory={selectedCategory}
        />
      </section>

      <section className="max-w-5xl mx-auto mt-6 px-5">
        <SpendingTrendChart data={weeklyData} />
      </section>

      <AddTransactionDialog onTransactionAdded={fetchTransactions} />
      <footer className="max-w-5xl mx-auto mt-10 px-5 pb-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} PKR Budget Tracker. Built by Noor.
      </footer>
    </main>
  );
}
