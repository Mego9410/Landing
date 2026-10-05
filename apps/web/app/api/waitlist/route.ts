import { NextResponse } from "next/server";

// Waitlist sign-ups. This is a stub: it validates the request and logs a masked address, and stores nothing.
// To go live, replace saveSignup() with a real provider (a Supabase table, a Resend audience or similar),
// keeping the address server-side. Never log full email addresses.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Signup = { email: string; status?: string; consent: boolean };

async function saveSignup(signup: Signup) {
  const [name, domain] = signup.email.split("@");
  console.info("waitlist signup (stub, not stored)", { email: `${name.slice(0, 1)}***@${domain}`, status: signup.status ?? null });
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
    return NextResponse.json({ error: "Tick the box so we can email you about Landing." }, { status: 422 });
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
