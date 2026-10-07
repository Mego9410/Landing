import { and, eq } from "drizzle-orm";
import { userFrom } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";

// The signed-in person's app data, as one document.
//   GET  → 200 { data, revision, updatedAt }, or 204 if nothing has been saved yet.
//   PUT  { data, baseRevision } → 200 { revision, updatedAt } if baseRevision matches what's stored (0 for a first save),
//        or 409 with the stored copy if another phone saved since, so the app can choose which to keep.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 2_000_000;
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function GET(request: Request) {
  const user = await userFrom(request);
  if (!user) return json({ error: "Sign in first." }, 401);
  const db = await getDb();
  const [row] = await db.select().from(schema.appState).where(eq(schema.appState.userId, user.id));
  if (!row) return new Response(null, { status: 204 });
  return json({ data: row.data, revision: row.revision, updatedAt: row.updatedAt });
}

export async function PUT(request: Request) {
  const user = await userFrom(request);
  if (!user) return json({ error: "Sign in first." }, 401);
  const text = await request.text();
  if (text.length > MAX_BYTES) return json({ error: "That's too much data to save in one go." }, 413);
  let body: { data?: unknown; baseRevision?: unknown };
  try { body = JSON.parse(text); } catch { return json({ error: "That wasn't valid data." }, 400); }
  const data = body.data, base = body.baseRevision;
  if (!data || typeof data !== "object" || Array.isArray(data) || typeof base !== "number" || !Number.isInteger(base) || base < 0) {
    return json({ error: "Send { data, baseRevision }." }, 400);
  }

  const db = await getDb();
  const [row] = await db.select().from(schema.appState).where(eq(schema.appState.userId, user.id));
  const current = row?.revision ?? 0;
  if (base !== current) return json({ error: "conflict", data: row?.data ?? null, revision: current, updatedAt: row?.updatedAt ?? null }, 409);

  const now = new Date(), revision = current + 1;
  if (row) {
    // Only update if nobody saved in between (the revision is still the one we read).
    const updated = await db.update(schema.appState).set({ data, revision, updatedAt: now })
      .where(and(eq(schema.appState.userId, user.id), eq(schema.appState.revision, current))).returning({ revision: schema.appState.revision });
    if (!updated.length) return json({ error: "conflict", data: null, revision: current, updatedAt: null }, 409);
  } else {
    const inserted = await db.insert(schema.appState).values({ userId: user.id, data, revision, updatedAt: now })
      .onConflictDoNothing().returning({ revision: schema.appState.revision });
    if (!inserted.length) return json({ error: "conflict", data: null, revision: current, updatedAt: null }, 409);
  }
  return json({ revision, updatedAt: now });
}
