/* c8 ignore start */
import { TRPCError, inferAsyncReturnType, initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import superjson from "superjson";
import { prisma } from "../prisma/client";
import { $try } from "utils";
import { authClient } from "auth-sdk";
import { z } from "zod";

export const createContext = async ({ req, res: _res }: trpcExpress.CreateExpressContextOptions) => {
  const parseResult = z
    .object({
      sessionId: z.string().min(1),
    })
    .safeParse(req.cookies);

  if (!parseResult.success) {
    return {
      prisma,
      ok: false,
      error: parseResult.error,
    };
  }

  const [authResponse, authError] = await $try(
    authClient.me({
      sessionId: parseResult.data.sessionId,
    })
  );

  if (authError) {
    return {
      prisma,
      ok: false,
      error: authError,
    };
  }

  if (!authResponse.ok) {
    return {
      prisma,
      ok: false,
      error: authResponse.message,
    };
  }

  return {
    prisma,
    ok: true,
    user: authResponse.user,
    sessionId: parseResult.data.sessionId,
  };
};
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

const isAuthenticated = t.middleware(({ next, ctx }) => {
  if (!ctx.ok || !ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      cause: ctx.error,
    });
  }

  return next({
    ctx: {
      prisma: ctx.prisma,
      user: ctx.user,
      sessionId: ctx.sessionId,
    },
  });
});

export const router = t.router;
export const mergeRouters = t.mergeRouters;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);
/* c8 ignore stop */
