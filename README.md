# 🇵🇰 PKR Budget Tracker

> **Your money. Your control.**

A modern personal budgeting web application built specifically around Pakistani Rupee (PKR) spending.

PKR Budget Tracker helps users record income and expenses, understand their spending patterns, visualize financial activity, and receive AI-powered insights based on their recent expenses.

---

## ✨ Project Highlights

- 💰 **PKR-focused budgeting** — designed around Pakistani Rupees and local spending categories
- 📊 **Spending visualization** — understand spending trends through interactive charts
- 🏷️ **Category-based transactions** — organize expenses such as groceries, rent, utilities, transport, and committees
- 🤖 **AI spending insights** — receive personalized summaries and practical saving suggestions
- 🔐 **Secure authentication** — user accounts powered by Clerk
- 🗄️ **PostgreSQL database** — persistent data storage using Prisma ORM
- ✅ **Validated API input** — transaction data is validated using Zod
- 🧪 **End-to-end testing** — Playwright tests for important application flows
- 📱 **Responsive interface** — designed to work across desktop and smaller screens

---

## 📸 Screenshots

### Landing Page

![PKR Budget Tracker Landing Page](docs/screenshots/landing-page.png)

### Dashboard

![PKR Budget Tracker Dashboard](docs/screenshots/dashboard.png)

### AI Spending Insight

![AI Spending Insight](docs/screenshots/ai-insight.png)

> Screenshots are stored in `docs/screenshots/`.

---

## 🎯 Why I Built This

Most budgeting applications are designed around generic financial workflows and currencies.

I wanted to build something closer to the way people in Pakistan actually think about everyday spending.

The project uses:

- Pakistani Rupees (`Rs.`)
- Local spending categories
- Simple income and expense tracking
- Spending trend visualization
- AI-powered spending interpretation

At the same time, the project is designed as a practical full-stack application for learning how modern web applications are built from frontend to backend, database, authentication, APIs, AI integration, and testing.

---

# 🚀 Features

## 💰 Income & Expense Tracking

Users can record financial transactions with:

- Amount
- Transaction type
- Category
- Note
- Date

Transactions can represent either:

```text
INCOME
EXPENSE
The dashboard automatically calculates the current balance:

Balance = Total Income - Total Expenses
🏷️ Spending Categories

The application currently supports:

Category	Purpose
Utilities	Electricity, gas, internet, etc.
Committees	Kameti / committee contributions
Groceries	Food and household purchases
Transport	Fuel, public transport, travel
Rent	Housing expenses
Other	Miscellaneous spending
📊 Spending Trends

The dashboard provides a visual representation of weekly income and expenses.

This makes it easier to identify:

Changes in spending
Higher-spending weeks
Income vs expense patterns
General financial trends
🤖 AI-Powered Spending Insights

The application includes an AI-powered spending analysis feature.

When the user chooses to analyze their spending, the application:

Retrieves the user's recent transactions.
Filters the data to focus on expenses.
Calculates total spending.
Calculates spending by category.
Identifies the highest-spending category.
Sends the calculated facts to the AI.
Generates a short spending summary and practical saving tip.
Why calculate the numbers before sending them to AI?

Financial calculations should not depend on an LLM.

Instead of asking the AI to calculate totals itself, the application performs the calculations programmatically and gives the AI the results to interpret.

For example:

Total spending: Rs.19,300

Spending by category:
RENT: Rs.6,000
GROCERIES: Rs.4,500
TRANSPORT: Rs.2,800
UTILITIES: Rs.3,000
OTHER: Rs.3,000

The AI then focuses on explaining the spending pattern and providing useful advice.

This keeps the financial calculations deterministic while still using AI where it adds value.

🔐 Authentication

User authentication is handled through Clerk.

Each authenticated user is associated with an application-level user record in PostgreSQL.

Transactions are linked to their corresponding application user, so users only work with their own financial data.

🛡️ Validation & Data Safety

Transaction input is validated using Zod before database operations.

The validation layer checks:

Amount
Transaction type
Category
Note
Date

Transaction updates use a partial validation schema so users can update individual fields without bypassing validation.

The application also performs server-side ownership checks before updating transactions.

🏗️ Architecture

The project follows a modern full-stack architecture:

┌─────────────────────────────────────┐
│             Next.js UI              │
│                                     │
│  Landing Page                       │
│  Dashboard                          │
│  Transaction Components             │
│  Charts                             │
│  AI Insight Card                    │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│        Next.js API Routes            │
│                                     │
│  /api/transactions                   │
│  /api/insights                       │
└───────────────┬───────────┬─────────┘
                │           │
                ▼           ▼
       ┌─────────────┐  ┌─────────────┐
       │   Prisma    │  │  OpenRouter │
       │     ORM     │  │     AI      │
       └──────┬──────┘  └─────────────┘
              │
              ▼
       ┌─────────────┐
       │ PostgreSQL  │
       └─────────────┘

Authentication is handled through Clerk and transaction input is validated with Zod.

🛠️ Tech Stack
Frontend
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
Recharts
Lucide React
Backend
Next.js App Router
Next.js API Routes
Prisma ORM
PostgreSQL
Zod
Authentication
Clerk
AI
Vercel AI SDK
OpenRouter
Structured AI output using Zod schemas
Testing
Playwright
Clerk testing tools
📂 Project Structure
budget-tracker/
│
├── app/
│   ├── api/
│   │   ├── insights/
│   │   │   └── route.ts
│   │   └── transactions/
│   │       ├── route.ts
│   │       └── [id]/
│   │           └── route.ts
│   │
│   ├── dashboard/
│   │   └── page.tsx
│   │
│   └── page.tsx
│
├── components/
│   ├── budget/
│   │   ├── AIInsightCard.tsx
│   │   ├── AddTransactionDialog.tsx
│   │   ├── BalanceCard.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── SpendingTrendChart.tsx
│   │   └── TransactionList.tsx
│   │
│   └── ui/
│
├── lib/
│   ├── aggregateWeekly.ts
│   ├── categories.ts
│   ├── get-or-create-user.ts
│   ├── prisma.ts
│   └── validation/
│       └── transaction.ts
│
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
│
├── e2e/
│
├── public/
│
├── package.json
└── README.md

⚙️ Getting Started
Prerequisites

Make sure you have installed:

Node.js
npm
PostgreSQL
A Clerk application
An OpenRouter API key
1. Clone the repository
git clone https://github.com/Isha123-maker/budget-tracker.git
cd budget-tracker
2. Install dependencies
npm install
3. Configure environment variables

Create a .env.local file in the root directory.

DATABASE_URL="your_postgresql_connection_string"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"

OPENROUTER_API_KEY="your_openrouter_api_key"
Important

Never commit .env.local or expose your API keys.

4. Set up Prisma

Generate the Prisma client:

npx prisma generate

Run the database migrations:

npx prisma migrate dev
5. Start the development server
npm run dev

Open the application at:

http://localhost:3000
🧪 Testing

The project uses Playwright for end-to-end testing.

Run the test suite:

npx playwright test

Run tests using the Playwright UI:

npx playwright test --ui

The Playwright configuration starts the Next.js development server automatically when required.

🗄️ Database Models

The PostgreSQL database currently contains the following core models:

User
 │
 ├── Transactions
 │
 └── Committee Memberships
          │
          ▼
      Committee
          │
          └── Committee Transactions
Main models
User
Transaction
Committee
CommitteeMember

Transactions support:

Income
Expenses
Categories
Notes
Dates
Optional committee association

Transaction amounts are stored using Prisma's Decimal type.

The application currently accepts whole PKR amounts for user-entered transactions.

💡 Engineering Decisions
Server-side ownership checks

Transaction operations verify that the requested transaction belongs to the authenticated user before allowing modifications.

This prevents users from modifying transactions belonging to another account.

Shared validation schemas

Transaction validation is centralized in:

lib/validation/transaction.ts

The same validation rules can therefore be reused across transaction creation and update operations.

Deterministic financial calculations

Financial totals are calculated by application code instead of relying on the AI model.

The AI is used for interpretation rather than arithmetic.

Local date handling

The application uses local calendar dates for user-facing transaction dates to avoid unexpected date shifts caused by UTC conversion.

Whole PKR input

User-entered transaction amounts currently use whole Pakistani Rupees.

For example:

Rs. 1500

rather than fractional values such as:

Rs. 1500.75

This keeps the budgeting experience simple while the database retains decimal precision.

📈 Current Project Status
Completed
 Landing page
 User authentication
 Transaction creation
 Transaction validation
 Transaction ownership checks
 Income and expense tracking
 Category filtering
 Balance calculation
 Weekly spending visualization
 AI spending insights
 PKR-specific formatting
 Local date handling
 Playwright testing setup
 Seed data workflow
In Progress / Future
 More advanced budgeting goals
 Monthly and yearly reports
 Recurring transactions
 Improved AI recommendations
 Financial report export
 Notifications and reminders
 More advanced committee/kameti workflows
 Progressive Web App support
🗺️ Roadmap
Phase 1 — Core Budgeting
Transaction management
Balance calculation
Categories
Authentication
Database
Phase 2 — Insights
Spending charts
Category analysis
AI-generated spending insights
Phase 3 — Localized Features
Pakistani spending categories
Committee/kameti workflows
Local financial habits
More localized budgeting tools
Phase 4 — Advanced Features
Budget goals
Recurring transactions
Reports
Notifications
Advanced analytics
🎓 What I Learned

This project was built as a practical full-stack learning project.

The main areas explored include:

Next.js App Router
React component architecture
TypeScript
REST-style API routes
PostgreSQL database design
Prisma ORM
Authentication
Zod validation
AI/LLM integration
Structured AI output
Data visualization
End-to-end testing
Environment configuration
Production build workflows

The goal was not simply to build a CRUD application, but to understand how the different layers of a modern web application connect together.

🔮 Future Vision

PKR Budget Tracker can evolve beyond simple transaction tracking into a more complete personal financial management platform designed around Pakistani users.

Potential future capabilities include:

Personalized monthly budgets
AI-powered spending forecasts
Smart recurring-expense detection
Financial goals
Committee/kameti management
Monthly financial reports
Spending alerts
Exportable reports
More detailed financial analytics
👨‍💻 Author

Noor

Built as a full-stack learning and portfolio project focused on modern web development, AI integration, and localized financial tooling for Pakistani users.

⭐ If you find the project useful

Feel free to explore the code, experiment with the architecture, and build on top of it.