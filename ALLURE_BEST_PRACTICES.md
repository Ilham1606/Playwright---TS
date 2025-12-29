# Allure Reporting Best Practices for Playwright

## Overview

Allure is an advanced test reporting framework that generates beautiful HTML reports with analytics, test history, and custom categorization. This guide covers how to use it effectively with your Playwright tests.

---

## Installation & Setup

### Already Included

```json
// In package.json
"@allure-js/commons": "^3.0.0",
"allure-commandline": "^2.32.0"
```

### npm Scripts (Already Added)

```bash
npm run allure:report    # Generate report
npm run allure:open      # Open in browser
```

---

## Using Allure in Tests

### Option 1: Standard Playwright Tests (No Allure Steps)

```typescript
import { test, expect } from "@playwright/test";

test("simple login test", async ({ page }) => {
  await page.goto("https://example.com/login");
  await page.fill("#username", "user@example.com");
  await page.fill("#password", "password123");
  await page.click("button[type='submit']");
  await expect(page).toHaveTitle(/Dashboard/);
});
```

**Result**: Test executes and reports as passed/failed with screenshots.

---

### Option 2: With Allure Steps (Recommended for CI)

```typescript
import { test, expect } from "@playwright/test";
import { step } from "@allure-js/commons";

test("login with allure steps", async ({ page }) => {
  // Step 1: Navigate to login
  await step("Navigate to login page", async () => {
    await page.goto("https://example.com/login");
  });

  // Step 2: Enter credentials
  await step("Enter credentials", async () => {
    await page.fill("#username", "user@example.com");
    await page.fill("#password", "password123");
  });

  // Step 3: Click submit
  await step("Click submit button", async () => {
    await page.click("button[type='submit']");
  });

  // Step 4: Verify login
  await step("Verify dashboard loaded", async () => {
    await expect(page).toHaveTitle(/Dashboard/);
  });
});
```

**Benefit**: Each step is visible in the Allure report, making it easy to see exactly where tests fail.

---

## Adding Attachments to Reports

### Screenshots

```typescript
import { test, expect } from "@playwright/test";
import { step, attachment } from "@allure-js/commons";

test("with screenshot attachment", async ({ page }) => {
  await page.goto("https://example.com");

  await step("Take and attach screenshot", async () => {
    const screenshot = await page.screenshot();
    await attachment("Page state", screenshot, "image/png");
  });
});
```

### HTML Snapshots

```typescript
import { attachment } from "@allure-js/commons";

test("with HTML snapshot", async ({ page }) => {
  const html = await page.content();
  const htmlBuffer = Buffer.from(html);

  await attachment("Page HTML", htmlBuffer, "text/html");
});
```

### Console Logs

```typescript
import { attachment } from "@allure-js/commons";

test("with console logs", async ({ page }) => {
  const logs: string[] = [];

  page.on("console", (msg) => {
    logs.push(`[${msg.type()}] ${msg.text()}`);
  });

  await page.goto("https://example.com");

  const logsBuffer = Buffer.from(logs.join("\n"));
  await attachment("Console logs", logsBuffer, "text/plain");
});
```

### Video Attachments

```typescript
import { test, expect } from "@playwright/test";
import { attachment } from "@allure-js/commons";
import * as fs from "fs";

test("with video attachment", async ({ page }) => {
  // Configure video in playwright.config.ts
  // video: "retain-on-failure"

  await page.goto("https://example.com");

  // Video path available after test
  // Attach if test failed
  if (fs.existsSync("video.webm")) {
    const video = fs.readFileSync("video.webm");
    await attachment("Test video", video, "video/webm");
  }
});
```

---

## Custom Test Fixtures with Allure

### Using allure-fixtures.ts

```typescript
// src/tests/allure-fixtures.ts
import { test as base } from "@playwright/test";
import { step, attachment } from "@allure-js/commons";

export const test = base.extend({
  allure: [
    async ({}, use) => {
      const allure = {
        step: async (name: string, fn: () => Promise<void>) => {
          await step(name, fn);
        },
        attach: async (name: string, data: Buffer, type: string) => {
          await attachment(name, data, type);
        },
      };

      await use(allure);
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";
```

### Using in Tests

```typescript
import { test, expect } from "../allure-fixtures";

test("with custom fixtures", async ({ page, allure }) => {
  await allure.step("Login step", async () => {
    await page.goto("https://example.com/login");
    // ...
  });

  const screenshot = await page.screenshot();
  await allure.attach("Final state", screenshot, "image/png");
});
```

---

## Test Categorization

### By Status

Allure automatically groups tests by:

- ✅ **Passed** - All assertions passed
- ❌ **Failed** - At least one assertion failed
- 🚫 **Broken** - Test execution error (not assertion)
- ⏭️ **Skipped** - Test skipped

### Custom Categories (in allure-config.json)

```json
{
  "categories": [
    {
      "name": "Database errors",
      "matchedStatuses": ["failed"],
      "messageRegex": ".*database.*"
    },
    {
      "name": "Timeout errors",
      "matchedStatuses": ["failed"],
      "messageRegex": ".*timeout.*"
    },
    {
      "name": "Network errors",
      "matchedStatuses": ["failed"],
      "messageRegex": ".*network|ECONNREFUSED.*"
    }
  ]
}
```

Failures matching these patterns will be grouped automatically.

---

## Test Metadata

### Mark Tests with Labels

```typescript
import { test } from "@playwright/test";
import { label } from "@allure-js/commons";

test("login feature", async ({ page }) => {
  await label("Feature", "Authentication");
  await label("Severity", "Critical");

  // Test code...
});
```

### Test IDs

```typescript
import { test } from "@playwright/test";
import { testID } from "@allure-js/commons";

test("validate form validation", async ({ page }) => {
  await testID("PROJ-123");

  // Test code...
});
```

---

## Report Generation

### Generate Report

```bash
# From test results
npx allure generate test-results --clean -o allure-report
```

**Explanation:**

- `test-results/` - Directory with Allure results
- `--clean` - Clear previous report
- `-o allure-report` - Output directory

### Open Report

```bash
# Automatically open in browser
npx allure open allure-report

# Or manually
open allure-report/index.html
```

### CI Integration

The workflow already handles this:

```yaml
- name: Generate Allure report
  if: always()
  run: npx allure generate test-results --clean -o allure-report
```

---

## Report Features

### Dashboard

- Test execution summary
- Pass/fail statistics
- Execution duration
- Trending over time (if run multiple times)

### Tests View

- Detailed test results
- Steps with duration
- Attached screenshots/logs
- Error messages

### Trends

- Historical test results
- Pass rate over time
- Test duration trends

### Categories

- Failure grouping
- Error pattern analysis

### Timeline

- Test execution order
- Duration visualization

---

## Best Practices

### 1. Use Meaningful Step Names

```typescript
// ❌ Bad
await step("do something", async () => {
  // code
});

// ✅ Good
await step("Navigate to login page and enter credentials", async () => {
  await page.goto("https://example.com/login");
  await page.fill("#username", "user@example.com");
});
```

### 2. Attach Useful Artifacts

```typescript
// ❌ Bad - Too many attachments
const screenshot = await page.screenshot();
await attachment("screenshot", screenshot, "image/png");
// ... repeated 10 times

// ✅ Good - Strategic attachments
await step("Verify payment processed", async () => {
  const screenshot = await page.screenshot();
  await attachment("Payment confirmation", screenshot, "image/png");
});
```

### 3. Group Related Steps

```typescript
// ❌ Flat structure
await step("Click login button", async () => { ... });
await step("Wait for dashboard", async () => { ... });
await step("Verify user name", async () => { ... });

// ✅ Grouped by functionality
await step("Login flow", async () => {
  await step("Click login button", async () => { ... });
  await step("Wait for dashboard", async () => { ... });
  await step("Verify user name", async () => { ... });
});
```

### 4. Include Error Context

```typescript
// ✅ Attach state on failure
test("checkout process", async ({ page }) => {
  await step("Complete checkout", async () => {
    try {
      await page.click("button[name='complete']");
      await expect(page).toHaveTitle(/Order Confirmation/);
    } catch (error) {
      const html = await page.content();
      await attachment("Error state HTML", Buffer.from(html), "text/html");
      throw error;
    }
  });
});
```

### 5. Track Execution Time

```typescript
// ✅ Steps automatically track duration
await step("Submit form (includes wait)", async () => {
  await page.click("button[type='submit']");
  await page.waitForNavigation(); // Included in step time
});
```

---

## Troubleshooting

### Report Not Generated

```bash
# Check results exist
ls -la test-results/

# Verify file format
cat test-results/results.json | head -20

# Manual generation
npx allure generate test-results --clean -o allure-report

# View errors
npx allure --version
```

### Missing Steps in Report

```typescript
// Ensure you're using step correctly
import { step } from "@allure-js/commons";

// ✅ Correct
await step("Name", async () => {
  // code
});

// ❌ Wrong - forgot await
step("Name", async () => {
  // code
});
```

### Attachments Not Showing

```typescript
import { attachment } from "@allure-js/commons";

// ✅ Correct - inside step or test
await step("Capture", async () => {
  const data = await page.screenshot();
  await attachment("Screenshot", data, "image/png");
});

// ⚠️ May not work - outside step
const data = await page.screenshot();
await attachment("Screenshot", data, "image/png");
```

---

## Combining with Playwright Report

Both reports are useful:

| Feature           | Playwright Report | Allure Report |
| ----------------- | ----------------- | ------------- |
| Visual timeline   | ✅                | ❌            |
| Screenshots       | ✅                | ✅            |
| Video recording   | ✅                | ❌            |
| Custom steps      | ❌                | ✅            |
| Trends/history    | ❌                | ✅            |
| Categorization    | Limited           | ✅            |
| Duration per step | ❌                | ✅            |

**Recommendation**: Use both - Playwright for visual debugging, Allure for analytics.

---

## CI/CD Integration

### GitHub Actions

Already configured in `.github/workflows/playwright.yml`:

```yaml
- name: Generate Allure report
  if: always()
  run: npx allure generate test-results --clean -o allure-report

- name: Upload Allure Report
  uses: actions/upload-artifact@v4
  with:
    name: allure-report-${{ matrix.browser }}
    path: allure-report/
    retention-days: 30
```

### GitLab CI

```yaml
allure:
  script:
    - npx allure generate test-results --clean -o allure-report
  artifacts:
    paths:
      - allure-report/
```

### Jenkins

```groovy
stage("Generate Allure Report") {
  steps {
    sh "npx allure generate test-results --clean -o allure-report"
  }
}
```

---

## Advanced: Custom Allure Configuration

### allure-config.json

```json
{
  "categories": [
    {
      "name": "UI Errors",
      "description": "Errors in UI rendering",
      "matchedStatuses": ["failed"],
      "messageRegex": ".*element.*visible.*"
    }
  ],
  "executor": {
    "name": "GitHub Actions",
    "type": "github",
    "reportUrl": "${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}"
  }
}
```

---

## Summary

**Key Commands:**

```bash
npm test                 # Run tests (generates results)
npm run allure:report   # Generate Allure report
npm run allure:open     # Open in browser
```

**In Tests:**

```typescript
import { step, attachment } from "@allure-js/commons";

await step("Step name", async () => {
  // Test code
});

const screenshot = await page.screenshot();
await attachment("Screenshot", screenshot, "image/png");
```

**CI/CD**: Workflow automatically generates and uploads reports!

---

## Resources

- **Allure Documentation**: https://docs.qameta.io/allure/
- **Allure JS Commons**: https://www.npmjs.com/package/@allure-js/commons
- **Example Reports**: https://demo.qameta.io/allure/
