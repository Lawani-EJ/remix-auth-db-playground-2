import { prisma } from "~/db/prisma";

export async function createBoard(userId: string) {
  return await prisma.$transaction(async (prisma) => {
    const board = await prisma.board.create({
      data: {
        name: "New Board",
        owner: {
          connect: {
            id: userId,
          },
        },
      },
    });

    await prisma.boardRole.create({
      data: {
        role: "owner", // Assuming the user creating the board is the owner
        boardId: board.id,
        accountId: userId,
      },
    });

    return board;
  });
}

export async function getBoardsForUserWithId(userId: string) {
  return await prisma.boardRole
    .findMany({
      where: {
        accountId: userId,
      },
      include: {
        board: true,
      },
    })
    .then((roles) => roles.map((role) => role.board));
}
