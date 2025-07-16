import { PrismaClient } from "../src/generated/prisma/index.js";
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: "alice@d.io",
      name: "Alice",
      todos: {
        create: [],
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
