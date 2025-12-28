import { Page, Locator, expect } from "@playwright/test";
import { testData } from "../data/testData";

const { dateRangeStart, dateRangeEnd, dateMinMax } = testData();

export class DatePicker {
  readonly page: Page;

  readonly datePickerMenu: Locator;

  // Date Picker Common //
  readonly dpCommonTitle: Locator;
  readonly fieldDatePickerCommon: Locator;
  readonly selectedDate: Locator;

  // Date Picker With Range //
  readonly dpWithRangeTitle: Locator;
  readonly inputDateRange: Locator;
  readonly dpStartDate: Locator;
  readonly dpEndDate: Locator;

  // Date Picker With Disabled Min Max Values //
  readonly dpDisableMinMaxValueLocator: Locator;
  readonly fieldDatePickerDisableMinMax: Locator;
  readonly selectDateDisableMinMax: Locator;

  constructor(page: Page) {
    this.page = page;

    this.datePickerMenu = page.getByRole("link", { name: "Datepicker" });

    // Locator: Date Picker Common //
    this.dpCommonTitle = page.locator(
      "//nb-card-header[text()='Common Datepicker']"
    );
    this.fieldDatePickerCommon = page.getByRole("textbox", {
      name: "Form Picker",
    });
    this.selectedDate = page.locator(
      "//nb-calendar-day-cell[contains(@class, 'selected day-cell')]"
    );

    // Locator: Date Picker With Range //
    this.dpWithRangeTitle = page.locator(
      "//nb-card-header[text()='Datepicker With Range']"
    );
    this.inputDateRange = page.getByPlaceholder("Range Picker");
    this.dpStartDate = page.locator(
      `//nb-calendar-range-day-cell[contains(@class, 'range-cell day-cell ng')]//div[text()='${dateRangeStart}']`
    );
    this.dpEndDate = page.locator(
      `//nb-calendar-range-day-cell[contains(@class, 'range-cell day-cell ng')]//div[text()='${dateRangeEnd}']`
    );

    // Locator: Date Picker With Disabled Min Max Values //
    this.dpDisableMinMaxValueLocator = page.locator(
      "//nb-card-header[text()='Datepicker With Disabled Min Max Values']"
    );
    this.fieldDatePickerDisableMinMax = page.getByRole("textbox", {
      name: "Min Max Picker",
    });
    this.selectDateDisableMinMax = page.locator(
      `//nb-calendar-day-cell[contains(@class, 'day-cell ng-star-inserted')]//div[contains(text(),'${dateMinMax}')]`
    );
  }

  async gotoDatePickerMenu() {
    this.datePickerMenu.click();
  }

  async assertTitleCommonDatePicker(): Promise<void> {
    const titleText = await this.dpCommonTitle.innerText();
    console.log("Datepicker Type: " + titleText);
    await expect(titleText).toBe("Common Datepicker");
  }

  async assertTitleWithRangeDatePicker(): Promise<void> {
    const titleText = await this.dpWithRangeTitle.innerText();
    console.log("Datepicker Type: " + titleText);
    await expect(titleText).toBe("Datepicker With Range");
  }

  async assertTitleDisableMinMaxDatePicker(): Promise<void> {
    const titleText = await this.dpDisableMinMaxValueLocator.innerText();
    console.log("Datepicker Type: " + titleText);
    await expect(titleText).toBe("Datepicker With Disabled Min Max Values");
  }

  async selectDateCommon(date: string): Promise<void> {
    await this.fieldDatePickerCommon.fill(date);

    const selectedDateText = await this.selectedDate.innerText();
    console.log("Selected Date: " + selectedDateText);
    await this.selectedDate.click();
  }

  async selectDateRange(startDate: string, endDate: string): Promise<void> {
    await this.inputDateRange.click();
    await this.dpStartDate.click();
    console.log("Start Date: " + startDate);
    await this.dpEndDate.click();
    console.log("End Date: " + endDate);
  }

  async selectDateMinMax(date: string): Promise<void> {
    await this.fieldDatePickerDisableMinMax.click();
    await this.selectDateDisableMinMax.click();
    console.log("Selected Date: " + date);
  }
}
