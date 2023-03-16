import { prisma } from "./client"

(async function () {
  console.log("\n 🌱 Seeding database with fake data 🌱\n")

  await prisma.note.create({
    data: {
      title: "First Note",
      content: "# Hello this is my first note",
      userId: "123",
    }
  });

  await prisma.note.create({
    data: {
      title: "Polimorphisms in PL",
      content: "## No idea how it works!",
      userId: "123",
    }
  });

  await prisma.note.create({
    data: {
      title: "French Revolution",
      content: "This guy Robespierre is crazy!",
      userId: "321",
    }
  });
}())