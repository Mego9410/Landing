// Funnel events, against an embedded database: `pnpm --filter @landing/web test:events`.
// Known names are kept, unknown ones and unsafe props dropped; signed in, the account is attached; limits apply;
// deleting the account unlinks its events; the admin funnel counts them.
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

process.env.PGLITE_DIR = path.join(mkdtempSync(path.join(tmpdir(), "steadie-events-")), "db");
delete process.env.DATABASE_URL; delete process.env.RESEND_API_KEY;
const codes: Record<string, string> = {};
const info = console.info; console.info = (...a: unknown[]) => { const m = String(a[0]).match(/code for (\S+): (\d{6})/); if (m) codes[m[1]] = m[2]; else info(...a); };

const { getAuth } = await import("../lib/auth.ts");
const events = await import("../app/api/events/route.ts");
const account = await import("../app/api/account/route.ts");
const { loadFunnel } = await import("../lib/admin.ts");
const { getDb } = await import("../lib/db/index.ts");
const { sql } = await import("drizzle-orm");
const auth = await getAuth();
await auth.api.sendVerificationOTP({ body: { email: "events@example.com", type: "sign-in" } });
const { token } = await auth.api.signInEmailOTP({ body: { email: "events@example.com", otp: codes["events@example.com"] } });
const rows = async (q: ReturnType<typeof sql>) => ((await (await getDb()).execute(q)) as unknown as { rows: Record<string, unknown>[] }).rows;
let failures = 0;
const check = (ok: boolean, label: string) => { console.log(ok ? "PASS" : "FAIL", label); if (!ok) failures++; };
let ipN = 0;
const post = (body: unknown, auth?: string, ip = `10.0.0.${++ipN}`) => events.POST(new Request("http://localhost/api/events", {
  method: "POST", headers: { "Content-Type": "application/json", "x-forwarded-for": ip, ...(auth ? { Authorization: `Bearer ${auth}` } : {}) }, body: JSON.stringify(body) }));

const A = "11111111-1111-4111-8111-111111111111", B = "22222222-2222-4222-8222-222222222222";
check((await post({ installId: "nope", events: [{ name: "app_first_open" }] })).status === 400, "bad install ID refused");
check((await post({ installId: A, events: Array.from({ length: 26 }, () => ({ name: "app_first_open" })) })).status === 400, "too big a batch refused");
check((await post({ installId: A, events: [
  { name: "app_first_open" }, { name: "onboarding_completed" }, { name: "made_up" },
  { name: "paywall_viewed", props: { source: "onboarding", weight_kg: 80, note: "free text here", plan: "has spaces in it" } },
] })).status === 204, "anonymous batch accepted");
const a = await rows(sql`select name, user_id, props from events where install_id = ${A} order by id`);
check(a.length === 3 && a.every((r) => r.user_id == null), "unknown name dropped; no account attached");
check(JSON.stringify(a[2].props) === JSON.stringify({ source: "onboarding" }), "health values and free text stripped from props");
check((await post({ installId: B, events: [{ name: "app_first_open" }, { name: "trial_started" }, { name: "subscription_paid" }] }, token)).status === 204, "signed-in batch accepted");
const b = await rows(sql`select distinct user_id from events where install_id = ${B}`);
check(b.length === 1 && typeof b[0].user_id === "string", "signed in: account attached");
const funnel = await loadFunnel();
check(funnel.ok && funnel.data.windows[0].steps[0].n === 2 && funnel.data.windows[0].steps[4].n === 1 && funnel.data.windows[0].steps[4].ofFirst === 50, "admin funnel counts installs per step");
let limited = false;
for (let i = 0; i < 40 && !limited; i++) limited = (await post({ installId: A, events: [{ name: "check_in_completed" }] }, undefined, "10.9.9.9")).status === 429;
check(limited, "rate limited per IP");
check((await account.DELETE(new Request("http://localhost/api/account", { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }))).status === 204, "account deleted");
check((await rows(sql`select 1 from events where user_id is not null`)).length === 0, "account deleted: events unlinked");
console.log(failures ? `${failures} failed` : "All passed");
process.exit(failures ? 1 : 0);
