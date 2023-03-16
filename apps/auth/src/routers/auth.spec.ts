import { describe, expect, test } from 'vitest'
import supertest from 'supertest';
import { app } from 'src';


describe("GET /me", () => {
  test("Should work by sending nothing", async () => {
    const res = await supertest(app).get("/me");

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty("message");
  });
})
