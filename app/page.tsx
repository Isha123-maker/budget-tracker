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
        <h2 className="text-lg font-semibold">Balance Summary</h2>
        <p className="text-2xl font-bold">Total Balance: Rs. 0</p>
      </section>

      {/* TODO: a section for the transaction list — just a placeholder heading like "Recent Transactions" for now, no real data yet */}
      <section className="max-w-md mx-auto mt-8 px-4">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
        <p className="text-muted-foreground">No transactions to display.</p>
      </section>
    </main>
  );
}