import type { LoaderFunctionArgs } from "@vercel/remix";
import { requireAuthCookie } from "~/auth";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuthCookie(request);
  return null;
}

export default function Board() {
  return (
    <div>
      <h1>Boards</h1>
    </div>
  );
}
