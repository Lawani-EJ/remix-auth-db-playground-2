import { prisma } from "~/db/prisma";

export async function checkUserExists(email: string): Promise<boolean> {
  const user = await prisma.account.findUnique({
    where: {
      email,
    },
  });

  return user !== null;
}
