type Transaction = {
  amount: string;
  type: "INCOME" | "EXPENSE";
  date: string;
};

type WeeklyPoint = {
  week: string;
  income: number;
  expense: number;
};

function getWeekStart(date: Date): string {
  const d = new Date(date);

  const day = d.getDay(); // 0 = Sunday, 1 = Monday, etc.
  d.setDate(d.getDate() - day);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const dayOfMonth = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${dayOfMonth}`;
}

export function aggregateWeekly(transactions: Transaction[]): WeeklyPoint[] {
  const buckets: Record<string, WeeklyPoint> = {};

  for (const t of transactions) {
    const weekKey = getWeekStart(new Date(t.date));

    if (!buckets[weekKey]) {
      buckets[weekKey] = {
        week: weekKey,
        income: 0,
        expense: 0,
      };
    }

    const amount = Number(t.amount);

    if (t.type === "INCOME") {
      buckets[weekKey].income += amount;
    } else {
      buckets[weekKey].expense += amount;
    }
  }

  return Object.values(buckets).sort((a, b) =>
    a.week.localeCompare(b.week)
  );
}