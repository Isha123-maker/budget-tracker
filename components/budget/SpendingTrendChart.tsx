"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WeeklyPoint = {
  week: string;
  income: number;
  expense: number;
};

export function SpendingTrendChart({ data }: { data: WeeklyPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Income vs Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#16302A" strokeWidth={2} name="Income" />
              <Line type="monotone" dataKey="expense" stroke="#9C3B2E" strokeWidth={2} name="Expense" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}