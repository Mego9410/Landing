import { checkCode } from "@/lib/codes";
import { tooMany } from "@/lib/events";

// Discount codes from the app's paywall (see lib/codes.ts).
//   POST { installId, code, appUserId?, hadPlan? } → 200 { kind, code, label, offering? } | 400/404/410 { error } with a sentence the app shows as
//   it is. Limited per IP and per install, so codes can't be guessed by trying many.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body: unknown, status: number) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (tooMany(`code-ip:${ip}`, 10)) return json({ error: "Too many tries. Wait a minute and try again." }, 429);
  const body = await request.json().catch(() => null);
  const install = typeof body?.installId === "string" ? body.installId.toLowerCase() : "";
  if (install && tooMany(`code-install:${install}`, 10)) return json({ error: "Too many tries. Wait a minute and try again." }, 429);
  const res = await checkCode(body);
  return res.ok ? json(res.applied, 200) : json({ error: res.error }, res.status);
}
