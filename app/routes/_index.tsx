import { Link } from "@remix-run/react";
import type { MetaFunction } from "@vercel/remix";
import { redirectIfLoggedInLoader } from "~/auth/auth";

export const loader = redirectIfLoggedInLoader;

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        rowGap: 100,
        height: "100vh",
      }}
    >
      <h1 className="text-black font-bold text-9xl">Landing page</h1>
    </main>
  );
}
