import { ENV } from "../../config/env.d";
import { test, expect } from "@playwright/test";

// const baseURL = "https://dummyjson.com";

test.describe("API test Full CRUD Operations", async () => {
  test.skip(!!process.env.CI, "Skip test on CI environment");
  let ids: number;
  // to store the created user id
  test("POST add User - Joks Malud", async ({ request }) => {
    const responseAdduser = await request.post(
      `${ENV.BASE_URL_DUMMYJSON}/users/add`,
      {
        data: {
          firstName: "Joks",
          lastName: "Malud",
          age: 29,
          email: "joksmalud.go@example.com",
          phone: "+12345672130",
        },
      },
    );
    expect(responseAdduser.status()).toBe(201);
    const responseBodyAddUser = await responseAdduser.json();
    ids = responseBodyAddUser.id;
    console.log("User created with ID:", ids);

    const responseUpdateUser = await request.put(
      `${ENV.BASE_URL_DUMMYJSON}/users/${ids}`,
      {
        data: {
          firstName: "Joksan",
          lastName: "Jamalud",
          role: "Mandiri",
        },
      },
    );
    expect(responseUpdateUser.status()).toBe(200);
    const responseBodyUpdateUser = await responseUpdateUser.json();
    expect(responseBodyUpdateUser.firstName).toBe("Joksan");
    expect(responseBodyUpdateUser.lastName).toBe("Jamalud");
    expect(responseBodyUpdateUser.role).toBe("Mandiri");
    // console.log(responseBodyUpdateUser);

    const responseDeleteUser = await request.delete(
      `${ENV.BASE_URL_DUMMYJSON}/users/${ids}`,
    );
    expect(responseDeleteUser.status()).toBe(200);

    const responseBody = await responseDeleteUser.json();
    // console.log(responseBody);
    expect(responseBody).toHaveProperty("isDeleted", true);
    console.log("User deleted on: " + responseBody.deletedOn);
  });
});
