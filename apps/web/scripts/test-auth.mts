// Email-code sign-in, end to end, with an embedded database: run with `pnpm --filter @landing/web test:auth`.
// Resend is faked, so each code is read from the email that would be sent: this proves the code in the email is the
// one sign-in accepts. Covers a normal address, the admin address (and the dashboard's admin check), an address with
// capitals and spaces, the App Review fixed code, a wrong code and an expired code.
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

process.env.PGLITE_DIR = path.join(mkdtempSync(path.join(tmpdir(), "steadie-auth-")), "db");
delete process.env.DATABASE_URL;
process.env.RESEND_API_KEY = "test-key";
process.env.ADMIN_EMAILS = " Owner@Example.com ";
process.env.REVIEW_EMAIL = "review@example.com";
process.env.REVIEW_CODE = "246810";

const sent: { to: string; subject: string; text: string; html: string }[] = [];
const realFetch = globalThis.fetch;
globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
  if (String(url).startsWith("https://api.resend.com/emails")) { sent.push(JSON.parse(String(init?.body))); return new Response('{"id":"x"}', { status: 200 }); }
  return realFetch(url as string, init);
}) as typeof fetch;

const { getAuth } = await import("../lib/auth.ts");
const { adminFrom } = await import("../lib/admin.ts");
const { getDb } = await import("../lib/db/index.ts");
const { sql } = await import("drizzle-orm");
const auth = await getAuth();
let failures = 0;
const check = (ok: boolean, label: string) => { console.log(ok ? "PASS" : "FAIL", label); if (!ok) failures++; };
const errorCode = async (p: Promise<unknown>) => p.then(() => "OK", (e: { body?: { code?: string } }) => e.body?.code ?? "ERROR");

/** Sends a code, reads it out of the email, and signs in with it exactly as typed. */
async function signIn(typed: string) {
  const before = sent.length;
  await auth.api.sendVerificationOTP({ body: { email: typed, type: "sign-in" } });
  const mail = sent[before];
  const code = mail?.text.match(/\b(\d{6})\b/)?.[1] ?? "";
  const sameEverywhere = !!code && mail.subject.includes(code) && mail.html.includes(code);
  const res = await auth.api.signInEmailOTP({ body: { email: typed, otp: code }, returnHeaders: true });
  return { mail, code, sameEverywhere, res };
}

for (const typed of ["normal@example.com", "  Mixed.Case@Example.COM  "]) {
  const { mail, sameEverywhere, res } = await signIn(typed.trim() === typed ? typed : typed);
  check(!!mail && mail.to === typed.trim().toLowerCase(), `${JSON.stringify(typed)}: code emailed to the lowercased address`);
  check(sameEverywhere, `${JSON.stringify(typed)}: the same code in the subject, text and HTML`);
  check(!!res.response.token, `${JSON.stringify(typed)}: the emailed code signs in first time`);
}

// The admin address: signs in, and the dashboard's check accepts its session cookie.
const admin = await signIn("owner@example.com");
check(!!admin.res.response.token, "admin address: the emailed code signs in");
const cookie = admin.res.headers.get("set-cookie")?.split(";")[0] ?? "";
check(!!(await adminFrom(new Headers({ cookie }))), "admin address: the dashboard accepts its session");
const other = await signIn("normal@example.com");
check(!(await adminFrom(new Headers({ cookie: other.res.headers.get("set-cookie")?.split(";")[0] ?? "" }))), "other address: the dashboard refuses it");

// App Review: the fixed code works, and no email is sent.
const before = sent.length;
await auth.api.sendVerificationOTP({ body: { email: "review@example.com", type: "sign-in" } });
check(sent.length === before, "review address: no email sent");
check((await errorCode(auth.api.signInEmailOTP({ body: { email: "review@example.com", otp: "246810" } }))) === "OK", "review address: the fixed code signs in");

// A wrong code, then an expired one.
await auth.api.sendVerificationOTP({ body: { email: "normal@example.com", type: "sign-in" } });
check((await errorCode(auth.api.signInEmailOTP({ body: { email: "normal@example.com", otp: "000000" } }))) === "INVALID_OTP", "wrong code: INVALID_OTP");
await auth.api.sendVerificationOTP({ body: { email: "normal@example.com", type: "sign-in" } });
await (await getDb()).execute(sql`update verification set expires_at = now() - interval '1 minute' where identifier like '%normal@example.com'`);
const expiredCode = sent.at(-1)!.text.match(/\b(\d{6})\b/)![1];
check((await errorCode(auth.api.signInEmailOTP({ body: { email: "normal@example.com", otp: expiredCode } }))) === "OTP_EXPIRED", "expired code: OTP_EXPIRED");

console.log(failures ? `${failures} failed` : "All passed");
process.exit(failures ? 1 : 0);
