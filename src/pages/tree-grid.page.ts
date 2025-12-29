import { test, Page, Locator } from "@playwright/test";
import { testData } from "../data/testData";

export class TreeGridPage {
  readonly page: Page;

  readonly searchField: Locator;

  // Row Projects //
  readonly projectsExpandIcon: Locator;
  readonly projectsNameCell: Locator;
  readonly projectsSizeCell: Locator;
  readonly projectsKindCell: Locator;

  // Row Reports //
  readonly reportsExpandIcon: Locator;
  readonly reportsNameCell: Locator;
  readonly reportsSizeCell: Locator;
  readonly reportsKindCell: Locator;

  // Row Other //
  readonly otherExpandIcon: Locator;

  constructor(page: Page) {
    this.page = page;

    this.searchField = page.getByRole("textbox", { name: "Search" });

    // Row Projects //
    this.projectsExpandIcon = page.locator(
      "(//button[@aria-label='expand'])[1]"
    );
    this.projectsNameCell = page.locator(
      "//td[@role='gridcell' and contains(text(),'project-1.doc')]"
    );
    this.projectsSizeCell = page.locator("(//td[@role='gridcell'])[6]");
    this.projectsKindCell = page.locator("(//td[@role='gridcell'])[7]");

    // Row Reports //
    this.reportsExpandIcon = page.locator(
      "(//button[@aria-label='expand'])[2]"
    );
    this.reportsNameCell = page.locator("//tbody//tr[3]//td[1]");
    this.reportsSizeCell = page.locator("//tbody//tr[3]//td[2]");
    this.reportsKindCell = page.locator("//tbody//tr[3]//td[3]");

    // Row Other //
    this.otherExpandIcon = page.locator("(//button[@aria-label='expand'])[3]");
  }

  async getProjectName() {
    await this.projectsExpandIcon.click();
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

  async getReportsName() {
    await this.reportsExpandIcon.click();
    const getReportsName = (await this.reportsNameCell.textContent())?.trim();
    console.log("Reports Name: " + getReportsName);
  }

  async getSizeReports() {
    const getSizeReport = (await this.reportsSizeCell.textContent())?.trim();
    console.log("Reports Size: " + getSizeReport);
  }

  async getKindReports() {
    const getKindReport = (await this.reportsKindCell.textContent())?.trim();
    console.log("Reports Kind: " + getKindReport);
  }
}
