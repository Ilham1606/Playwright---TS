# GitHub Actions + Playwright + Allure - Quick Reference

## 🚀 Installation & First Run

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install --with-deps

# 3. Run tests locally
npm test

# 4. View reports
npm run allure:report
npm run report
```

## 📝 Test Templates

### Basic Test

```typescript
import { test, expect } from "@playwright/test";

test("my test", async ({ page }) => {
  await page.goto("https://example.com");
  await expect(page).toHaveTitle(/Example/);
});
```

### With Allure Steps

```typescript
import { test, expect } from "@playwright/test";
import { step } from "@allure-js/commons";

test("my test", async ({ page }) => {
  await step("Navigate", async () => {
    await page.goto("https://example.com");
  });

  await step("Verify title", async () => {
    await expect(page).toHaveTitle(/Example/);
  });
});
```

### With Attachments

```typescript
import { test, expect } from "@playwright/test";
import { step, attachment } from "@allure-js/commons";

test("my test", async ({ page }) => {
  await page.goto("https://example.com");

  const screenshot = await page.screenshot();
  await attachment("Screenshot", screenshot, "image/png");
});
```

## 🔧 Configuration

### playwright.config.ts - Key Settings

```typescript
const isCI = !!process.env.CI;

export default defineConfig({
  workers: isCI ? 1 : 4, // Single worker in CI
  retries: isCI ? 2 : 1, // More retries in CI
  timeout: 30 * 1000, // 30s per test

  use: {
    headless: true, // No GUI
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
  },
});
```

### package.json - Scripts

```json
{
  "scripts": {
    "test": "playwright test",
    "test:chromium": "playwright test --project=chromium",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "allure:report": "allure generate --clean -o allure-report",
    "allure:open": "allure open allure-report",
    "report": "playwright show-report"
  }
}
```

## 🌐 GitHub Actions Workflow

### File: `.github/workflows/playwright.yml`

**Triggers:**

- Push to main/develop
- Pull requests to main/develop

**Jobs:**

- Runs on ubuntu-latest (GitHub-hosted runner)
- Matrix: chromium, firefox, webkit (parallel)
- Node.js: 20.x LTS
- Caches npm dependencies

**Steps:**

1. Checkout code
2. Setup Node.js
3. Install npm packages
4. Install Playwright browsers
5. Run tests
6. Generate Allure report
7. Upload artifacts
8. Publish results

## 📊 Reports & Artifacts

### Playwright HTML Report

- Visual test timeline
- Screenshots on failure
- Videos on failure
- Trace recordings
- **Location**: `playwright-report/index.html`
- **Access**: Download from GitHub Actions artifacts

### Allure HTML Report

- Test statistics
- Custom steps breakdown
- Failure categories
- Attachments (screenshots, logs)
- Test history
- **Location**: `allure-report/index.html`
- **Access**: Download from GitHub Actions artifacts

### Test Results

- **JSON**: `test-results/results.json`
- **JUnit XML**: `test-results/junit.xml`
- **Usage**: CI/CD integration, metrics

## 🔐 Secrets & Environment Variables

### GitHub Secrets

```yaml
# Set in GitHub Settings > Secrets
# Use in workflow: ${{ secrets.MY_SECRET }}

env:
  API_KEY: ${{ secrets.API_KEY }}
  PASSWORD: ${{ secrets.PASSWORD }}
```

### Local .env File

```bash
# Create .env (NOT committed, in .gitignore)
BASE_URL=https://example.com
USERNAME=testuser
PASSWORD=testpass

# Access in tests
const url = process.env.BASE_URL;
const user = process.env.USERNAME;
```

## 🛠️ Common Commands

```bash
# Testing
npm test                      # All tests
npm run test:chromium        # Chromium only
npm run test:headed          # See browser
npm run test:debug           # Debug mode

# Reports
npm run allure:report        # Generate Allure
npm run allure:open          # Open Allure
npm run report               # Open Playwright

# Installation
npm install                  # Install deps
npx playwright install       # Install browsers
npm update                   # Update packages
```

## 🔍 Debugging

### Local Test Failure

```bash
# 1. Run in headed mode
npm run test:headed

# 2. Debug with inspector
npm run test:debug

# 3. View Playwright report
npm run report

# 4. Check logs
npm test -- --reporter=verbose
```

### CI Test Failure

1. Go to GitHub Actions > workflow run
2. View logs for error details
3. Download Playwright report
4. Download Allure report
5. Check test-results JSON/XML

### Common Issues

| Issue                    | Solution                                           |
| ------------------------ | -------------------------------------------------- |
| Tests timeout in CI      | Increase `timeout` in config, use `workers: 1`     |
| "Browsers not installed" | Run `npx playwright install --with-deps`           |
| Flaky tests              | Add retries: `retries: 2` in config                |
| Reports not uploaded     | Check workflow succeeded, verify artifacts section |
| Env vars not found       | Add to GitHub Secrets or .env file                 |

## 📈 Best Practices

### ✅ DO

- Use Page Object Model (POM)
- Wait for elements, not time: `page.waitForSelector()`
- Isolate tests (no dependencies)
- Use meaningful step names
- Attach screenshots on failure
- Use environment variables
- Single worker in CI

### ❌ DON'T

- Hardcoded waits: `await page.waitForTimeout(5000)`
- Concurrent workers in CI
- Test dependencies
- Committing .env files
- Committing reports to git
- Ignoring timeouts
- Skipping headless mode in CI

## 🚦 Workflow Status

### Check Status

1. Go to GitHub repository
2. Click **Actions** tab
3. See latest workflow run
4. Green ✅ = Pass, Red ❌ = Fail

### View Artifacts

1. Click workflow run
2. Scroll to **Artifacts**
3. Download report zip
4. Extract and open `index.html`

### PR Integration

Tests run automatically on:

- Every push to main/develop
- Every pull request to main/develop
- Fails pipeline if tests fail

## 📚 Files Reference

| File                               | Purpose                        |
| ---------------------------------- | ------------------------------ |
| `.github/workflows/playwright.yml` | GitHub Actions workflow        |
| `playwright.config.ts`             | Playwright configuration       |
| `package.json`                     | Dependencies & scripts         |
| `allure-config.json`               | Allure configuration           |
| `.env.example`                     | Environment variables template |
| `src/tests/*.spec.ts`              | Test files                     |
| `src/pages/*.page.ts`              | Page Object Model              |
| `src/data/`                        | Test data                      |
| `CI_CD_SETUP_GUIDE.md`             | Complete guide                 |
| `GITHUB_ACTIONS_CHECKLIST.md`      | Setup checklist                |
| `ALLURE_BEST_PRACTICES.md`         | Allure guide                   |

## 🔗 Quick Links

- **Playwright Docs**: https://playwright.dev
- **GitHub Actions**: https://docs.github.com/en/actions
- **Allure Docs**: https://docs.qameta.io/allure/
- **Node.js LTS**: https://nodejs.org/

## 💡 Tips

1. **Speed up local tests**: Use `npm run test:chromium` (single browser)
2. **Debug failures**: Check Playwright report first (visual)
3. **Analyze patterns**: Use Allure report for trends
4. **CI optimization**: Single worker, 2 retries is standard
5. **Artifacts**: Download and examine locally if confused
6. **Secrets**: Never commit passwords; use GitHub Secrets
7. **Branches**: Configure workflow for your default branches
8. **Reports**: Check both Playwright and Allure for insights

---

**Ready to use!** 🎉

Push to GitHub → Watch workflow run → Download reports!
