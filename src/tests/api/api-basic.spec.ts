import { ENV } from "../../config/env";
import { test, expect } from "@playwright/test";

// const baseURL = "https://dummyjson.com";

test.describe("API Basic Tests", () => {
  test("GET list users", async ({ request }) => {
    // send GET request to /users endpoint and store the response
    const response = await request.get(`${ENV.BASE_URL_DUMMYJSON}/users`);
    expect(response.status()).toBe(200);

    // parse the response body as JSON
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty("users");
    expect(responseBody.total).toBeGreaterThanOrEqual(208);
    expect(responseBody.skip).toBe(0);
    expect(responseBody.limit).toBeGreaterThanOrEqual(30);
    // console.log(responseBody);
  });

  test("GET Single user", async ({ request }) => {
    // send GET request to /users/1 endpoint and store the response
    const response = await request.get(`${ENV.BASE_URL_DUMMYJSON}/users/66`);
    expect(response.status()).toBe(200);

    // parse the response body as JSON
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty("id", 66);
    expect(responseBody).toHaveProperty("firstName", "Aria");
    expect(responseBody).toHaveProperty("lastName", "Ferguson");
    expect(responseBody).toHaveProperty("age", 28);
    console.log(responseBody);
  });

  test("GET Single user - Not Found", async ({ request }) => {
    // send GET request to /users/9999 endpoint and store the response
    const response = await request.get(`${ENV.BASE_URL_DUMMYJSON}/users/1616`);
    expect(response.status()).toBe(404);

    // parse the response body as JSON
    const responseBody = await response.json();
    // console.log(responseBody);
    expect(responseBody).toHaveProperty(
      "message",
      "User with id '1616' not found",
    );
  });
});
