import { ENV } from "../config/env";
import { test as setup, expect } from "@playwright/test";

setup("Auth Login Conduit", async ({ page }) => {
  await page.goto(`${ENV.BASE_URL_BONDARCONDUIT}`);
  await page.getByRole("link", { name: "Sign in" }).click();
  await page
    .getByRole("textbox", { name: "Email" })
    .fill(`${ENV.TEST_EMAIL_CONDUIT}`);
  await page
    .getByRole("textbox", { name: "Password" })
    .fill(`${ENV.TEST_PASSWORD_CONDUIT}`);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForResponse("https://conduit-api.bondaracademy.com/api/tags");

  // save session
  await page.context().storageState({
    path: "storage/auth.json",
  });
});
