import { beforeEach, describe, expect, test } from "vitest";
import supertest from "supertest";
import { app } from "src";
import { reset } from "prisma/client";
import { prisma } from "../../prisma/client";
import { hashPassword } from "src/lib/password";

beforeEach(async () => {
  await reset();
});

const getCookieHeader = (res: supertest.Response) => {
  return res.headers["set-cookie"][0].split(";")[0].split("=")[1];
};

const getSignedInUser = async () => {
  const user = await prisma.user.create({
    data: {
      name: "Test user",
      email: "test@email.com",
      passwordHash: await hashPassword("correct-password"),
    },
  });

  const signInResponse = await supertest(app).post("/signin").send({
    email: "test@email.com",
    password: "correct-password",
  });

  expect(signInResponse.statusCode).toBe(201);
  expect(signInResponse.headers).toHaveProperty("set-cookie");
  expect(signInResponse.body).toHaveProperty("message");

  const signInCookie = getCookieHeader(signInResponse);

  return {
    user,
    signInCookie,
  };
};

describe("POST /signin", () => {
  test("Should not work by sending nothing", async () => {
    const res = await supertest(app).post("/signin");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  test("Should not work by sending invalid credentials", async () => {
    const res = await supertest(app).post("/signin").send({
      email: "test@email.com",
      password: "wrong-password",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message");
  });

  test("Should work by sending valid credentials", async () => {
    await getSignedInUser();
  });
});

describe("GET /me", () => {
  test("Should not work by sending no sessionId", async () => {
    const res = await supertest(app).get("/me");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  test("Should not work by sending a invalid sessionId", async () => {
    const res = await supertest(app)
      .get("/me")
      .set("Cookie", "sessionId='test-session-id-fhjdjsaklfhdjas'");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message");
  });

  test("Should work by sending a valid sessionId", async () => {
    const { signInCookie } = await getSignedInUser();

    const meResponse = await supertest(app)
      .get("/me")
      .set("Cookie", `sessionId=${signInCookie}`);

    expect(meResponse.statusCode).toBe(200);
    expect(meResponse.body).toHaveProperty("user");
  });
});

describe("DELETE /signout", () => {
  test("Should not work by sending no sessionId", async () => {
    const res = await supertest(app).delete("/signout");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  test("Should not work by sending wrong sessionId", async () => {
    const res = await supertest(app)
      .delete("/signout")
      .set("Cookie", "sessionId='test-session-id-fhjdjsaklfhdjas'");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message");
  });

  test("Should work by sending a valid sessionId", async () => {
    const { signInCookie } = await getSignedInUser();

    const signOutResponse = await supertest(app)
      .delete("/signout")
      .set("Cookie", `sessionId=${signInCookie}`);

    expect(signOutResponse.statusCode).toBe(200);
    expect(signOutResponse.headers).toHaveProperty("set-cookie");
    expect(signOutResponse.body).toHaveProperty("message");
  });
});
