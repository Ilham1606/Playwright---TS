import { test } from "../test-fixtures";
import { testData } from "../../data/testData";

const URL = "https://playground.bondaracademy.com/pages/tables/tree-grid";
// const skipInCI = !!process.env.CI;

test.describe("Test Tree Grid Menu", () => {
  test.beforeEach(async ({ page, dashboard }) => {
    await page.goto(URL);
    await dashboard.selectDarkTheme();
  });

  test("Expand Projects row and get project name, size & kind", async ({
    treeGridPage,
  }) => {
    await treeGridPage.getProjectName();
    await treeGridPage.getSizeProjects();
    await treeGridPage.getKindProjects();
  });

  test("Expand Reports row and get report name, size & kind", async ({
    treeGridPage,
  }) => {
    await treeGridPage.getReportsName();
    await treeGridPage.getSizeReports();
    await treeGridPage.getKindReports();
  });
});
