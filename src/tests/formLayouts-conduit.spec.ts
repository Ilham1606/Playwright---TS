import { test } from "../tests/test-fixtures";
import { testData } from "../data/testData";

const URL = "https://playground.bondaracademy.com/pages/iot-dashboard";

const {
  uname,
  email,
  emailke2,
  password,
  emailBasic,
  passBasic,
  recipients,
  subject,
  message,
  firstName,
  lastName,
  emailBlockForm,
  website,
} = testData();

// POM STYLE //
test.beforeEach(async ({ page, dashboard, formLayoutPage }) => {
  await page.goto(URL);
  await dashboard.selectDarkTheme();
  await formLayoutPage.navigateToFormsMenu();
  await formLayoutPage.navigateToFormLayouts();
});

test("Fill in Inline Form", async ({ formLayoutPage }) => {
  await formLayoutPage.fillInlineForm(uname, email);
});

test("Fill in Using Grid Form", async ({ formLayoutPage }) => {
  await formLayoutPage.fillGridForm(emailke2, password);
});

test("Fill in Basic Form", async ({ formLayoutPage }) => {
  await formLayoutPage.fillEmailBasicForm(emailBasic, passBasic);
});

test("Fill in Without Label Form", async ({ formLayoutPage }) => {
  await formLayoutPage.fillWithoutLabelForm(recipients, subject, message);
});

test("Fill in Block Form", async ({ formLayoutPage }) => {
  await formLayoutPage.fillBlockForm(
    firstName,
    lastName,
    emailBlockForm,
    website
  );
});

test("extract text", async ({ page }) => {
  const datePickerMenu = page.getByRole("link", { name: "Datepicker" });
  const datePicker = await datePickerMenu.click();

  const locatorTitle = page.locator(
    "//nb-card-header[text()='Common Datepicker']"
  );

  const titleText = await locatorTitle.textContent();

  console.log(titleText);
});

// test.beforeEach("Visit Conduit UI Playground", async ({ page }) => {
//   await page.goto(URL);
//   await page.locator("(//button[@class='select-button'])[1]").click();
//   await page.locator("//nb-option[text()=' Dark']").click();
//   await page.getByRole("link", { name: "Forms" }).click();
//   await page.getByRole("link", { name: "Form Layouts" }).click();
// });

// test("Fill in all Form Layouts", async ({ page }) => {
//   await page.getByRole("textbox", { name: "Jane Doe" }).fill(uname);
//   await page.locator("(//input[@placeholder='Email'])[1]").fill(email);

//   const inLineCheckboxLocator = "(//span[@class='custom-checkbox'])[1]";
//   await page.locator(inLineCheckboxLocator).check({ force: true });
// });

// test("Fill in all Form Layouts 2", async ({ page }) => {
//   await page.getByRole("button", { name: "SEND" }).scrollIntoViewIfNeeded();

//   const usingGridEmailLocator = "//input[@id='inputEmail1']";
//   await page.locator(usingGridEmailLocator).fill(emailke2);

//   const usingGridPassLocator = "//input[@id='inputPassword2']";
//   await page.locator(usingGridPassLocator).fill(password);
// });
