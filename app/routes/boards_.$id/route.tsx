import { Form, useActionData, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Cursor } from "~/components";
import type { Storage } from "~/liveblocks.config";
import {
  RoomProvider,
  useMyPresence,
  useOthers,
  useStorage,
  useMutation,
  useSelf,
} from "~/liveblocks.config";
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
import { liveblocks } from "~/helpers/liveblocks";
import type { PlainLsonObject } from "@liveblocks/client";
import { LiveList, LiveObject, toPlainLson } from "@liveblocks/client";

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

  const boardId = params.id;

  invariant(boardId, "No board ID provided");

  try {
    await liveblocks.getRoom(boardId);
  } catch (error) {
    await liveblocks.createRoom(boardId, {
      defaultAccesses: ["room:write"],
    });
  }

  let storage = await liveblocks.getStorageDocument(boardId, "json");

  const isStorageEmpty = Object.keys(storage).length === 0;
  if (isStorageEmpty) {
    const initialStorage: LiveObject<Storage> = new LiveObject({
      cards: new LiveList([]),
    });

    const initialStoragePlain: PlainLsonObject = toPlainLson(
      initialStorage
    ) as PlainLsonObject;

    storage = await liveblocks.initializeStorageDocument(
      boardId,
      initialStoragePlain
    );
  }

  console.log("storage", storage);

  return json({
    boardId,
    cards: storage.cards as unknown as LiveList<
      LiveObject<{ id: string; text: string }>
    >,
  });
}

export default function BoardRoute() {
  const { boardId, cards } = useLoaderData<typeof loader>();
  return (
    <RoomProvider
      id={boardId}
      initialPresence={{ cursor: null }}
      initialStorage={{
        cards: cards as LiveList<LiveObject<{ id: string; text: string }>>,
      }}
    >
      <Board />
    </RoomProvider>
  );
}

function Board() {
  const { boardId } = useLoaderData<typeof loader>();
  const others = useOthers();
  const self = useSelf();
  const [{ cursor }, updateMyPresence] = useMyPresence();

  const lastResult = useActionData<typeof action>();

  const [personForm, personFields] = useForm({
    lastResult: lastResult as SubmissionResult<string[]> | null | undefined,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ActionSchema });
    },
    shouldValidate: "onSubmit",
  });

  // Get the LiveList of cards from the storage
  const cards = useStorage((root) => root.cards);

  const addCard = useMutation(({ storage }) => {
    storage.get("cards").push(
      new LiveObject({
        id: crypto.randomUUID(),
        text: "New card",
      })
    );
  }, []);

  const updateCardText = useMutation(
    ({ storage }, cardId: string, newText: string) => {
      const cards = storage.get("cards");

      const cardIndex = cards.findIndex((card) => card.get("id") === cardId);

      if (cardIndex !== -1) {
        cards.set(cardIndex, new LiveObject({ id: cardId, text: newText }));
      }
    },
    []
  );

  return (
    <main
      onPointerMove={(event) => {
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          rowGap: 200,
        }}
      >
        <h1>Board {boardId}</h1>

        <div>
          <ul>
            {cards?.map((card) => (
              <textarea
                key={card.id}
                value={card.text}
                disabled={!self?.canWrite}
                onChange={(event) =>
                  updateCardText(card.id, event.target.value)
                }
              />
            ))}
          </ul>

          <button type="button" onClick={addCard}>
            Create Card
          </button>
        </div>

        <Form
          method="post"
          {...getFormProps(personForm)}
          style={{ display: "flex", flexDirection: "column", rowGap: 20 }}
        >
          <div>
            <label htmlFor={personFields.role.id}>Select Role:</label>
            <select {...getSelectProps(personFields.role)}>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div>
            <label htmlFor={personFields.email.id}>Email:</label>
            <input {...getInputProps(personFields.email, { type: "email" })} />
            {!personFields.email.valid && (
              <div style={{ color: "red" }}>{personFields.email.errors}</div>
            )}
          </div>

          <button type="submit">Add person</button>
        </Form>
      </div>

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
