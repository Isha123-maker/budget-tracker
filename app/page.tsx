import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col">
        
        {/* Navbar */}
        <nav className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-xl text-white">
              ₨
            </div>
            <span className="font-heading text-xl font-bold">
              PKR Tracker
            </span>
          </div>

          <Link href="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
        </nav>

        {/* Hero */}
        <section className="flex flex-1 items-center justify-center py-16">
          <div className="grid w-full items-center gap-16 md:grid-cols-2">

            {/* Left */}
            <div>
              <div className="mb-6 inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
                🇵🇰 Built for everyday Pakistani spending
              </div>

              <h1 className="font-heading text-5xl font-bold leading-tight tracking-tight md:text-6xl">
                Your money.
                <br />
                <span className="text-emerald-600">Your control.</span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-500">
                Track your spending, manage your kameti, and understand where
                your PKR is going — all in one simple place.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="rounded-xl bg-emerald-600 px-7 hover:bg-emerald-700"
                  >
                    Get Started →
                  </Button>
                </Link>

                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl"
                >
                  See how it works
                </Button>
              </div>

              <div className="mt-10 flex gap-8 text-sm text-slate-500">
                <div>
                  <p className="font-bold text-slate-900">100%</p>
                  <p>Personal</p>
                </div>

                <div>
                  <p className="font-bold text-slate-900">PKR</p>
                  <p>Focused</p>
                </div>

                <div>
                  <p className="font-bold text-slate-900">Simple</p>
                  <p>To use</p>
                </div>
              </div>
            </div>

            {/* Right - Fake dashboard preview */}
            <div className="relative">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/70">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      Total Balance
                    </p>
                    <h2 className="mt-1 text-3xl font-bold">
                      Rs. 84,500
                    </h2>
                  </div>

                  <div className="rounded-xl bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-700">
                    +12.5%
                  </div>
                </div>

                <div className="mt-8 h-32 rounded-2xl bg-linear-to-r from-emerald-50 to-teal-50 p-5">
                  <div className="flex h-full items-end gap-3">
                    {[35, 55, 45, 70, 50, 85, 65, 95].map(
                      (height, index) => (
                        <div
                          key={index}
                          className="flex-1 rounded-t-lg bg-emerald-500"
                          style={{ height: `${height}%` }}
                        />
                      )
                    )}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">Income</p>
                    <p className="mt-2 font-bold text-emerald-600">
                      + Rs. 120k
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">Expenses</p>
                    <p className="mt-2 font-bold text-red-500">
                      - Rs. 35.5k
                    </p>
                  </div>
                </div>

              </div>

              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 rounded-2xl border bg-white p-4 shadow-xl">
                <p className="text-xs text-slate-500">
                  Monthly Savings
                </p>
                <p className="mt-1 font-bold text-emerald-600">
                  Rs. 42,300
                </p>
              </div>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}