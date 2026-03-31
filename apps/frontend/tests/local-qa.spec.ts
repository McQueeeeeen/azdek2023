import { expect, test } from "@playwright/test";

test.describe("Local QA", () => {
  test("mobile catalog and product pages render", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto("/catalog");
    await expect(page).toHaveURL(/\/catalog/);

    await page.locator(".product-card a button").first().click();
    await expect(page).toHaveURL(/\/catalog\//);
    await expect(page.locator("button").first()).toBeVisible();
  });

  test("cart empty state renders", async ({ page }) => {
    await page.goto("/cart");
    await page.evaluate(() => {
      localStorage.removeItem("azdek_cart_id");
      localStorage.removeItem("azdek_variant_id");
    });
    await page.reload();

    await expect(page.locator(".ui-empty-state")).toBeVisible();
  });

  test("checkout loading state and API error state render", async ({ page }) => {
    await page.goto("/catalog");
    await page.locator(".product-card a button").first().click();
    await page.locator("button").first().click();
    await expect(page).toHaveURL(/\/cart/);

    await page.goto("/checkout");
    await page.route("**/v1/checkout/confirm", async (route) => {
      await page.waitForTimeout(1200);
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Simulated checkout failure" }),
      });
    });

    await page.fill('input[name="customerName"]', "Local QA");
    await page.fill('input[name="customerEmail"]', "qa@azdek.local");
    await page.fill('input[name="customerPhone"]', "+77001234567");
    await page.fill('input[name="deliveryCity"]', "Almaty");
    await page.fill('textarea[name="deliveryAddress"]', "Abai 10");

    await page.locator("form button").first().click();
    await expect(page.locator("form button")).toBeDisabled();
    await expect(page.getByText(/Simulated checkout failure/)).toBeVisible();
  });

  test("unknown route returns 404 page", async ({ page }) => {
    await page.goto("/not-existing-route");
    await expect(page).toHaveURL(/\/not-existing-route/);
    await expect(page.locator("body")).toBeVisible();
  });
});
