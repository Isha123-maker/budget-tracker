import { clerk, clerkSetup } from "@clerk/testing/playwright";
import { test as setup } from "@playwright/test";
import path from "path";

setup.describe.configure({ mode: "serial" });

setup("configure Clerk", async () => {
  await clerkSetup();
});

const authFile = path.join(__dirname, "../playwright/.clerk/user.json");

setup("sign in and save state", async ({ page }) => {
  await page.goto("/");
  await clerk.signIn({
    page,
    emailAddress: process.env.E2E_CLERK_USER_EMAIL!,
  });

  await page.goto("/dashboard");
  await page.getByRole("heading", { name: "PKR Budget Tracker" }).waitFor();

  await page.context().storageState({ path: authFile });
});