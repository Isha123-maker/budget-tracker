import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main>
      {/* TODO: a header — app title, maybe a subtitle */}
      <header className="max-w-md mx-auto pt-8 px-4">
        <h1 className="text-xl font-bold">Budget Tracker</h1>
        <p className="text-sm ">Track your expenses and manage your budget</p>
      </header>

      {/* TODO: a "balance summary" card — placeholder text like "Total Balance: Rs. 0" for now */}
      <section className="max-w-md mx-auto mt-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Balance Summary</CardTitle>
            <CardDescription>Total Balance: Rs. 0</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Total Balance: Rs. 0</p>
          </CardContent>
        </Card>
      </section>

      {/* TODO: a section for the transaction list — just a placeholder heading like "Recent Transactions" for now, no real data yet */}
      <section className="max-w-md mx-auto mt-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No transactions to display.</p>
          </CardContent>
        </Card>
      </section>
      <Button variant="outline" className="fixed bottom-20 right-4 left-4">
        Add Transaction
      </Button>
    </main>
  );
}