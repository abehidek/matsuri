import { prisma } from "./client"

// todo: pull users from a local file which also will be used by the test package
(async function () {
  console.log("\n 🌱 Seeding database with fake data 🌱\n")

  await prisma.user.create({
    data: {
      name: "Abe Hidek",
      bio: "Average functional programmer",
    }
  });
}())