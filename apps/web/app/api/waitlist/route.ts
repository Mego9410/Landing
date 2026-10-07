import { NextResponse } from "next/server";
import { getDb, schema } from "@/lib/db";

// Waitlist sign-ups, saved to the database (Neon in production). Signing up again updates the jab status and keeps
// the original date. Never log full email addresses.
export const runtime = "nodejs";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Signup = { email: string; status?: string; consent: boolean };

async function saveSignup(signup: Signup) {
  const db = await getDb();
  await db.insert(schema.waitlist).values({ email: signup.email, status: signup.status ?? null, consentAt: new Date() })
    .onConflictDoUpdate({ target: schema.waitlist.email, set: { status: signup.status ?? null } });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send the form as JSON." }, { status: 400 });
  }

  // Honeypot: people never see this field, bots tend to fill it. Answer as if it worked.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter an email address like name@example.com." }, { status: 422 });
  }
  if (body.consent !== true) {
    return NextResponse.json({ error: "Tick the box so we can email you about Steadie." }, { status: 422 });
  }

  const status = typeof body.status === "string" && ["stopped", "soon", "on"].includes(body.status) ? body.status : undefined;

  try {
    await saveSignup({ email, status, consent: true });
  } catch (error) {
    console.error("waitlist signup failed", error);
    return NextResponse.json({ error: "We couldn't save that just now. Try again in a minute." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
