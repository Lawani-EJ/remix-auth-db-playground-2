import type { LiveList, LiveObject } from "@liveblocks/client";
import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  authEndpoint: "/api/liveblocks-auth",
});

type Presence = {
  cursor: { x: number; y: number } | null;
};

export type Storage = {
  cards: LiveList<
    LiveObject<{
      text: string;
      id: string;
    }>
  >;
};

type UserMeta = {
  id: string;
  info: {
    email: string;
  };
};

export const {
  RoomProvider,
  useOthers,
  useSelf,
  useMyPresence,
  useStorage,
  useMutation,
} = createRoomContext<Presence, Storage, UserMeta>(client);
