import { prisma } from "~/db/prisma";

export async function createBoard(userId: string) {
  return await prisma.board.create({
    data: {
      name: "New Board",
      owner: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export async function getBoards(userId: string) {
  return await prisma.board.findMany({
    where: {
      ownerId: userId,
    },
  });
}
