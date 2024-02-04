import { test } from "@playwright/test";

test.use({ storageState: "playwright/.auth/user.json" });

test("Test requiring user to be logged in", async ({ page }) => {
  await page.goto("/board");
  await page.getByRole("heading", { name: "Board" }).isVisible();
});
