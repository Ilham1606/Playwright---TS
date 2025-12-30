import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

export default defineConfig({
  testDir: "./src/tests",
  // Directory tempat test berada

  timeout: 60 * 1000,
  // Timeout per test (60 detik) – aman buat external URL / slow env

  retries: process.env.CI ? 2 : 0,
  // Retry hanya di CI untuk reduce flaky test

  workers: process.env.CI ? 1 : 4,
  // CI pakai 1 worker (stabil, resource kecil)
  // Local pakai 4 worker (lebih cepat)

  reporter: [
    ["html"],
    // Playwright built-in HTML report

    ["junit", { outputFile: "test-results/junit.xml" }],
    // JUnit report → dipakai GitHub Actions & Jenkins

    ["allure-playwright"],
    // Generate allure-results untuk Allure HTML report
  ],

  use: {
    headless: true,
    // CI always headless

    ignoreHTTPSErrors: true,
    // Bypass SSL issue (common di staging / UAT)

    screenshot: "only-on-failure",
    // Screenshot cuma kalau test gagal

    trace: "on-first-retry",
    // Trace aktif pas retry pertama (debug flaky)

    video: "retain-on-failure",
    // Simpan video hanya untuk test gagal
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      // Chromium desktop config
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      // Firefox desktop config
    },
  ],
});
