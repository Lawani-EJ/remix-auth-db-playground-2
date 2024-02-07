import { prisma } from "~/db/prisma";
import type { Role } from "~/schemas";
import { RoleSchema } from "~/schemas";

export async function isUserBoardEditor(userId: string, boardId: string) {
  const boardRole = await prisma.boardRole.findUnique({
    where: {
      boardId_accountId: {
        boardId,
        accountId: userId,
      },
    },
  });

  return (
    boardRole &&
    (boardRole.role === RoleSchema.enum.editor ||
      boardRole.role === RoleSchema.enum.owner)
  );
}

type AddBoardMemberParams = {
  boardId: string;
  email: string;
  role: Role;
};

type AddBoardMemberResponse =
  | {
      status: "success";
    }
  | {
      status: "error";
      message: string;
    };

export async function addBoardMember({
  boardId,
  email,
  role,
}: AddBoardMemberParams): Promise<AddBoardMemberResponse> {
  const accountToBeAdded = await prisma.account.findUnique({
    where: {
      email,
    },
  });

  console.log("accountToBeAdded", accountToBeAdded);

  if (!accountToBeAdded) {
    return { status: "error", message: "Account with email not found" };
  }

  const existingBoardRole = await prisma.boardRole.findFirst({
    where: {
      accountId: accountToBeAdded.id,
      boardId,
    },
  });

  if (existingBoardRole) {
    return {
      status: "error",
      message: "Account is already a member of the board",
    };
  }

  await prisma.boardRole.create({
    data: {
      role,
      account: {
        connect: {
          id: accountToBeAdded.id,
        },
      },
      board: {
        connect: {
          id: boardId,
        },
      },
    },
  });

  return { status: "success" };
}
