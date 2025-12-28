import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

// Load .env file
dotenv.config();

export default defineConfig({
  testDir: "./src/tests",
  timeout: 30 * 1000, // 30 detik per test
  retries: 1, // retry kalau flaky
  reporter: [
    ["line"], // simple log di terminal
    ["html", { open: "never", outputFolder: "report" }], // html report
    ["json", { outputFile: "report/test-results.json" }], // bisa dipakai CI/CD
  ],

  use: {
    headless: false, // default: jalanin di headless = true
    // baseURL: process.env.BASE_URL_MICROFINANCE || "https://microapps-test.fifgroup.co.id/",
    // storageState: "./src/tests/storageState.json",
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
