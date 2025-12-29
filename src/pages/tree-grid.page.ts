import { test, Page, Locator } from "@playwright/test";
import { testData } from "../data/testData";

export class TreeGridPage {
  readonly page: Page;

  readonly searchField: Locator;

  // Row Projects //
  readonly projectsExpandCollapseIcon: Locator;
  readonly projectsNameCell: Locator;
  readonly projectsSizeCell: Locator;
  readonly projectsKindCell: Locator;

  // Row Reports //
  readonly reportsExpandCollapseIcon: Locator;

  // Row Other //
  readonly otherExpandCollapseIcon: Locator;

  constructor(page: Page) {
    this.page = page;

    this.searchField = page.getByRole("textbox", { name: "Search" });

    // Row Projects //
    this.projectsExpandCollapseIcon = page.locator(
      "(//button[@aria-label='expand'])[1]"
    );
    this.projectsNameCell = page.locator(
      "//td[@role='gridcell' and contains(text(),'project-1.doc')]"
    );
    this.projectsSizeCell = page.locator("(//td[@role='gridcell'])[6]");
    this.projectsKindCell = page.locator("(//td[@role='gridcell'])[7]");

    // Row Reports //
    this.reportsExpandCollapseIcon = page.locator(
      "(//nb-tree-grid-row//button[@aria-label='Toggle Expand/Collapse'])[2]"
    );

    // Row Other //
    this.otherExpandCollapseIcon = page.locator(
      "(//nb-tree-grid-row//button[@aria-label='Toggle Expand/Collapse'])[3]"
    );
  }

  async getProjectName() {
    await this.projectsExpandCollapseIcon.click();
    const getProjectsName = (await this.projectsNameCell.textContent())?.trim();
    console.log("Projects Name: " + getProjectsName);
  }

  async getSizeProjects() {
    const getSizeProject = (await this.projectsSizeCell.textContent())?.trim();
    console.log("Projects Size: " + getSizeProject);
  }

  async getKindProjects() {
    const getKindProject = (await this.projectsKindCell.textContent())?.trim();
    console.log("Projects Kind: " + getKindProject);
  }
}
