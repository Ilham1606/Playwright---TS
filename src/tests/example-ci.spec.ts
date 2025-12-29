/**
 * Example test with Allure integration
 * This demonstrates best practices for CI/CD
 */

import { test, expect } from "@playwright/test";

// Example: If you use custom fixtures
// import { test, expect } from "./allure-fixtures";

test.describe("Example Test Suite", () => {
  test.beforeEach(async ({ page }) => {
    // Change to your test application URL
    await page.goto("https://example.com");
  });

  test("should load page successfully", async ({ page }) => {
    await expect(page).toHaveTitle(/Example/);
  });

  test("should display content", async ({ page }) => {
    const mainContent = page.locator("main, [role='main']");
    await expect(mainContent).toBeVisible();

    // Take screenshot on success
    await page.screenshot({ path: "test-results/success.png" });
  });

  test("example with retry logic", async ({ page }) => {
    // This test will retry twice if it fails (configured in playwright.config.ts)
    const element = page.locator("h1");
    // Playwright automatically retries with configured retries
    await expect(element).toBeVisible();
  });
});

test.describe("CI/CD Best Practices", () => {
  test("avoid hardcoded waits", async ({ page }) => {
    // ❌ BAD: This should NOT be used
    // await page.waitForTimeout(5000);

    // ✅ GOOD: Use explicit waits
    await page.waitForLoadState("networkidle");
    const element = page.locator("data=success");
    await expect(element).toBeVisible({ timeout: 10000 });
  });

  test("use environment variables", async ({ page }) => {
    // Load from .env or GitHub Secrets
    const baseUrl = process.env.BASE_URL || "https://example.com";
    const timeout = process.env.TEST_TIMEOUT || "30000";

    await page.goto(baseUrl);
    await expect(page).toHaveTitle(/Example/);
  });

  test("handle network errors gracefully", async ({ page }) => {
    // HTTPS errors are ignored by default in playwright.config.ts
    // use: { ignoreHTTPSErrors: true }

    await page.goto("https://example.com");
    await expect(page.locator("body")).toBeVisible();
  });
});

// Multiple browsers
test.describe.configure({ mode: "parallel" });

test("should work across browsers", async ({ page, browserName }) => {
  await page.goto("https://example.com");

  if (browserName === "chromium") {
    // Browser-specific logic
    await expect(page.locator("h1")).toBeVisible();
  }
});
