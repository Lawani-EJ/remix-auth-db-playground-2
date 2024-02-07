import { requireAuthCookie } from "~/auth";
import { prisma } from "~/db/prisma";
import { invariant } from "@epic-web/invariant";
import type { ActionFunctionArgs } from "@vercel/remix";
import { RoleSchema } from "~/schemas";
import { liveblocks } from "~/helpers/liveblocks";

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireAuthCookie(request);

  const user = await getUserFromDB(userId);

  invariant(user, "User not found");

  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      email: user.email,
    },
  });

  const { room } = await request.json();

  invariant(typeof room === "string", "Invalid room");

  const role = await getUserRole(user.id, room);

  if (role === "viewer") {
    session.allow(room, session.READ_ACCESS);
  } else {
    session.allow(room, session.FULL_ACCESS);
  }

  // Authorize the user and return the result
  const result = await session.authorize();

  if (result.error) {
    console.error("Liveblocks authentication failed:", result.error);
    return new Response(undefined, { status: 403 });
  }

  return new Response(result.body, { status: result.status });
};

async function getUserFromDB(userId: string) {
  return await prisma.account.findUnique({
    where: {
      id: userId,
    },
  });
}

async function getUserRole(userId: string, boardId: string) {
  const boardRole = await prisma.boardRole.findUnique({
    where: {
      boardId_accountId: {
        boardId: boardId,
        accountId: userId,
      },
    },
  });

  invariant(boardRole, "Role not found");

  return RoleSchema.parse(boardRole.role);
}
