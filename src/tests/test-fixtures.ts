import { test as base, expect } from "@playwright/test";
import { FormLayoutPage } from "../pages/form-layout.page";
import { Dashboard } from "../pages/dashboard.page";
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
    const formLayoutPage = new FormLayoutPage(page);
    await use(formLayoutPage);
  },

  dashboard: async ({ page }, use) => {
    const dashboard = new Dashboard(page);
    await use(dashboard);
  },

  datePickerPage: async ({ page }, use) => {
    const datePickerPage = new DatePicker(page);
    await use(datePickerPage);
  },

  treeGridPage: async ({ page }, use) => {
    const treeGridPage = new TreeGridPage(page);
    await use(treeGridPage);
  },
});

export { expect };
