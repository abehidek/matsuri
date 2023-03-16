import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { env } from 'env';
import { $try } from 'utils';
import { TRPCError } from '@trpc/server';

export const appRouter = router({
  getAll: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const [data, error] = await $try(ctx.prisma.note.findMany())

    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        cause: error,
        message: "Failed to fetch notes"
      })
    };

    return { yourInput: input, name: 'Bilbo', serverEnv: env, notes: data };
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;