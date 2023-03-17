import { PrismaClient, User } from "../node_modules/.prisma/client";

import { env } from "env";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

export { type User };

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
