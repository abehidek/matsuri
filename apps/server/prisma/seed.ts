import { prisma } from "./client"

(async function () {
  console.log("\n 🌱 Seeding database with fake data 🌱\n")

  await prisma.note.create({
    data: {
      content: "<p>Hello this is my first note</p>",
      userId: "123",
    }
  });

  await prisma.note.create({
    data: {
      content: "<h1>No idea how it works!</h1>",
      userId: "123",
    }
  });

  await prisma.note.create({
    data: {
      content: "<p>This guy Robespierre is crazy!</p>",
      userId: "321",
    }
  });
}())