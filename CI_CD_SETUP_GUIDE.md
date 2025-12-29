# GitHub Actions + Playwright + Allure Setup Guide

## Overview

This guide sets up a complete CI/CD pipeline using:

- **GitHub Actions** - CI/CD platform
- **Playwright TypeScript** - Test automation
- **Node.js LTS** - Runtime environment
- **Allure** - Advanced reporting (no account required)
- **Ubuntu runner** - Linux environment

---

## Quick Start

### 1. Update Dependencies

The `package.json` has been updated with all required packages:

```bash
npm install
```

**Key packages:**

- `@playwright/test` - Playwright test framework
- `@allure-js/commons` - Allure Java Commons library
- `allure-commandline` - Allure CLI for report generation
- `typescript` - TypeScript compiler

### 2. Install Playwright Browsers Locally

```bash
npx playwright install --with-deps
```

### 3. Run Tests Locally

```bash
# Run all tests
npm test

# Run specific browser
npm run test:chromium

# Run in headed mode (see browser)
npm run test:headed

# Debug mode
npm run test:debug
```

### 4. Generate & View Reports

```bash
# Generate Allure report
npm run allure:report

# Open Allure report
npm run allure:open

# Show Playwright HTML report
npm run report
```

---

## File Structure

```
.github/
├── workflows/
│   └── playwright.yml          ← GitHub Actions workflow
src/
├── tests/
│   ├── allure-fixtures.ts      ← Allure integration
│   ├── test-fixtures.ts        ← Playwright fixtures
│   └── *.spec.ts               ← Test files
├── pages/                       ← Page Object Model
└── data/                        ← Test data

playwright.config.ts             ← Playwright configuration
allure-config.json              ← Allure configuration
.gitignore                       ← Git ignore rules
package.json                     ← Dependencies & scripts
tsconfig.json                    ← TypeScript configuration
```

---

## GitHub Actions Workflow Details

### Workflow File: `.github/workflows/playwright.yml`

**Key Features:**

- ✅ Runs on push & pull request to `main` and `develop` branches
- ✅ Matrix strategy: tests run in parallel across 3 browsers (chromium, firefox, webkit)
- ✅ Node.js LTS (v20) with npm caching
- ✅ Automatic Playwright browser installation
- ✅ Headless mode enabled by default
- ✅ Generates both Playwright and Allure reports
- ✅ Uploads artifacts with 30-day retention
- ✅ Publishes test results to GitHub
- ✅ Fails pipeline if any test fails

### Workflow Events

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
```

To add more triggers:

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  schedule:
    - cron: "0 2 * * *" # Run daily at 2 AM UTC
  workflow_dispatch: # Manual trigger
```

### Test Matrix

```yaml
strategy:
  fail-fast: false
  matrix:
    node-version: [20.x]
    browser: [chromium, firefox, webkit]
```

This creates 3 parallel jobs (one per browser). Tests run independently and don't fail the entire job if one browser fails.

---

## Playwright Configuration for CI

### Key CI Optimizations in `playwright.config.ts`

```typescript
const isCI = !!process.env.CI;

export default defineConfig({
  workers: isCI ? 1 : 4, // Single worker in CI (resource-limited)
  retries: isCI ? 2 : 1, // More retries in CI for flaky tests
  fullyParallel: false, // Sequential execution
  timeout: 30 * 1000, // 30s per test

  use: {
    headless: true, // Always headless in CI
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
  },
});
```

**Why these settings?**

- **Single worker**: GitHub Actions VMs have limited resources; multiple workers can cause timeouts
- **Retries**: Network/timing issues are more common in CI; retries reduce flakiness
- **No parallel**: Prevents resource contention
- **Artifacts on failure**: Helps debug failures without storing large files for passed tests

---

## Allure Reporting Setup

### What is Allure?

Allure is an advanced test reporting framework that provides:

- Beautiful HTML reports with statistics
- Test history and trends
- Custom categories for failure analysis
- Environment/executor information
- Test attachments (screenshots, logs)

### Using Allure in Tests

Option 1: Simple setup (no custom fixtures)

```typescript
import { test, expect } from "@playwright/test";

test("my test", async ({ page }) => {
  // Test code
});
```

Option 2: With Allure steps and attachments (recommended)

```typescript
import { test, expect } from "../allure-fixtures";

test("my test", async ({ page, allure }) => {
  await allure.step("Navigate to page", async () => {
    await page.goto("https://example.com");
  });

  await expect(page.locator("h1")).toBeVisible();

  // Add screenshot as attachment
  const screenshot = await page.screenshot();
  await allure.attachment("Page screenshot", screenshot, "image/png");
});
```

### Generating Allure Report

```bash
# Generate report from test results
npx allure generate --clean -o allure-report

# Open in browser
npx allure open allure-report
```

**Report output:** `allure-report/index.html`

### Allure Configuration: `allure-config.json`

This file defines:

- **Categories**: How to group failures (database errors, timeouts, etc.)
- **Executor**: CI system info (GitHub Actions)
- **Report URL**: Link back to GitHub Actions run

---

## Uploading & Accessing Reports

### Automatic Artifact Upload

The workflow uploads 3 artifact types:

1. **Playwright Reports** (`playwright-report-{browser}/`)
2. **Allure Reports** (`allure-report-{browser}/`)
3. **Test Results** (`test-results-{browser}/`)

### Accessing Reports in GitHub

1. Go to your GitHub repository
2. Click **Actions** tab
3. Select a workflow run
4. Scroll to **Artifacts** section
5. Download `playwright-report-*` or `allure-report-*`
6. Extract and open `index.html` in browser

### Local Access After Download

```bash
# Extract and open Playwright report
unzip playwright-report-chromium.zip
open playwright-report/index.html

# Extract and open Allure report
unzip allure-report-chromium.zip
open allure-report/index.html
```

---

## Best Practices for CI

### 1. **Test Isolation**

Ensure tests don't depend on execution order:

```typescript
test.beforeEach(async ({ page }) => {
  // Fresh state for each test
  await page.goto("https://example.com");
});
```

### 2. **Timeouts & Waits**

Set appropriate timeouts in `playwright.config.ts`:

```typescript
export default defineConfig({
  timeout: 30 * 1000, // Per test
  expect: { timeout: 5000 }, // Per assertion
  navigationTimeout: 30000, // Navigation
});
```

### 3. **Environment Variables**

Use `.env` for secrets (GitHub Actions will skip this file):

```bash
# .env (local only)
BASE_URL=http://localhost:3000
USERNAME=testuser
PASSWORD=testpass
```

In tests:

```typescript
const baseUrl = process.env.BASE_URL || "http://localhost:3000";
await page.goto(baseUrl);
```

### 4. **Handling Flaky Tests**

- Use `retries: 2` in CI (already configured)
- Increase timeouts for slow operations
- Use explicit waits instead of arbitrary delays:

```typescript
// ❌ Bad
await page.waitForTimeout(2000);

// ✅ Good
await page.locator("data=success-message").waitFor();
```

### 5. **Screenshots & Traces**

Configured for failure analysis only:

```typescript
use: {
  screenshot: "only-on-failure",  // Only captures on failure
  trace: "on-first-retry",        // Trace first failure
  video: "retain-on-failure",     // Keep video if failed
}
```

This saves storage while preserving debugging info.

### 6. **Parallel Execution**

- **Local**: Use `workers: 4` for speed
- **CI**: Use `workers: 1` to avoid timeouts

GitHub Actions VMs have limited resources; multiple workers can cause memory/timeout issues.

### 7. **Test Data Management**

Store in `src/data/`:

```typescript
// src/data/testData.ts
export const users = {
  admin: { username: "admin", password: "admin123" },
  user: { username: "user", password: "user123" },
};

// In test
import { users } from "../data/testData";

test("login", async ({ page }) => {
  await loginPage.login(users.admin.username, users.admin.password);
});
```

### 8. **CI-Specific Behavior**

```typescript
const isCI = !!process.env.CI;

if (isCI) {
  // Longer timeouts in CI
  test.setTimeout(60000);
} else {
  // Shorter in local for faster feedback
  test.setTimeout(30000);
}
```

### 9. **Monitoring & Notifications**

Add to `.github/workflows/playwright.yml` for Slack notifications:

```yaml
- name: Notify on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "Tests failed in ${{ github.repository }} (${{ github.ref }})"
      }
```

### 10. **Report Retention**

Current: 30 days

```yaml
retention-days: 30 # In upload-artifact step
```

Adjust based on storage needs.

---

## Troubleshooting

### Tests Pass Locally but Fail in CI

**Common Causes:**

1. **Missing browsers**: Run `npx playwright install --with-deps`
2. **Environment variables**: Add to GitHub repository secrets
3. **Network timeouts**: Increase timeout in `playwright.config.ts`
4. **Resource issues**: CI runner has limited memory; use single worker

**Solution:**

```typescript
// Increase timeouts for CI
export default defineConfig({
  timeout: 60 * 1000, // 60s in CI
  expect: { timeout: 10000 },
});
```

### Allure Report Not Generating

```bash
# Verify results exist
ls -la test-results/

# Manually generate
npx allure generate test-results --clean -o allure-report

# Check for errors
npx allure --version
```

### "Playwright browsers not installed"

```bash
# In workflow, this runs automatically:
npx playwright install --with-deps

# Locally, run manually:
npx playwright install --with-deps
```

### GitHub Actions Timeout

Default timeout: 60 minutes per job

```yaml
timeout-minutes: 60 # In test job
```

If exceeding, reduce test count or increase workers carefully.

---

## Adding More Tests

1. Create test file in `src/tests/`:

```typescript
// src/tests/myFeature.spec.ts
import { test, expect } from "@playwright/test";

test("my feature works", async ({ page }) => {
  await page.goto("https://example.com");
  await expect(page).toHaveTitle(/Example/);
});
```

2. Run locally:

```bash
npm test
```

3. Push to GitHub:

```bash
git add .
git commit -m "Add new tests"
git push origin main
```

4. Workflow runs automatically!

---

## Next Steps

1. ✅ Push `.github/workflows/playwright.yml` to GitHub
2. ✅ Update `package.json` with dependencies
3. ✅ Install dependencies: `npm install`
4. ✅ Run tests locally: `npm test`
5. ✅ Push to GitHub and watch Actions tab
6. ✅ Download reports after run completes

---

## Quick Reference Commands

```bash
# Local testing
npm test                      # Run all tests
npm run test:chromium        # Run chromium only
npm run test:headed          # See browser window
npm run test:debug           # Debug mode

# Reporting
npm run allure:report        # Generate Allure report
npm run allure:open          # Open in browser
npm run report               # Show Playwright report

# Installation
npm install                  # Install dependencies
npx playwright install       # Install browsers
npx playwright install --with-deps  # Chromium dependencies
```

---

## Support

For issues:

- **Playwright**: https://playwright.dev
- **Allure**: https://docs.qameta.io/allure/
- **GitHub Actions**: https://docs.github.com/en/actions
