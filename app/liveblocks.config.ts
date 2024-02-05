import type { LiveList } from "@liveblocks/client";
import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  publicApiKey:
    process.env.PUBLIC_LIVEBLOCKS_PUBLIC_API_KEY || "your_default_api_key_here",
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
