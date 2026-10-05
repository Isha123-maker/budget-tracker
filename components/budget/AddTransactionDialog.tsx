"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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
import { CATEGORIES, toDbCategory, type CategoryId } from "@/lib/categories";

type AddTransactionDialogProps = {
  onTransactionAdded: () => Promise<void>;
};

export function AddTransactionDialog({
  onTransactionAdded,
}: AddTransactionDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [category, setCategory] = useState<CategoryId>("groceries");
  const [note, setNote] = useState("");

  const [date, setDate] = useState(() => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  });

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
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();

        throw new Error(
          errorData.error?.issues?.[0]?.message ||
            "Failed to add transaction",
        );
      }

      setAmount("");
      setType("EXPENSE");
      setCategory("groceries");
      setNote("");
      setDialogOpen(false);

      await onTransactionAdded();
    } catch (error) {
      console.error(error);
      alert("Something went wrong adding your transaction. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 backdrop-blur">
      <div className="max-w-5xl mx-auto px-5 py-3">
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
              <DialogTitle className="text-xl">
                Add Transaction
              </DialogTitle>
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
                  min="1"
                  step="1"
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
                  onValueChange={(v) =>
                    setType(v as "INCOME" | "EXPENSE")
                  }
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
  );
}