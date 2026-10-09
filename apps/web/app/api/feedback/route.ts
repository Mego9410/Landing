import { userFrom } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { ensureExtraTables } from "@/lib/db/extra";
import { LAPSE_REASONS, tooMany } from "@/lib/events";

// Why someone cancelled, from the card the app shows once after a cancellation. Optional, never blocks the app.
//   POST { installId, reason, note? } → 204. reason is one of LAPSE_REASONS; note is up to 500 characters.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const json = (body: unknown, status: number) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (tooMany(`feedback:${ip}`, 10)) return json({ error: "Too many requests." }, 429);
  const body = await request.json().catch(() => null) as { installId?: unknown; reason?: unknown; note?: unknown } | null;
  if (!body || typeof body.installId !== "string" || !UUID.test(body.installId)) return json({ error: "Send { installId, reason }." }, 400);
  if (typeof body.reason !== "string" || !(LAPSE_REASONS as readonly string[]).includes(body.reason)) return json({ error: "Unknown reason." }, 400);
  const note = typeof body.note === "string" ? body.note.trim().slice(0, 500) || null : null;
  await ensureExtraTables();
  const user = await userFrom(request).catch(() => null);
  await (await getDb()).insert(schema.lapseFeedback).values({ installId: body.installId.toLowerCase(), userId: user?.id ?? null, reason: body.reason, note });
  return new Response(null, { status: 204 });
}
