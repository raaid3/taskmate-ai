import { PrismaClient } from "@prisma/client";
import { testUser1 } from "../src/tests/test-data/users.js";
import { todoItem1, todoItem2 } from "../src/tests/test-data/todos.js";

export async function seed() {
  const prisma = new PrismaClient();
  try {
    // create user
    await prisma.user.create({
      data: {
        username: testUser1.username,
        id: testUser1.id,
      },
    });

    await prisma.todoItem.createMany({
      data: [todoItem1, todoItem2],
    });
    await prisma.$disconnect();
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

export async function cleanup() {
  const prisma = new PrismaClient();
  try {
    await prisma.todoItem.deleteMany({
      where: {
        authorId: testUser1.id,
      },
    });
    await prisma.user.delete({
      where: {
        id: testUser1.id,
      },
    });
    await prisma.$disconnect();
  } catch (error) {
    console.error("Error cleaning up:", error);
  }
}

seed();
