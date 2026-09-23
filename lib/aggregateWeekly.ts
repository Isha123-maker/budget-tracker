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
  d.setDate(d.getDate() - day); // roll back to the Sunday of that week
  return d.toISOString().slice(0, 10); // "2026-08-03" format
}

export function aggregateWeekly(transactions: Transaction[]): WeeklyPoint[] {
  const buckets: Record<string, WeeklyPoint> = {};

  for (const t of transactions) {
    const weekKey = getWeekStart(new Date(t.date));

    if (!buckets[weekKey]) {
      buckets[weekKey] = { week: weekKey, income: 0, expense: 0 };
    }

    const amount = Number(t.amount);

    if (t.type === "INCOME") {
      buckets[weekKey].income += amount;
    } else {
      buckets[weekKey].expense += amount;
    }
  }

  // Convert the object of buckets into a sorted array (oldest week first)
  return Object.values(buckets).sort((a, b) => a.week.localeCompare(b.week));
}