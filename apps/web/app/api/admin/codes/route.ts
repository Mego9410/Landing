import { adminFrom } from "@/lib/admin";
import { decideRequest, grantFreeAccess, saveCode, setCodeActive } from "@/lib/codes";

// Discount codes and free access on /admin. Admins only (ADMIN_EMAILS, signed in).
//   POST { kind: "save", code, code_kind?, label, offering | free_duration, new_only?, ... }   adds or changes a code
//   POST { kind: "active", code, active }                                                  turns a code on or off
//   POST { kind: "grant", appUserId, duration, note? }                                     free access in RevenueCat
//   POST { kind: "request", id, approve }                                                  answers a free-access code request
// → 204 (or 200 { ends } for a grant), or { error } with a sentence the form shows as it is.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body: unknown, status: number) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const admin = await adminFrom(request.headers);
  if (!admin) return json({ error: "Sign in as an admin first." }, 401);
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== "object") return json({ error: "Nothing was sent." }, 400);
  if (body.kind === "save") { const r = await saveCode(body); return r.error ? json(r, 400) : new Response(null, { status: 204 }); }
  if (body.kind === "active") { const r = await setCodeActive(body); return r.error ? json(r, 400) : new Response(null, { status: 204 }); }
  if (body.kind === "grant") {
    const r = await grantFreeAccess(body, admin.email).catch((e: Error) => ({ error: `Couldn't reach RevenueCat: ${e.message}` }));
    return r.error ? json({ error: r.error }, 400) : json({ ends: (r as { ends?: string | null }).ends ?? null }, 200);
  }
  if (body.kind === "request") {
    const r = await decideRequest(body, admin.email).catch((e: Error) => ({ error: `Couldn't reach RevenueCat: ${e.message}` }));
    return r.error ? json(r, 400) : new Response(null, { status: 204 });
  }
  return json({ error: "Unknown request." }, 400);
}
