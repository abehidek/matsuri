import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { env } from 'env';

export const appRouter = router({
  getAll: publicProcedure.input(z.string()).query(({ input }) => {
    return { yourInput: input, name: 'Bilbo', serverEnv: env };
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;