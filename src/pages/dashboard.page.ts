import { Page, Locator } from "@playwright/test";

export class Dashboard {
  readonly page: Page;

  readonly themeDropdown: Locator;
  readonly darkThemeOption: Locator;

  constructor(page: Page) {
    this.page = page;

    this.themeDropdown = page.locator("(//button[@class='select-button'])[1]");
    this.darkThemeOption = page.locator("//nb-option[text()=' Dark']");
  }

  async selectDarkTheme() {
    await this.themeDropdown.click();
    await this.darkThemeOption.click();
  }
}
