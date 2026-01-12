import { test, expect } from "@playwright/test";
const baseURL = "https://dummyjson.com";

test.describe("API test Full CRUD Operations", async () => {
  let ids: number;
  // to store the created user id
  test("POST add User - Joks Malud", async ({ request }) => {
    const responseAdduser = await request.post(`${baseURL}/users/add`, {
      data: {
        firstName: "Joks",
        lastName: "Malud",
        age: 29,
        email: "joksmalud.go@example.com",
        phone: "+12345672130",
      },
    });
    expect(responseAdduser.status()).toBe(201);
    const responseBodyAddUser = await responseAdduser.json();
    ids = responseBodyAddUser.id;
    console.log("User created with ID:", ids);

    const responseUpdateUser = await request.put(`${baseURL}/users/${ids}`, {
      data: {
        firstName: "Joksan",
        lastName: "Jamalud",
        role: "Mandiri",
      },
    });
    expect(responseUpdateUser.status()).toBe(200);
    const responseBodyUpdateUser = await responseUpdateUser.json();
    expect(responseBodyUpdateUser.firstName).toBe("Joksan");
    expect(responseBodyUpdateUser.lastName).toBe("Jamalud");
    expect(responseBodyUpdateUser.role).toBe("Mandiri");
    console.log(responseBodyUpdateUser);

    const responseDeleteUser = await request.delete(`${baseURL}/users/${ids}`);
    expect(responseDeleteUser.status()).toBe(200);

    const responseBody = await responseDeleteUser.json();
    console.log(responseBody);
    expect(responseBody).toHaveProperty("isDeleted", true);
    console.log("User deleted on: " + responseBody.deletedOn);
  });
});
