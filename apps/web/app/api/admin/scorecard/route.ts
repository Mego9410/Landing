import { adminFrom } from "@/lib/admin";
import { addChange, cleanWeek, saveWeek, setResult } from "@/lib/growth";

// Saves the growth scorecard on /admin. Admins only (ADMIN_EMAILS, signed in).
//   POST { kind: "week", week_start, ...figures }   adds or replaces that week's row
//   POST { kind: "change", day, change, why? }       adds a change-log line
//   POST { kind: "result", id, result }              records what a change did
// → 204, or { error } with a sentence the form shows as it is.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body: unknown, status: number) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  if (!(await adminFrom(request.headers))) return json({ error: "Sign in as an admin first." }, 401);
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== "object") return json({ error: "Nothing was sent." }, 400);
  let error: string | undefined;
  if (body.kind === "week") {
    const res = cleanWeek(body);
    if ("error" in res) error = res.error; else await saveWeek(res.week);
  } else if (body.kind === "change") error = (await addChange(body)).error;
  else if (body.kind === "result") error = (await setResult(body)).error;
  else error = "Unknown request.";
  return error ? json({ error }, 400) : new Response(null, { status: 204 });
}
