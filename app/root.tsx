import { cssBundleHref } from "@remix-run/css-bundle";
import {
  Form,
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
import stylesheet from "~/tailwind.css";
import { requireAuthCookie } from "./auth/auth";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: stylesheet },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireAuthCookie(request);

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
      <body className="bg-gray-100 flex-col items-center">
        <nav className="bg-gray-800 text-white w-full p-4 gap-4 flex items-center">
          {isAuthenticated ? (
            <>
              <Link to="/board" className="text-white">
                Board
              </Link>
              <Form method="post" action="/logout">
                <button className="block text-center">
                  <span className="text-white">Logout</span>
                </button>
              </Form>
            </>
          ) : (
            <>
              <Link to="/" className="text-white">
                Home
              </Link>

              <Link to="/sign-in" className="text-white">
                Sign In
              </Link>

              <Link to="/sign-up" className="text-white">
                Sign Up
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
