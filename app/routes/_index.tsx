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
        columnGap: "50px",
        height: "100vh",
      }}
    >
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
    </main>
  );
}
