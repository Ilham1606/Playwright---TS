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
    headless: false,
    ignoreHTTPSErrors: true,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
  },

  projects: [
    // ===== SETUP AUTH =====
    {
      name: "setup:user",
      testMatch: /.*\.setup\.ts/,
    },

    // ===== TEST YANG BUTUH AUTHENTICATION =====
    {
      name: "ui:auth:chrome",
      testMatch: /ui\/.*\.auth\.spec\.ts/,
      dependencies: ["setup:user"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "storage/auth.json",
      },
    },

    {
      name: "ui:auth:firefox",
      testMatch: /.*\.auth\.spec\.ts/,
      dependencies: ["setup:user"],
      use: {
        ...devices["Desktop Firefox"],
        storageState: "storage/auth.json",
      },
    },

    // ===== TEST PUBLIC (NO LOGIN) =====
    {
      name: "ui:public",
      testMatch: /.*\.spec\.ts/,
      testIgnore: /.*\.setup\.ts/,
      use: {
        ...devices["Desktop Chrome"],
      },
    },

    // ===== API =====
    // {
    //   name: "api",
    // },
  ],
});
