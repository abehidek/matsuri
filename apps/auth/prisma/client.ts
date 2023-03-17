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

export const reset = async () => {
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
};

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
