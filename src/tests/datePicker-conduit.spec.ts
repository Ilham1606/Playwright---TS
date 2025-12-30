import { test } from "../tests/test-fixtures";
import { testData } from "../data/testData";

const URL = "https://playground.bondaracademy.com/pages/iot-dashboard";
// const skipInCI = !!process.env.CI;

const { dateCommon, dateRangeStart, dateRangeEnd, dateMinMax } = testData();

test.beforeEach(async ({ page, dashboard, formLayoutPage, datePickerPage }) => {
  await page.goto(URL);
  await dashboard.selectDarkTheme();
  await formLayoutPage.navigateToFormsMenu();
  await datePickerPage.gotoDatePickerMenu();
});

test("Assert all title text DatePickers", async ({ datePickerPage }) => {
  // if (skipInCI) {
  //   test.skip();
  // }
  await datePickerPage.assertTitleCommonDatePicker();
  await datePickerPage.assertTitleWithRangeDatePicker();
  await datePickerPage.assertTitleDisableMinMaxDatePicker();
});

test("Select date in Common DatePicker", async ({ datePickerPage }) => {
  // if (skipInCI) {
  //   test.skip();
  // }
  await datePickerPage.selectDateCommon(dateCommon);
});

test("Select date range in DatePicker With Range", async ({
  datePickerPage,
}) => {
  await datePickerPage.selectDateRange(dateRangeStart, dateRangeEnd);
});

test("Select date in DatePicker With Disabled Min Max Values", async ({
  datePickerPage,
}) => {
  await datePickerPage.selectDateMinMax(dateMinMax);
});
