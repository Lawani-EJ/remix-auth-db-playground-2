import type { LiveList } from "@liveblocks/client";
import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  authEndpoint: "/api/liveblocks-auth",
});

type Presence = {
  cursor: { x: number; y: number } | null;
};

type Storage = {
  cards: LiveList<{
    id: string;
    text: string;
  }>;
};

type UserMeta = {
  id: string;
  info: {
    email: string;
  };
};

export const { RoomProvider, useOthers, useSelf, useMyPresence } =
  createRoomContext<Presence, Storage, UserMeta>(client);
