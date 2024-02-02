import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

export function createRandomUser() {
  return {};
}

test("has title", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});
