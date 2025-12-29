import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

// Load .env file
dotenv.config();

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./src/tests",
  timeout: 60 * 1000, // Increased timeout for external URLs (60s)
  retries: isCI ? 3 : 1, // More retries in CI (increased from 2 to 3)
  fullyParallel: false, // Run tests sequentially in CI
  workers: isCI ? 1 : 4, // Single worker in CI to avoid resource constraints
  reporter: [
    ["line"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
    ["json", { outputFile: "test-results/results.json" }],
    ["junit", { outputFile: "test-results/junit.xml" }],
  ],

  use: {
    headless: true,
    ignoreHTTPSErrors: true,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
