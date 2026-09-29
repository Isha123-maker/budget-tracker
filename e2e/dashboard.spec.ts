import { test, expect, type Page } from "@playwright/test";

// Read "Rs. 40,300" from the screen and turn it into the number 40300
async function getBalance(page: Page): Promise<number> {
  const text = await page.getByTestId("balance").innerText();
  return Number(text.replace(/[^0-9-]/g, ""));
}

async function addTransaction(
  page: Page,
  opts: {
    amount: number;
    note: string;
    type?: "INCOME" | "EXPENSE";
    categoryLabel?: string;
  },
) {
  await page.getByRole("button", { name: "Add Transaction" }).click();
  const dialog = page.getByRole("dialog");

  await dialog.getByLabel("Amount (Rs.)").fill(String(opts.amount));

  if (opts.type === "INCOME") {
    await dialog.getByRole("combobox").nth(0).click();
    await page.getByRole("option", { name: "Income" }).click();
  }
  if (opts.categoryLabel) {
    await dialog.getByRole("combobox").nth(1).click();
    await page.getByRole("option", { name: opts.categoryLabel }).click();
  }

  await dialog.getByLabel("Note (optional)").fill(opts.note);
  await dialog.getByRole("button", { name: "Save Transaction" }).click();
  await expect(dialog).toBeHidden(); // wait for the dialog to actually close first

  const viewAll = page.getByRole("button", { name: /View all \d+ transactions/ });
  if (await viewAll.isVisible().catch(() => false)) {
    await viewAll.click();
  }

  await expect(page.getByText(opts.note)).toBeVisible();
}

// Clean up leftovers from earlier runs. SAFETY: only delete rows whose note starts with "E2E"
test.beforeEach(async ({ page }) => {
  const res = await page.request.get("/api/transactions");
  if (!res.ok()) return; // API hiccuped — skip cleanup this run rather than crashing every test

  const rows: { id: string; note: string | null }[] = await res.json();
  if (!Array.isArray(rows)) return;

  for (const t of rows) {
    if (t.note?.startsWith("E2E")) {
      await page.request.delete(`/api/transactions/${t.id}`);
    }
  }
});

test("balance goes down for expenses and up for income", async ({ page }) => {
  await page.goto("/dashboard");
  const tag = Date.now();

  await addTransaction(page, {
    amount: 5000,
    type: "INCOME",
    categoryLabel: "Other",
    note: `E2E income ${tag}`,
  });
  const afterIncome = await getBalance(page);

  await addTransaction(page, { amount: 1200, note: `E2E expense ${tag}` });
  expect(await getBalance(page)).toBe(afterIncome - 1200);

  await addTransaction(page, {
    amount: 3000,
    type: "INCOME",
    categoryLabel: "Other",
    note: `E2E income2 ${tag}`,
  });
  expect(await getBalance(page)).toBe(afterIncome - 1200 + 3000);
});

test("category filter shows only that category, and toggles off", async ({ page }) => {
  await page.goto("/dashboard");
  const tag = Date.now();

  await addTransaction(page, {
    amount: 800,
    categoryLabel: "Transport",
    note: `E2E transport ${tag}`,
  });
  await addTransaction(page, { amount: 2000, note: `E2E groceries ${tag}` }); // default = Groceries

  const pill = page.getByRole("button", { name: "Transport", exact: true });

  await pill.click();
  await expect(page.getByText(`E2E transport ${tag}`)).toBeVisible();
  await expect(page.getByText(`E2E groceries ${tag}`)).toHaveCount(0);

  await pill.click(); // click again = filter off
  await expect(page.getByText(`E2E groceries ${tag}`)).toBeVisible();
});

test("the API only returns MY transactions", async ({ page }) => {
  await page.goto("/dashboard");
  await addTransaction(page, { amount: 100, note: `E2E owner check ${Date.now()}` });

  const res = await page.request.get("/api/transactions");
  const rows: { userId: string }[] = await res.json();
  const owners = new Set(rows.map((r) => r.userId));

  expect(owners.size).toBe(1);
});