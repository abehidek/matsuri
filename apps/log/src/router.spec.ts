import { beforeEach, describe, expect, test } from "vitest";
import supertest from "supertest";
import { app } from "./index";
import { reset } from "../prisma/client";

beforeEach(async () => {
  await reset();
});

describe("GET /", () => {
  test("Should work by sending nothing", async () => {
    const res = await supertest(app).get("/");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("logs");
  });
});

describe("POST /", () => {
  test("Should not work by sending nothing", async () => {
    const res = await supertest(app).post("/");
    expect(res.statusCode).toBe(400);
  });

  test("Should not work by sending random wrong info", async () => {
    const newLogResponse = await supertest(app).post("/").send({
      appName: "fda8sfdashjl",
      typeName: "fdjsafdashjl",
      message: "Random log",
    });
    expect(newLogResponse.statusCode).toBe(400);
    expect(newLogResponse.body).toHaveProperty("message");

    const logsResponse = await supertest(app).get("/");
    expect(logsResponse.statusCode).toBe(200);
    expect(logsResponse.body).toHaveProperty("logs");
    expect(logsResponse.body.logs).toHaveLength(0);
  });

  test("Should work by sending correct info", async () => {
    const newLogResponse = await supertest(app).post("/").send({
      appName: "auth",
      typeName: "test",
      message: "Message created on log router.spec.ts test",
    });
    expect(newLogResponse.statusCode).toBe(200);
    expect(newLogResponse.body).toHaveProperty("message");

    const logsResponse = await supertest(app).get("/");
    expect(logsResponse.statusCode).toBe(200);
    expect(logsResponse.body).toHaveProperty("logs");
  });
});
