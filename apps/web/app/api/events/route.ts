import { sql } from "drizzle-orm";
import { userFrom } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { ensureExtraTables } from "@/lib/db/extra";
import { parseEvents, tooMany } from "@/lib/events";

// Funnel events from the app (see lib/events.ts for what's allowed).
//   POST { installId, events: [{ name, at?, props? }] } → 204. Works signed in or not; signed in (a bearer token), the
//   account ID is attached. Limited per IP and per install (429 when over), and anything not on the list is dropped.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 16_000;
const PER_INSTALL_PER_DAY = 400;
const json = (body: unknown, status: number) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (tooMany(`ip:${ip}`)) return json({ error: "Too many requests." }, 429);
  const text = await request.text();
  if (text.length > MAX_BYTES) return json({ error: "Too much in one go." }, 413);
  let body: unknown;
  try { body = JSON.parse(text); } catch { return json({ error: "That wasn't valid data." }, 400); }
  const parsed = parseEvents(body);
  if ("error" in parsed) return json({ error: parsed.error }, 400);
  if (tooMany(`install:${parsed.installId}`)) return json({ error: "Too many requests." }, 429);
  if (!parsed.events.length) return new Response(null, { status: 204 });

  await ensureExtraTables();
  const db = await getDb();
  const res = (await db.execute(sql`select count(*) as n from events where install_id = ${parsed.installId} and created_at > now() - interval '1 day'`)) as unknown as { rows: { n: unknown }[] };
  if (Number(res.rows[0]?.n ?? 0) + parsed.events.length > PER_INSTALL_PER_DAY) return json({ error: "Too many events today." }, 429);

  const user = await userFrom(request).catch(() => null);
  await db.insert(schema.events).values(parsed.events.map((e) => ({ createdAt: e.at, installId: parsed.installId, userId: user?.id ?? null, name: e.name, props: e.props })));
  return new Response(null, { status: 204 });
}
