import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanUp() {
  // Delete users with email addresses matching the test pattern
  await prisma.account.deleteMany({
    where: {
      email: {
        contains: "test_",
        endsWith: "@example.com",
      },
    },
  });

  await prisma.$disconnect();
}

cleanUp()
  .then(() => {
    console.log("Database cleaned up");
  })
  .catch((e) => {
    console.error(e);
  });
