import { test, expect } from "@playwright/test";

const baseURL = "https://dummyjson.com";

test.describe("API Login Tests", () => {
  test("POST User Login - Successful", async ({ request }) => {
    const loginPayload = {
      username: "emilys",
      password: "emilyspass",
      expiresInMins: 30,
    };

    const response = await request.post(`${baseURL}/user/login`, {
      data: loginPayload,
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();

    // console.log(responseBody);

    expect(responseBody).toHaveProperty("accessToken");
    console.log("Access token received: " + responseBody.accessToken);
    expect(responseBody).toHaveProperty("id", 1);
    expect(responseBody).toHaveProperty("username", "emilys");
  });

  test("POST User Login - Invalid Credentials", async ({ request }) => {
    const loginPayloadFailed = {
      username: "emilya",
      password: "emilyapass",
      expiresInMins: 30,
    };
    const response = await request.post(`${baseURL}/user/login`, {
      data: loginPayloadFailed,
    });
    expect(response.status()).toBe(400);

    const responseBody = await response.json();
    console.log(responseBody);
    expect(responseBody).toHaveProperty("message", "Invalid credentials");
  });
});
