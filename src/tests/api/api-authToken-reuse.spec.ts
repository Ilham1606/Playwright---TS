import { ENV } from "../../config/env.d";
import { test, expect } from "@playwright/test";

const baseURL = "https://dummyjson.com";
let token: string;

test.describe("Auth token reuse flow", () => {
  test("Login - get token", async ({ request }) => {
    const objRes = await request.post(`${ENV.BASE_URL_DUMMYJSON}/user/login`, {
      data: {
        username: "mateon",
        password: "mateonpass",
      },
    });

    expect(objRes.status()).toBe(200);

    // Header validation
    expect(objRes.headers()["content-type"]).toContain("application/json");
    const body = await objRes.json();
    expect(body).toHaveProperty("accessToken");

    token = body.accessToken;
    console.log("[INFO] Token received: " + token);
  });

  test("Get auth user using token", async ({ request }) => {
    const objRes = await request.get(`${ENV.BASE_URL_DUMMYJSON}/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(objRes.status()).toBeLessThan(2000);
    console.log("[INFO] Status code: " + objRes.status());

    // Header validation
    expect(objRes.headers()["content-type"]).toContain("application/json");

    const body = await objRes.json();
    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("username");
  });
});
