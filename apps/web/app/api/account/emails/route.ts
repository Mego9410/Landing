import { userFrom } from "@/lib/auth";
import { setWantsGuides, wantsGuides } from "@/lib/newsletter";

// Guide emails for the signed-in person: GET says whether they're on, PUT { on: boolean } turns them on or off. The
// choice lives in Resend (lib/newsletter.ts), which also handles the unsubscribe link in every email.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ready = () => !!process.env.RESEND_API_KEY;

export async function GET(request: Request) {
  const user = await userFrom(request);
  if (!user) return Response.json({ error: "Sign in first." }, { status: 401 });
  if (!ready()) return Response.json({ on: false, available: false });
  try {
    return Response.json({ on: await wantsGuides(user.email), available: true });
  } catch (e) {
    console.error("guide emails: couldn't read preference", e);
    return Response.json({ error: "Couldn't check your email settings. Try again later." }, { status: 502 });
  }
}

export async function PUT(request: Request) {
  const user = await userFrom(request);
  if (!user) return Response.json({ error: "Sign in first." }, { status: 401 });
  if (!ready()) return Response.json({ error: "Guide emails aren't available yet." }, { status: 503 });
  const body = await request.json().catch(() => null) as { on?: unknown } | null;
  if (typeof body?.on !== "boolean") return Response.json({ error: "Send { on: true } or { on: false }." }, { status: 400 });
  try {
    await setWantsGuides(user.email, body.on);
    return Response.json({ on: body.on, available: true });
  } catch (e) {
    console.error("guide emails: couldn't save preference", e);
    return Response.json({ error: "Couldn't save your email settings. Try again later." }, { status: 502 });
  }
}
