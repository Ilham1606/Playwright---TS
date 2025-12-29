import { test as base, expect } from "@playwright/test";

type AllureFixtures = {
  allure: {
    attachment: (
      buffer: Buffer,
      name: string,
      contentType?: string
    ) => Promise<void>;
    step: (name: string, fn: () => Promise<void>) => Promise<void>;
  };
};

/**
 * Custom Playwright test with Allure support
 * Usage in tests:
 *
 * test("description", async ({ page, allure }) => {
 *   await allure.step("Step name", async () => {
 *     // test code
 *   });
 * });
 */
export const test = base.extend<AllureFixtures>({
  allure: [
    async ({}, use) => {
      const allureInstance = {
        attachment: async (
          buffer: Buffer,
          name: string,
          contentType: string = "text/plain"
        ) => {
          // Allure attachment support
          // Note: allure-playwright automatically captures screenshots & videos
          console.log(`Attachment: ${name}`);
        },
        step: async (stepName: string, fn: () => Promise<void>) => {
          // Steps are not needed with allure-playwright
          // It automatically tracks test execution
          await fn();
        },
      };

      await use(allureInstance);
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";
