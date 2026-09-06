import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORIES, formatPKR, fromDbCategory, type CategoryId } from "@/lib/categories";
import { Receipt } from "lucide-react";

type Transaction = {
  id: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  note: string | null;
  date: string;
};

export function TransactionList({
  transactions,
  selectedCategory,
}: {
  transactions: Transaction[];
  selectedCategory: CategoryId | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center text-center py-8 gap-2">
            <Receipt className="size-8 text-muted-foreground" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground">
              {selectedCategory
                ? "No transactions in this category yet."
                : "No transactions yet. Add your first one below to start your ledger."}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {transactions.map((t) => {
              const categoryId = fromDbCategory(t.category as never) as CategoryId;
              const categoryMeta = CATEGORIES.find((c) => c.id === categoryId);
              const Icon = categoryMeta?.icon ?? Receipt;

              return (
                <li key={t.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-muted-foreground" />
                    <span>{t.note || categoryMeta?.label || t.category}</span>
                  </div>
                  <span className={t.type === "INCOME" ? "text-green-600" : "text-red-600"}>
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
  );
}