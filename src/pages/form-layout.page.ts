import { Page, Locator } from "@playwright/test";

export class FormLayoutPage {
  readonly page: Page;

  readonly formsMenu: Locator;
  readonly formLayoutsMenu: Locator;

  // inline form //
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly inLineCheckboxLocator: Locator;
  readonly btnSubmitInline: Locator;

  readonly usingGridEmailLocator: Locator;
  readonly usingGridPassLocator: Locator;
  readonly btnRadios: Locator;
  readonly btnSignIn: Locator;

  // basic form //
  readonly emailBasicLocator: Locator;
  readonly passBasicLocator: Locator;
  readonly checkBoxBasicLocator: Locator;
  readonly btnSubmitBasicLocator: Locator;

  //   // form without labels //
  readonly recipientsLocator: Locator;
  readonly subjectLocator: Locator;
  readonly messageLocator: Locator;
  readonly btnSend: Locator;

  //   // block form //
  readonly firstNameLocator: Locator;
  readonly lastNameLocator: Locator;
  readonly emailBlockFormLocator: Locator;
  readonly websiteLocator: Locator;
  readonly btnSubmitBlockLocator: Locator;

  constructor(page: Page) {
    this.page = page;

    // Locator: Side menu Forms - Form Layouts //
    this.formsMenu = page.getByRole("link", { name: "Forms" });
    this.formLayoutsMenu = page.getByRole("link", { name: "Form Layouts" });

    // Locator: Inline form //
    this.nameInput = page.getByRole("textbox", { name: "Jane Doe" });
    this.emailInput = page.locator("(//input[@placeholder='Email'])[1]");
    this.inLineCheckboxLocator = page.locator(
      "(//span[@class='custom-checkbox'])[1]"
    );
    this.btnSubmitInline = page.locator(
      "(//button[@status='primary' and @type='submit'])[1]"
    );

    // Locator: Using grid form //
    this.usingGridEmailLocator = page.locator("//input[@id='inputEmail1']");
    this.usingGridPassLocator = page.locator("//input[@id='inputPassword2']");
    this.btnRadios = page.locator("//span[contains(text(), 'Option 1')]");
    this.btnSignIn = page.locator(
      "(//button[@status='primary' and @type='submit'])[2]"
    );

    // Locator: basic form //
    this.emailBasicLocator = page.locator("//input[@id='exampleInputEmail1']");
    this.passBasicLocator = page.locator(
      "//input[@id='exampleInputPassword1']"
    );
    this.checkBoxBasicLocator = page.locator("//span[text()='Check me out']");
    this.btnSubmitBasicLocator = page.locator(
      "(//button[@status='danger' and @type='submit'])"
    );

    // Locator: Form without label //
    this.recipientsLocator = page.getByRole("textbox", { name: "Recipients" });
    this.subjectLocator = page.getByRole("textbox", { name: "Subject" });
    this.messageLocator = page.getByRole("textbox", { name: "Message" });
    this.btnSend = page.getByRole("button", { name: "SEND" });

    // Locator: Block form //
    this.firstNameLocator = page.getByRole("textbox", { name: "First Name" });
    this.lastNameLocator = page.getByRole("textbox", { name: "Last Name" });
    this.emailBlockFormLocator = page.locator(
      "(//input[@placeholder='Email'])[4]"
    );
    this.websiteLocator = page.getByRole("textbox", { name: "Website" });
    this.btnSubmitBlockLocator = page.locator("(//button[@type='submit'])[5]");
  }

  async navigateToFormsMenu() {
    await this.formsMenu.click();
  }
  async navigateToFormLayouts() {
    await this.formLayoutsMenu.click();
  }

  async fillInlineForm(name: string, email: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.inLineCheckboxLocator.click();
    await this.btnSubmitInline.click();
  }

  async fillFormWithoutLabel() {
    await this.btnSend.scrollIntoViewIfNeeded();
  }

  async fillGridForm(emailGrid: string, passGrid: string) {
    await this.usingGridEmailLocator.fill(emailGrid);
    await this.usingGridPassLocator.fill(passGrid);
    await this.btnRadios.scrollIntoViewIfNeeded();
    await this.btnRadios.click();
    await this.btnSignIn.click();
  }

  async fillWithoutLabelForm(recipients: string, subj: string, msg: string) {
    await this.recipientsLocator.fill(recipients);
    await this.subjectLocator.fill(subj);
    await this.messageLocator.fill(msg);
    await this.btnSend.click();
  }

  // Basic Form //
  async fillEmailBasicForm(emailBasic: string, passBasic: string) {
    await this.emailBasicLocator.fill(emailBasic);
    await this.passBasicLocator.fill(passBasic);
    await this.checkBoxBasicLocator.click();
    await this.btnSubmitBasicLocator.click();
  }

  async fillBlockForm(
    firstName: string,
    lastName: string,
    blockEmail: string,
    website: string
  ) {
    await this.firstNameLocator.fill(firstName);
    await this.lastNameLocator.fill(lastName);
    await this.emailBlockFormLocator.fill(blockEmail);
    await this.websiteLocator.fill(website);
    await this.btnSubmitBlockLocator.click();
  }
}
