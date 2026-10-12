import { forwardAndRecord, verifyWebhook } from "@/lib/inbound";

// Resend's webhook for mail received at getsteadieapp.com (lib/inbound.ts does the work, docs/inbound-email.md has
// the setup). Answers 200 once the email is forwarded, 401 if the signature is wrong, and 500 if forwarding failed,
// so Resend retries (an alert email goes out on the first failure).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Event = { type?: string; created_at?: string; data?: { email_id?: string; from?: string; subject?: string; created_at?: string } };

export async function POST(request: Request) {
  const secret = process.env.RESEND_INBOUND_SECRET?.trim();
  const body = await request.text();
  if (!secret) {
    console.error("inbound: RESEND_INBOUND_SECRET isn't set, so the webhook can't be checked (the hourly check still forwards mail)");
    return Response.json({ error: "Not configured." }, { status: 503 });
  }
  if (!verifyWebhook(body, request.headers, secret)) return Response.json({ error: "Bad signature." }, { status: 401 });

  let event: Event;
  try { event = JSON.parse(body) as Event; } catch { return Response.json({ error: "Not JSON." }, { status: 400 }); }
  if (event.type !== "email.received") return Response.json({ ignored: event.type ?? "unknown" });
  const id = event.data?.email_id;
  if (!id) return Response.json({ error: "No email_id." }, { status: 400 });

  try {
    const result = await forwardAndRecord(id, { from: event.data?.from, subject: event.data?.subject, receivedAt: event.data?.created_at ?? event.created_at });
    return Response.json(result);
  } catch (e) {
    console.error(`inbound: couldn't forward ${id}`, e);
    return Response.json({ error: "Forward failed; will retry." }, { status: 500 });
  }
}
