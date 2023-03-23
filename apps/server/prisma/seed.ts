import { prisma } from "./client"

(async function () {
  console.log("\n 🌱 Seeding database with fake data 🌱\n")

  await prisma.note.create({
    data: {
      content: "# Hello this is my first note",
      userId: "123",
    }
  });

  await prisma.note.create({
    data: {
      content: "## No idea how it works!",
      userId: "123",
    }
  });

  await prisma.note.create({
    data: {
      content: "This guy Robespierre is crazy!",
      userId: "321",
    }
  });
}())