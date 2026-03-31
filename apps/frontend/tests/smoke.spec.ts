import { expect, test } from "@playwright/test";

test.describe("Storefront smoke", () => {
  test("catalog -> product -> cart -> checkout pages render", async ({ page }) => {
    await page.goto("/catalog");
    await expect(page).toHaveURL(/\/catalog/);

    await page.locator(".product-card a button").first().click();
    await expect(page).toHaveURL(/\/catalog\//);
    await expect(page.locator("button").first()).toBeVisible();

    await page.locator("button").first().click();
    await expect(page).toHaveURL(/\/cart/);
    await expect(page.locator(".cart-layout, .ui-empty-state")).toBeVisible();

    await page.goto("/checkout");
    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.locator('form input[name="customerName"]')).toBeVisible();
  });

  test("login and account pages render", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator('form input[name="email"]')).toBeVisible();

    await page.fill('input[name="email"]', "owner@azdek.local");
    await page.fill('input[name="password"]', "Owner123!");
    await page.locator("form button").first().click();

    await expect.poll(async () => await page.evaluate(() => localStorage.getItem("azdek_access_token")), {
      timeout: 30000,
    }).not.toBeNull();

    await page.goto("/account");
    await expect(page.locator("main")).toBeVisible();
  });
});
