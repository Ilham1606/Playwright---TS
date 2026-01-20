import { ENV } from "../../config/env";
import { test, expect } from "@playwright/test";
import { quotesSchema, userSchema } from "../../data/testDataApiDum";

// const baseURL = "https://dummyjson.com";

test.describe("API Schema Validation Tests", () => {
  test("GET Single user - Schema Validation", async ({ request }) => {
    const response = await request.get(`${ENV.BASE_URL_DUMMYJSON}/users/66`);
    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    const validationResult = userSchema.safeParse(responseBody);
    expect(validationResult.success).toBe(true);

    if (!validationResult.success) {
      console.error("Schema validation errors:", validationResult.error);
    } else {
      console.log("[[INFO]] => Response body matches the schema");
    }
  });

  test("GET single Quote - Schema Validation", async ({ request }) => {
    const resp = await request.get(`${ENV.BASE_URL_DUMMYJSON}/quotes`);
    expect(resp.status()).toBe(200);

    const respBody = await resp.json();
    // console.log(respBody);
    const validationResult = quotesSchema.safeParse(respBody);
    expect(validationResult.success).toBe(true);
    console.error(validationResult.error);
    expect(respBody).toHaveProperty("quotes");

    if (!validationResult.success) {
      console.error("Schema validation errors:", validationResult.error);
    } else {
      console.log("[[INFO]] => Response body matches the schema");
    }
  });
});
