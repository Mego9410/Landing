import { userFrom } from "@/lib/auth";
import { setWantsRecap, wantsRecap } from "@/lib/recap";

// The weekly recap email for the signed-in person: GET { on, available }, PUT { on: boolean }. Off unless turned on.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const available = () => !!process.env.RESEND_API_KEY || !process.env.VERCEL;

export async function GET(request: Request) {
  const user = await userFrom(request);
  if (!user) return Response.json({ error: "Sign in first." }, { status: 401 });
  try { return Response.json({ on: await wantsRecap(user.id), available: available() }); }
  catch (e) { console.error("recap: couldn't read preference", e); return Response.json({ error: "Couldn't check your email settings. Try again later." }, { status: 502 }); }
}

export async function PUT(request: Request) {
  const user = await userFrom(request);
  if (!user) return Response.json({ error: "Sign in first." }, { status: 401 });
  const body = await request.json().catch(() => null) as { on?: unknown } | null;
  if (typeof body?.on !== "boolean") return Response.json({ error: "Send { on: true } or { on: false }." }, { status: 400 });
  try { await setWantsRecap(user.id, body.on); return Response.json({ on: body.on, available: available() }); }
  catch (e) { console.error("recap: couldn't save preference", e); return Response.json({ error: "Couldn't save your email settings. Try again later." }, { status: 502 }); }
}
