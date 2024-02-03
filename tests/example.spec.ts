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

  const user1 = createRandomUser();
  const user2 = createRandomUser();

  await page.getByLabel("Email").fill(user1.email);
  await page.getByLabel("Password", { exact: true }).fill(user1.password);
  await page.getByLabel("Confirm Password").fill(user1.password);

  await page.getByRole("button", { name: "Register" }).click();

  await page.waitForURL("/board");
  await page.getByRole("heading", { name: "Board" }).isVisible();

  await page.getByRole("button", { name: "Logout" }).click();
  await page.waitForURL("/");

  await page.getByRole("link", { name: "Register" }).click();

  await page.waitForURL("/register");

  await page.getByLabel("Email").fill(user1.email);
  await page.getByLabel("Password", { exact: true }).fill(user2.password);
  await page.getByLabel("Confirm Password").fill(user2.password);

  await page.getByText("Email already in use").isVisible();

  await page.getByLabel("Email").clear();
  await page.getByLabel("Email").fill(user2.email);

  await page.getByRole("button", { name: "Register" }).click();
  await page.waitForURL("/board");
});
