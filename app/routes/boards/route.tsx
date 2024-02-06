import { Form, useLoaderData } from "@remix-run/react";
import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
} from "@vercel/remix";
import { requireAuthCookie } from "~/auth";
import { createBoard, getBoardsForUserWithId } from "./queries";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireAuthCookie(request);

  const boards = await getBoardsForUserWithId(userId);

  return json({
    boards,
  });
}

export default function Board() {
  const { boards } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Boards</h1>
      <Form method="post">
        <button type="submit">Create a board</button>
      </Form>

      <ul>
        {boards.map((board) => (
          <li key={board.id}>
            <a href={`/boards/${board.id}`}>{board.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireAuthCookie(request);
  const board = await createBoard(userId);
  return redirect(`/boards/${board.id}`);
}
