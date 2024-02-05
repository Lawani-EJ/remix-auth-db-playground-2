import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@vercel/remix";
import { json } from "@vercel/remix";
import { Cursor } from "~/components";
import { RoomProvider, useMyPresence, useOthers } from "~/liveblocks.config";

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

export async function loader({ params }: LoaderFunctionArgs) {
  return json({
    boardId: params.id,
  });
}

export default function Board() {
  const { boardId } = useLoaderData<typeof loader>();
  const others = useOthers();
  const [{ cursor }, updateMyPresence] = useMyPresence();

  return (
    <RoomProvider
      id={`board-room-${boardId}`}
      initialPresence={{ cursor: null }}
    >
      <div
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
      >
        <h1>Board {boardId}</h1>
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
      </div>
    </RoomProvider>
  );
}
