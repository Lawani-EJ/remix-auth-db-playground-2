import { test } from "@playwright/test";
import { faker } from "@faker-js/faker";

export function createRandomUser() {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}

test("Register validation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("heading", { name: "Landing page" });
  await page.getByRole("link", { name: "Register" }).click();

  await page.waitForURL("/register");

  const user = createRandomUser();

  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password", { exact: true }).fill(user.password);
  await page.getByLabel("Confirm Password").fill(user.password);

  await page.getByRole("button", { name: "Register" }).click();

  await page.waitForURL("/board");
  await page.getByRole("heading", { name: "Board" }).isVisible();
});
