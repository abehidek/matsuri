import { describe, expect, test } from 'vitest'
import { prisma } from '../../prisma/client';
import { appRouter } from './root';

const caller = appRouter.createCaller({
  prisma
});

describe("getAll", () => {
  test("Should not work by sending an input number", async () => {
    // @ts-expect-error: test to see if it's not working
    await expect(caller.getAll(123)).rejects.toThrowError();
  });
  test("Should work by sending an input string", async () => {
    const res = await caller.getAll("getAll test")
    expect(res).toHaveProperty("notes");
  });
})
