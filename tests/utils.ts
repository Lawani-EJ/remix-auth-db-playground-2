import { faker } from "@faker-js/faker";
import { prisma } from "~/db/prisma";
import crypto from "crypto";

export function createRandomUser() {
  const username = faker.internet.userName();
  return {
    email: `test_${username}@example.com`,
    password: faker.internet.password(),
  };
}

export async function createAccount(email: string, password: string) {
  let salt = crypto.randomBytes(16).toString("hex");
  let hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha256")
    .toString("hex");

  return prisma.account.create({
    data: {
      email,
      Password: {
        create: {
          hash,
          salt,
        },
      },
    },
  });
}
