"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Insight = {
  summary: string;
  topCategory: string;
  tip: string;
};

export function AIInsightCard() {
  const [insight, setInsight] = useState<Insight | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightError, setInsightError] = useState<string | null>(null);

  async function generateInsight() {
    setInsightLoading(true);
    setInsightError(null);

    try {
      const res = await fetch("/api/insights");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate insight");
      }

      setInsight(data);
    } catch (error) {
      console.error("Insight request failed:", error);

      setInsight(null);
      setInsightError(
        "We couldn't generate your insight right now. Please try again.",
      );
    } finally {
      setInsightLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-primary/15 bg-card p-4">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
        AI Insight
      </p>

      {insightLoading ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            Analyzing your spending...
          </p>

          <Button
            variant="outline"
            size="sm"
            disabled
            className="w-full"
          >
            Analyzing...
          </Button>
        </div>
      ) : insightError ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-destructive">{insightError}</p>

          <Button
            variant="outline"
            size="sm"
            onClick={generateInsight}
            className="w-full"
          >
            Try Again
          </Button>
        </div>
      ) : insight ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm">{insight.summary}</p>

          <p className="text-sm">
            <span className="font-medium">Top category:</span>{" "}
            {insight.topCategory}
          </p>

          <p className="text-sm text-muted-foreground">
            💡 {insight.tip}
          </p>

          <Button
            variant="outline"
            size="sm"
            onClick={generateInsight}
            className="mt-2 w-full"
          >
            Refresh Insight
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            Get an AI-powered look at your recent spending.
          </p>

          <Button
            variant="outline"
            size="sm"
            onClick={generateInsight}
            className="w-full"
          >
            Analyze My Spending
          </Button>
        </div>
      )}
    </div>
  );
}