import { Form, useActionData, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Cursor } from "~/components";
import { RoomProvider, useMyPresence, useOthers } from "~/liveblocks.config";
import { requireAuthCookie } from "~/auth";
import { invariant } from "@epic-web/invariant";
import { z } from "zod";
import type { ActionFunctionArgs } from "@vercel/remix";
import { parseWithZod } from "@conform-to/zod";
import { addBoardMember, isUserBoardEditor } from "./queries";
import type { SubmissionResult } from "@conform-to/react";
import {
  getFormProps,
  getInputProps,
  getSelectProps,
  useForm,
} from "@conform-to/react";

const COLORS = [
  "#E57373",
  "#9575CD",
  "#4FC3F7",
  "#81C784",
  "#FFF176",
  "#FF8A65",
  "#F06292",
  "#7986CB",
];

export async function loader({ params, request }: LoaderFunctionArgs) {
  await requireAuthCookie(request);

  invariant(params.id, "No board ID provided");

  return json({
    boardId: params.id,
  });
}

export default function BoardRoute() {
  const { boardId } = useLoaderData<typeof loader>();

  return (
    <RoomProvider id={boardId} initialPresence={{ cursor: null }}>
      <Board />
    </RoomProvider>
  );
}

function Board() {
  const { boardId } = useLoaderData<typeof loader>();
  const others = useOthers();
  const [{ cursor }, updateMyPresence] = useMyPresence();

  const lastResult = useActionData<typeof action>();

  const [form, fields] = useForm({
    lastResult: lastResult as SubmissionResult<string[]> | null | undefined,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ActionSchema });
    },
    shouldValidate: "onSubmit",
  });

  return (
    <main
      onPointerMove={(event) => {
        console.log("pointer move", event.clientX, event.clientY);
        updateMyPresence({
          cursor: {
            x: Math.round(event.clientX),
            y: Math.round(event.clientY),
          },
        });
      }}
      onPointerLeave={() =>
        updateMyPresence({
          cursor: null,
        })
      }
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <h1>Board {boardId}</h1>

      <Form
        method="post"
        {...getFormProps(form)}
        style={{ display: "flex", flexDirection: "column", rowGap: 20 }}
      >
        <div>
          <label htmlFor={fields.role.id}>Select Role:</label>
          <select {...getSelectProps(fields.role)}>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        <div>
          <label htmlFor={fields.email.id}>Email:</label>
          <input {...getInputProps(fields.email, { type: "email" })} />
          {!fields.email.valid && (
            <div style={{ color: "red" }}>{fields.email.errors}</div>
          )}
        </div>

        <button type="submit">Add person</button>
      </Form>

      {others.map(({ connectionId, presence }) => {
        if (presence.cursor === null) {
          return null;
        }

        return (
          <Cursor
            key={`cursor-${connectionId}`}
            color={COLORS[connectionId % COLORS.length]}
            x={presence.cursor.x}
            y={presence.cursor.y}
          />
        );
      })}
    </main>
  );
}

const ActionSchema = z.object({
  role: z.enum(["editor", "viewer"]),
  email: z.string().email(),
});

export async function action({ request, params }: ActionFunctionArgs) {
  const userId = await requireAuthCookie(request);

  const boardId = params.id;

  invariant(boardId, "No board ID provided");

  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: ActionSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  if (!isUserBoardEditor(userId, boardId)) {
    return submission.reply({
      fieldErrors: {
        email: ["Invalid email or password"],
      },
    });
  }

  const { email, role } = submission.value;

  const result = await addBoardMember({
    boardId,
    email,
    role,
  });

  if (result.status === "error") {
    return submission.reply({
      fieldErrors: {
        email: [result.message],
      },
    });
  }

  return json({ success: true });
}
