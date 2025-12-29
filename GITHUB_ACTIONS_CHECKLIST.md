# GitHub Actions Setup - Quick Checklist

## Prerequisites

- [ ] GitHub repository created and code pushed
- [ ] Node.js 20.x LTS (handled by workflow)
- [ ] npm (comes with Node.js)

## Step-by-Step Setup

### 1. Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push code
git add .
git commit -m "Initial commit with Playwright + Allure setup"
git push -u origin main
```

### 2. Verify Files Are In Place

The following files should exist in your repository:

```
✅ .github/workflows/playwright.yml
✅ package.json (with dependencies updated)
✅ playwright.config.ts (with CI optimizations)
✅ allure-config.json
✅ .gitignore (updated)
✅ CI_CD_SETUP_GUIDE.md
✅ src/tests/ (with test files)
```

### 3. GitHub Actions Auto-Setup

GitHub automatically detects `.github/workflows/playwright.yml` and:

- ✅ Creates the workflow
- ✅ Runs on push and pull requests
- ✅ No additional configuration needed!

### 4. Monitor First Run

1. Push code to GitHub
2. Go to **Actions** tab in your repository
3. Wait for workflow to start (~10-20 seconds)
4. Watch the job run (takes 10-15 minutes)

### 5. View Test Results

After workflow completes:

1. **Artifacts**

   - Click workflow run
   - Scroll to **Artifacts** section
   - Download `playwright-report-*` or `allure-report-*`
   - Extract and open `index.html`

2. **Test Summary**

   - Visible in workflow run summary
   - Shows pass/fail counts per browser

3. **GitHub Annotations**
   - Test failures shown in **Summary** tab
   - Click to see error details

## Common Setup Issues & Solutions

### Issue: No "Actions" Tab Visible

**Solution**: Enable GitHub Actions in repository settings

- Go to **Settings** > **Actions** > **General**
- Ensure "Allow all actions and reusable workflows" is selected

### Issue: Workflow Not Starting

**Solution**: Check workflow file syntax

```bash
# Validate locally (requires act CLI)
act -l

# Or check GitHub Actions logs
# Go to Actions tab > Workflow name > Latest run
```

### Issue: "Playwright browsers not installed"

**Solution**: Workflow includes this command:

```yaml
- run: npx playwright install --with-deps
```

This runs automatically and installs Chromium, Firefox, WebKit with dependencies.

### Issue: Tests Timeout in CI

**Solution**: Already configured in `playwright.config.ts`:

```typescript
workers: isCI ? 1 : 4,  // Single worker in CI
timeout: 30 * 1000,     // 30 seconds per test
```

Increase if needed:

```typescript
timeout: 60 * 1000,     // 60 seconds
```

### Issue: "No test results generated"

**Solution**: Ensure:

1. Tests are in `src/tests/` directory
2. Files end with `.spec.ts` or `.test.ts`
3. At least one test exists and runs

### Issue: Allure Report Not Generating

**Solution**: The workflow handles this:

```yaml
- name: Generate Allure report
  if: always() # Runs even if tests fail
  run: |
    npx allure generate test-results --clean -o allure-report
```

## Security: Adding Secrets (Optional)

If your tests need credentials (usernames, API keys, etc.):

### 1. Add Secret in GitHub

1. Go to repository **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret**
3. Name: `DB_PASSWORD`, Value: `your_password`

### 2. Use in Workflow

Update `.github/workflows/playwright.yml`:

```yaml
- name: Run tests
  env:
    DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
    DB_USER: ${{ secrets.DB_USER }}
  run: npx playwright test
```

### 3. Access in Tests

```typescript
const password = process.env.DB_PASSWORD;
const user = process.env.DB_USER;

await page.fill("#password", password);
```

## Customizations

### Run Tests on Schedule (Daily)

Edit `.github/workflows/playwright.yml`:

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  schedule:
    - cron: "0 2 * * *" # 2 AM UTC daily
```

### Add Slack Notifications

Install Slack GitHub App, then add to workflow:

```yaml
- name: Notify Slack on Failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "❌ Tests failed: ${{ github.run_id }}"
      }
```

### Limit Browsers for Testing

Edit `.github/workflows/playwright.yml`:

```yaml
matrix:
  browser: [chromium] # Only run chromium tests
```

### Add Manual Trigger

Edit `.github/workflows/playwright.yml`:

```yaml
on:
  push:
  pull_request:
  workflow_dispatch: # Add this
```

Then trigger manually:

- Go to **Actions** > **Playwright Tests with Allure Reporting**
- Click **Run workflow**

## File Explanations

### `.github/workflows/playwright.yml`

- Defines the CI/CD pipeline
- Runs on every push and PR
- Installs dependencies, runs tests, generates reports
- Uploads artifacts automatically

### `package.json`

- Lists all dependencies
- Defines npm scripts (test, allure:report, etc.)
- `npm install` fetches all packages

### `playwright.config.ts`

- Configures Playwright behavior
- CI optimizations (single worker, retries)
- Reporter settings (HTML, JSON, JUnit)
- Browser configurations

### `allure-config.json`

- Allure report metadata
- Test categories
- Executor information

### `CI_CD_SETUP_GUIDE.md`

- Comprehensive setup documentation
- Best practices
- Troubleshooting

## First Test Run Checklist

- [ ] Code pushed to GitHub
- [ ] Workflow file in `.github/workflows/playwright.yml`
- [ ] `package.json` updated with dependencies
- [ ] At least one `.spec.ts` test file exists
- [ ] Viewed Actions tab
- [ ] Workflow ran successfully
- [ ] Downloaded and viewed Allure report
- [ ] Downloaded and viewed Playwright report

## Monitoring Ongoing Runs

**Quick checks:**

1. **Actions tab** - See all workflow runs
2. **Recent runs** - See pass/fail status
3. **Artifacts** - Download reports
4. **Annotations** - See test failures inline

**Reports:**

- Playwright HTML: Visual test results
- Allure HTML: Advanced analytics
- JUnit XML: CI integration with other tools

## Next: Integrate with PR Workflow

Once working, optionally add:

- Required status checks (fail PR if tests fail)
- Auto-comment PR with test results
- Badge showing test status

Set in **Settings** > **Branches** > **Branch protection rules**:

- Require workflow status to pass before merging

---

**Need Help?**

- Playwright Docs: https://playwright.dev/docs/github-actions
- GitHub Actions Docs: https://docs.github.com/en/actions
- Allure Docs: https://docs.qameta.io/allure/
