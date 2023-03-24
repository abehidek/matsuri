import { prisma } from "./client"
import { seedUsers } from 'auth-sdk'

(async function () {
  console.log("\n 🌱 Seeding database with fake data 🌱\n")

  await prisma.note.create({
    data: {
      content: "<p>Hello this is my first note</p>",
      userId: seedUsers[0].id,
    }
  });

  await prisma.note.create({
    data: {
      content: "<h1>No idea how it works!</h1>",
      userId: seedUsers[0].id,
    }
  });

  await prisma.note.create({
    data: {
      content: "<p>This guy Robespierre is crazy!</p>",
      userId: seedUsers[1].id,
    }
  });
}())