import { ENV } from "../../config/env.d";
import { test, expect } from "@playwright/test";

// const baseURL = "https://dummyjson.com";

const id = 66; // existing user id

test.describe("API Login Tests", async () => {
  test("POST User Login - Successful", async ({ request }) => {
    const loginPayload = {
      username: "emilys",
      password: "emilyspass",
      expiresInMins: 30,
    };

    const response = await request.post(
      `${ENV.BASE_URL_DUMMYJSON}/user/login`,
      {
        data: loginPayload,
      },
    );

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
    const response = await request.post(
      `${ENV.BASE_URL_DUMMYJSON}/user/login`,
      {
        data: loginPayloadFailed,
      },
    );
    expect(response.status()).toBe(400);

    const responseBody = await response.json();
    // console.log(responseBody);
    expect(responseBody).toHaveProperty("message", "Invalid credentials");
  });

  test("POST add User - Successful", async ({ request }) => {
    const response = await request.post(`${ENV.BASE_URL_DUMMYJSON}/users/add`);
    expect(response.status()).toBe(201);

    const responseBody = await response.json();
    // console.log(responseBody);
  });

  test("PUT update User - Successful", async ({ request }) => {
    const response = await request.put(
      `${ENV.BASE_URL_DUMMYJSON}/users/${id}`,
      {
        data: {
          firstName: "JokoUI",
        },
      },
    );
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.firstName).toBe("JokoUI");
    // console.log(responseBody);
  });

  test("DELETE User - Successful", async ({ request }) => {
    const response = await request.delete(
      `${ENV.BASE_URL_DUMMYJSON}/users/${id}`,
    );
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    // console.log(responseBody);
    expect(responseBody).toHaveProperty("isDeleted", true);
    console.log("User deleted on: " + responseBody.deletedOn);
  });
});
