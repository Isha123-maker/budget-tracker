import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPKR } from "@/lib/categories";

export function BalanceCard({ totalBalance }: { totalBalance: number }) {
  return (
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
  );
}