import { test as base } from "@playwright/test";
import { FormLayoutPage } from "../pages/form-layout.page";
import { Dashboard } from "../pages/dasboard.page.";
import { DatePicker } from "../pages/date-picker.page";
import { TreeGridPage } from "../pages/tree-grid.page";

type Fixtures = {
  formLayoutPage: FormLayoutPage;
  dashboard: Dashboard;
  datePickerPage: DatePicker;
  treeGridPage: TreeGridPage;
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
  treeGridPage: async ({ page }, use) => {
    await use(new TreeGridPage(page));
  },
});

export { expect } from "@playwright/test";
