import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import superjson from 'superjson';
import { prisma } from '../prisma/client';

export const createContext = async ({ req: _req, res: _res, }: trpcExpress.CreateExpressContextOptions) => {
  return {
    prisma
  }
};
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;
export const mergeRouters = t.mergeRouters;
export const publicProcedure = t.procedure;