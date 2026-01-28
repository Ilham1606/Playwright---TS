import { ENV } from "../../config/env";
import { test, expect } from "@playwright/test";

test.beforeEach("Login Conduit", async ({ page }) => {
  await page.goto(`${ENV.BASE_URL_BONDARCONDUIT}`);
});

test("Click Tags: Playwright", async ({ page }) => {
  await page.locator("//a[contains(text(),'playwright')]").click();

  const articleTitle = page.locator("h1").first();
  await expect(articleTitle).toBeVisible();
  const resultGetArticleTitle = await articleTitle.innerText();
  console.log("Article Title: " + resultGetArticleTitle);
});

test("Create new article - success", async ({ page }) => {
  await page.getByRole("link", { name: " New Article " }).click();

  await page
    .getByRole("textbox", { name: "Article Title" })
    .fill("Test Create New Article");

  await page
    .getByRole("textbox", { name: "What's this article about?" })
    .fill("This is All About Testing");

  await page
    .getByRole("textbox", { name: "Write your article (in markdown)" })
    .fill("Lorem ipsum dolor sit amet");

  await page.getByRole("button", { name: "Publish Article" }).click();
});
