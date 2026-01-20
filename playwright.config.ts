import { defineConfig, devices } from "@playwright/test";

if (!process.env.CI) {
  require("dotenv").config({ quiet: true });
}

export default defineConfig({
  testDir: "./src/tests",

  timeout: 60 * 1000,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : 4,

  reporter: [
    ["html"],

    ["junit", { outputFile: "test-results/junit.xml" }],

    [
      "allure-playwright",
      {
        outputFolder: process.env.ALLURE_RESULTS_DIR || "allure-results",
      },
    ],
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
  ],
});
