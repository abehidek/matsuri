import express, { type Response } from "express";
import { $try } from "utils";
import { prisma } from "../prisma/client";
import { z } from "zod";

type ExpressErrorParams = {
  res: Response;
  code: number;
  cause?: unknown;
  json: {
    [key: string]: unknown;
  };
};

export const expressError = async (params: ExpressErrorParams) => {
  console.error(params.cause);
  return params.res.status(params.code).json(params.json);
};

const router = express.Router();

router.get("/", async (req, res) => {
  const [logs, error] = await $try(prisma.log.findMany());

  if (error)
    return expressError({
      code: 500,
      res,
      json: { message: "Failed to fetch logs" },
      cause: error,
    });

  return res.status(200).json({ logs });
});

const ALLOWED_APPS = ["auth", "server", "log"] as const;
// const TYPE_NAMES = ["error", "test", "auth:start"] as const;

const createLogSchema = z.object({
  appName: z.enum(ALLOWED_APPS),
  // typeName: z.enum(TYPE_NAMES).optional(),
  typeName: z.string(),
  message: z.string(),
});

router.post("/", async (req, res) => {
  const parseResult = createLogSchema.safeParse(req.body);

  if (!parseResult.success)
    return expressError({
      code: 400,
      res,
      json: {
        message: `Request formatted incorrectly`,
        error: parseResult.error.format(),
      },
      cause: parseResult.error,
    });

  const [_, error] = await $try(
    prisma.log.create({
      data: {
        appName: parseResult.data.appName,
        typeName: parseResult.data.typeName,
        message: parseResult.data.message,
      },
    })
  );

  if (error)
    return expressError({
      code: 500,
      res,
      json: { message: "Failed to create log" },
      cause: error,
    });

  return res.json({ message: "Log created succesfully" });
});

export default router;
