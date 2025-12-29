import { test } from "../tests/test-fixtures";
import { testData } from "../data/testData";

const URL = "https://playground.bondaracademy.com/pages/tables/tree-grid";
const skipInCI = !!process.env.CI;

test.beforeEach(async ({ page, dashboard }) => {
  if (skipInCI) {
    test.skip();
  }
  await page.goto(URL);
  await dashboard.selectDarkTheme();
});

test("Expand Projects row and get project name, size & kind", async ({
  treeGridPage,
}) => {
  if (skipInCI) {
    test.skip();
  }
  await treeGridPage.getProjectName();
  await treeGridPage.getSizeProjects();
  await treeGridPage.getKindProjects();
});

test("Expand Reports row and get report name, size & kind", async ({
  treeGridPage,
}) => {
  if (skipInCI) {
    test.skip();
  }
  await treeGridPage.getReportsName();
  await treeGridPage.getSizeReports();
  await treeGridPage.getKindReports();
});
