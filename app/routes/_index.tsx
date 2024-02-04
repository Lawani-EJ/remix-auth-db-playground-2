import type { MetaFunction } from "@vercel/remix";
import { redirectIfLoggedInLoader } from "~/auth";

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
      <h1
        style={{
          color: "black",
          fontWeight: "bold",
          fontSize: "9rem",
        }}
      >
        Landing page
      </h1>
    </main>
  );
}
