import { prisma } from "./client";
import { hashPassword } from "../src/lib/password";
import { seedUsers } from 'auth-sdk'

(async function () {
  console.log("\n 🌱 Seeding database with fake data 🌱\n");

  const hashedUsers = await Promise.all(seedUsers.map(async su => {
    const passwordHash = await hashPassword(su.password)
    
    const { password: _, ...rest } = su;
    return {
      ...rest,
      passwordHash
    }
  }))

  for (const user of hashedUsers) {
    await prisma.user.create({ data: user });
  }
})();
