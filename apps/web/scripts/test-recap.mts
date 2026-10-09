// The weekly recap, against an embedded database: `pnpm --filter @landing/web test:recap`.
// Only to people who turned it on; built from their backup; no weight in safe mode; never twice a week; unsubscribe works.
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

process.env.PGLITE_DIR = path.join(mkdtempSync(path.join(tmpdir(), "steadie-recap-")), "db");
delete process.env.DATABASE_URL; delete process.env.RESEND_API_KEY;
const codes: Record<string, string> = {};
const info = console.info; console.info = (...a: unknown[]) => { const m = String(a[0]).match(/code for (\S+): (\d{6})/); if (m) codes[m[1]] = m[2]; else info(...a); };

const { getAuth } = await import("../lib/auth.ts");
const sync = await import("../app/api/sync/route.ts");
const prefs = await import("../app/api/account/recap/route.ts");
const unsub = await import("../app/api/recap/unsubscribe/route.ts");
const { sendRecaps, unsubscribeUrl } = await import("../lib/recap.ts");
const auth = await getAuth();
let failures = 0;
const check = (ok: boolean, label: string) => { console.log(ok ? "PASS" : "FAIL", label); if (!ok) failures++; };

async function person(email: string, safeMode: boolean) {
  await auth.api.sendVerificationOTP({ body: { email, type: "sign-in" } });
  const { token, user } = await auth.api.signInEmailOTP({ body: { email, otp: codes[email] } });
  const days = ["2026-10-05", "2026-10-06", "2026-10-07", "2026-10-08", "2026-10-09"];
  const data = {
    name: "Sam", consent: { healthDataAt: "2026-10-01T10:00:00Z", version: "health-v1" },
    settings: { safeMode, units: "kg" }, ob: { lastInjection: "2026-08-20" },
    journal: { entries: Object.fromEntries(days.map((d) => [d, { yes: {} }])) },
    days: { "2026-10-06": { sessions: ["A"] }, "2026-10-09": { sessions: ["B"] } },
    weights: ["2026-09-29", "2026-09-30", "2026-10-01", "2026-10-06", "2026-10-07", "2026-10-08"].map((date, i) => ({ date, kg: i < 3 ? 80 : 79.5 })),
    derived: { scores: { "2026-10-05": 68, "2026-09-28": 60 } },
  };
  const put = await sync.PUT(new Request("http://x/api/sync", { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ data, baseRevision: 0 }) }));
  if (put.status !== 200) throw new Error(`backup ${put.status}`);
  return { token, id: user.id };
}
const a = await person("recap-a@example.com", false), b = await person("recap-b@example.com", true);
await person("recap-c@example.com", false); // never opts in
const optIn = (t: string, on: boolean) => prefs.PUT(new Request("http://x/api/account/recap", { method: "PUT", headers: { Authorization: `Bearer ${t}` }, body: JSON.stringify({ on }) }));
check((await (await prefs.GET(new Request("http://x", { headers: { Authorization: `Bearer ${a.token}` } }))).json()).on === false, "off by default");
await optIn(a.token, true); await optIn(b.token, true); // c never opts in

const got: { to: string; subject: string; html: string; text: string }[] = [];
const fake = async (batch: { to: string; email: { subject: string; html: string; text: string } }[]) => { for (const x of batch) got.push({ to: x.to, ...x.email }); };
const sunday = "2026-10-11";
const r1 = await sendRecaps(sunday, true, fake);
check(r1.sent === 2 && got.every((g) => g.to !== "recap-c@example.com"), "only people who turned it on");
const ga = got.find((g) => g.to === "recap-a@example.com")!, gb = got.find((g) => g.to === "recap-b@example.com")!;
check(/checked in on 5 days/.test(ga.text) && /2 strength sessions/.test(ga.text), "check-ins and sessions counted");
check(/steady score: 68, up from 60/.test(ga.text), "score against last week");
check(/79\.5 kg, 0\.5 kg lower/.test(ga.text), "weight average shown when safe mode is off");
check(!/\d\s*(kg|lb|st)\b/.test(gb.text) && !/\d\s*(kg|lb|st)\b/.test(gb.html) && !/average/.test(gb.text), "no weight numbers in safe mode");
check(/One thing to try:/.test(ga.text) && /week 8/.test(ga.subject) && !/\d\s*kg/.test(ga.subject), "next week's tip; no weight in the subject");
check(/RESEND_UNSUBSCRIBE_URL/.test(ga.html) === false && ga.html.includes("/api/recap/unsubscribe?u="), "own unsubscribe link");
const r2 = await sendRecaps(sunday, true, fake);
check(r2.due === 0 && got.length === 2, "never twice in a week");
const res = await unsub.GET(new Request(unsubscribeUrl(a.id)));
check(res.status === 200, "unsubscribe link works");
check((await (await prefs.GET(new Request("http://x", { headers: { Authorization: `Bearer ${a.token}` } }))).json()).on === false, "unsubscribed: off");
check((await unsub.GET(new Request(unsubscribeUrl(a.id).replace(/t=[^&]+/, "t=forged")))).status === 400, "forged link refused");
check((await sendRecaps("2026-10-18", false)).due === 1, "next week: only the one still opted in");
console.log(failures ? `${failures} failed` : "All passed");
process.exit(failures ? 1 : 0);
