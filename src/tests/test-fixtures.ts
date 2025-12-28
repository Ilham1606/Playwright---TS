import { test as base } from "@playwright/test";
import { FormLayoutPage } from "../pages/form-layout.page";
import { Dashboard } from "../pages/dasboard.page.";
import { DatePicker } from "../pages/date-picker.page";

type Fixtures = {
  formLayoutPage: FormLayoutPage;
  dashboard: Dashboard;
  datePickerPage: DatePicker;
};

export const test = base.extend<Fixtures>({
  formLayoutPage: async ({ page }, use) => {
    await use(new FormLayoutPage(page));
  },
  dashboard: async ({ page }, use) => {
    await use(new Dashboard(page));
  },
  datePickerPage: async ({ page }, use) => {
    await use(new DatePicker(page));
  },
});

export { expect } from "@playwright/test";
