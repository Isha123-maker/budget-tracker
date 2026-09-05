"use client";

import { useState, useEffect } from "react";
import {
  CATEGORIES,
  formatPKR,
  fromDbCategory,
  toDbCategory,
  type CategoryId,
} from "@/lib/categories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Receipt, Plus } from "lucide-react";

type Transaction = {
  id: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  note: string | null;
  date: string;
};

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // form field state
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [category, setCategory] = useState<CategoryId>("groceries");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  async function fetchTransactions() {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setTransactions(data);
  }

  useEffect(() => {
    async function loadTransactions() {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data);
    }

    loadTransactions();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          type,
          category: toDbCategory(category),
          note,
          date,
          userId: "cmtfm2p6q0000tlk8t6gtmoj1", // TODO: replace with real logged-in user once auth exists
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add transaction");
      }

      setAmount("");
      setNote("");
      setDialogOpen(false);
      await fetchTransactions();
    } catch (error) {
      console.error(error);
      alert("Something went wrong adding your transaction. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const totalBalance = transactions.reduce((sum, t) => {
    const amt = Number(t.amount);
    return t.type === "INCOME" ? sum + amt : sum - amt;
  }, 0);

  return (
    <main className="min-h-screen bg-background pb-36">
      <header className="max-w-md mx-auto pt-10 px-5">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Personal Ledger
        </span>
        <h1 className="font-heading text-3xl mt-1">PKR Budget Tracker</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your expenses and manage your budget
        </p>
      </header>

      <section className="max-w-md mx-auto mt-6 px-5">
        <Card className="border-primary/15">
          <CardHeader>
            <CardTitle className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-4xl text-primary">
              {formatPKR(totalBalance)}
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="max-w-md mx-auto mt-6 px-5">
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              return (
                <span
                  key={c.id}
                  className="flex items-center gap-1.5 shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground"
                >
                  <Icon className="size-3.5 text-primary" />
                  {c.label}
                </span>
              );
            })}
          </div>
          <div className="pointer-events-none absolute right-0 top-0 bottom-1 w-8 bg-linear-to-l from-background to-transparent" />
        </div>
      </section>

      <section className="max-w-md mx-auto mt-6 px-5">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="flex flex-col items-center text-center py-8 gap-2">
                <Receipt
                  className="size-8 text-muted-foreground"
                  strokeWidth={1.5}
                />
                <p className="text-sm text-muted-foreground">
                  No transactions yet. Add your first one below to start your
                  ledger.
                </p>
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {transactions.map((t) => {
                  const categoryId = fromDbCategory(
                    t.category as never,
                  ) as CategoryId;
                  const categoryMeta = CATEGORIES.find(
                    (c) => c.id === categoryId,
                  );
                  const Icon = categoryMeta?.icon ?? Receipt;

                  return (
                    <li
                      key={t.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="size-4 text-muted-foreground" />
                        <span>
                          {t.note || categoryMeta?.label || t.category}
                        </span>
                      </div>
                      <span
                        className={
                          t.type === "INCOME"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {t.type === "INCOME" ? "+" : "-"}
                        {formatPKR(Number(t.amount))}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 backdrop-blur">
        <div className="max-w-md mx-auto px-5 py-3">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <Button
              className="w-full rounded-4xl"
              size="lg"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="size-4" />
              Add Transaction
            </Button>

            <DialogContent className="bg-background max-w-sm">
              <DialogHeader>
                <DialogTitle className="text-xl">Add Transaction</DialogTitle>
              </DialogHeader>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 mt-2"
              >
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="amount"
                    className="text-xs uppercase tracking-wide text-muted-foreground"
                  >
                    Amount (Rs.)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 1500"
                    className="bg-background"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Type
                  </Label>
                  <Select
                    value={type}
                    onValueChange={(v) => setType(v as "INCOME" | "EXPENSE")}
                  >
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      <SelectItem value="EXPENSE">Expense</SelectItem>
                      <SelectItem value="INCOME">Income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Category
                  </Label>
                  <Select
                    value={category}
                    onValueChange={(v) => setCategory(v as CategoryId)}
                  >
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="note"
                    className="text-xs uppercase tracking-wide text-muted-foreground"
                  >
                    Note (optional)
                  </Label>
                  <Input
                    id="note"
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Grocery run"
                    className="bg-background"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="date"
                    className="text-xs uppercase tracking-wide text-muted-foreground"
                  >
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-background"
                  />
                </div>

                <DialogFooter className="bg-transparent! border-0! p-0! mx-0! mb-0! mt-2">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? "Saving..." : "Save Transaction"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </main>
  );
}
