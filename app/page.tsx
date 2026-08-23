import { CATEGORIES, formatPKR } from "@/lib/categories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, Plus } from "lucide-react";

export default function Home() {
  const totalBalance = 0; // TODO (Week 4): replace with real Zustand/DB state

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
          </CardContent>
        </Card>
      </section>

      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 backdrop-blur">
        <div className="max-w-md mx-auto px-5 py-3">
          <Button className="w-full rounded-4xl" size="lg">
            <Plus className="size-4" />
            Add Transaction
          </Button>
        </div>
      </div>
    </main>
  );
}
