import { cssBundleHref } from "@remix-run/css-bundle";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/react";
import {
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
} from "@vercel/remix";
import { getAuthFromRequest } from "./auth";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getAuthFromRequest(request);

  return json({
    isAuthenticated: Boolean(userId),
  });
}

export default function App() {
  const { isAuthenticated } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        style={{
          backgroundColor: "#f3f4f6",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <nav
          style={{
            backgroundColor: "#1f2937",
            color: "white",
            width: "100%",
            padding: "16px",
            gap: "16px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {isAuthenticated ? (
            <>
              <Link to="/boards" style={{ color: "white" }}>
                Boards
              </Link>
              <form method="post" action="/logout">
                <button
                  style={{
                    display: "block",
                    textAlign: "center",
                    backgroundColor: "black",
                  }}
                >
                  <span style={{ color: "white" }}>Logout</span>
                </button>
              </form>
            </>
          ) : (
            <>
              <Link to="/" style={{ color: "white" }}>
                Home
              </Link>

              <Link to="/login" style={{ color: "white" }}>
                Login
              </Link>

              <Link to="/register" style={{ color: "white" }}>
                Register
              </Link>
            </>
          )}
        </nav>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Analytics />
      </body>
    </html>
  );
}
