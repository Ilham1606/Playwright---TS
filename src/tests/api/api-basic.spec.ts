import { test, expect } from "@playwright/test";

const baseURL = "https://dummyjson.com";

test.describe("API Basic Tests", () => {
  test("GET list users", async ({ request }) => {
    // send GET request to /users endpoint and store the response
    const response = await request.get(`${baseURL}/users`);
    if (response.status() === 200) {
      expect(response.status()).toBe(200);
      console.log("Status code is 200 as expected.");
    } else {
      console.log("Unexpected status code: " + response.status());
    }

    // parse the response body as JSON
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty("users");
    expect(responseBody.total).toBeGreaterThanOrEqual(208);
    expect(responseBody.skip).toBeGreaterThan(0);
    expect(responseBody.limit).toBeGreaterThanOrEqual(30);
  });

  test("GET Single user", async ({ request }) => {
    // send GET request to /users/1 endpoint and store the response
    const response = await request.get(`${baseURL}/users/1`);
    expect(response.status()).toBe(200);

    // parse the response body as JSON
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty("id", 1);
    expect(responseBody).toHaveProperty("firstName", "Emily");
    expect(responseBody).toHaveProperty("lastName", "Johnson");
    expect(responseBody).toHaveProperty("age", 29);
  });

  test("GET Single user - Not Found", async ({ request }) => {
    // send GET request to /users/9999 endpoint and store the response
    const response = await request.get(`${baseURL}/users/1616`);
    expect(response.status()).toBe(404);

    // parse the response body as JSON
    const responseBody = await response.json();
    console.log(responseBody);
    expect(responseBody).toHaveProperty(
      "message",
      "User with id '1616' not found"
    );
  });
});
