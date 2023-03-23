import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { env } from "env";
import { $try } from "utils";
import { TRPCError } from "@trpc/server";
import { noteRouter } from "./note";

export const appRouter = router({
  note: noteRouter,
  me: protectedProcedure.query(async ({ ctx, input }) => {
    return {
      user: ctx.user,
      sessionId: ctx.sessionId,
    };
  }),
  getAll: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const [data, error] = await $try(ctx.prisma.note.findMany());

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        cause: error,
        message: "Failed to fetch notes",
      });
    }

    return { yourInput: input, name: "Bilbo", serverEnv: env, notes: data };
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
