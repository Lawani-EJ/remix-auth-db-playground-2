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
      <div className="flex items-center justify-center gap-5">
        <Link
          to="/login"
          style={{
            backgroundColor: "darkcyan",
            color: "white",
            padding: "1rem",
            borderRadius: "0.5rem",
          }}
        >
          Login
        </Link>
        <Link
          to="/register"
          style={{
            backgroundColor: "darkgray",
            color: "white",
            padding: "1rem",
            borderRadius: "0.5rem",
          }}
        >
          Register
        </Link>
      </div>
    </main>
  );
}
