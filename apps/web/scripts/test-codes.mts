// Discount codes and free access, against an embedded database: `pnpm --filter @landing/web test:codes`.
// Codes are tidied and checked (unknown, off, not open, ended, full); one install counts once against a limit; the
// public route limits tries; free access calls RevenueCat with the plan entitlement and is noted.
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

process.env.PGLITE_DIR = path.join(mkdtempSync(path.join(tmpdir(), "steadie-codes-")), "db");
delete process.env.DATABASE_URL;
const { checkCode, saveCode, setCodeActive, listCodes, grantFreeAccess, listGrants, normaliseCode, accessEnds } = await import("../lib/codes.ts");
const route = await import("../app/api/codes/route.ts");
let failures = 0;
const check = (ok: boolean, label: string) => { console.log(ok ? "PASS" : "FAIL", label); if (!ok) failures++; };
const A = "11111111-1111-4111-8111-111111111111", B = "22222222-2222-4222-8222-222222222222", C = "33333333-3333-4333-8333-333333333333";

check(normaliseCode(" founding ") === "FOUNDING" && normaliseCode("ab") === null && normaliseCode("x y z!") === null, "codes tidied, and junk refused");
check(!!(await saveCode({ code: "ok", label: "x", offering: "founding" })).error, "too-short code refused");
check(!!(await saveCode({ code: "FOUNDING", label: "", offering: "founding" })).error, "label required");
check(!!(await saveCode({ code: "FOUNDING", label: "Founding price", offering: "bad offering!" })).error, "bad offering refused");
check(!!(await saveCode({ code: "FOUNDING", label: "Founding price", offering: "founding", max_uses: "0" })).error, "zero limit refused");
check(!(await saveCode({ code: "founding", label: "Founding member price", offering: "founding", max_uses: "2" })).error, "code saved");
check(!(await saveCode({ code: "LATER", label: "Later", offering: "founding", starts_at: "2099-01-01T00:00:00Z" })).error, "future code saved");
check(!(await saveCode({ code: "OLD", label: "Old", offering: "founding", ends_at: "2020-01-01T00:00:00Z" })).error, "ended code saved");

const r1 = await checkCode({ installId: A, code: "Founding" });
check(r1.ok && r1.applied.offering === "founding" && r1.applied.label === "Founding member price", "good code applies with its offering and label");
check((await checkCode({ installId: A, code: "FOUNDING" })).ok, "same install can apply it again");
check((await listCodes()).find((c) => c.code === "FOUNDING")?.uses === 1, "one install counts once");
check((await checkCode({ installId: B, code: "FOUNDING" })).ok, "second install takes the last place");
const full = await checkCode({ installId: C, code: "FOUNDING" });
check(!full.ok && full.status === 410 && /fully used/.test(full.error), "full code refused");
check((await checkCode({ installId: A, code: "FOUNDING" })).ok, "someone who already applied it still can when it's full");
const unknown = await checkCode({ installId: A, code: "NOPE" });
check(!unknown.ok && unknown.status === 404, "unknown code: not recognised");
const later = await checkCode({ installId: A, code: "LATER" });
check(!later.ok && /isn’t open/.test(later.error), "not open yet");
const old = await checkCode({ installId: A, code: "OLD" });
check(!old.ok && /ended/.test(old.error), "ended");
check(!(await setCodeActive({ code: "LATER", active: false })).error && !(await checkCode({ installId: A, code: "LATER" })).ok, "turned-off code not recognised");
check(!(await checkCode({ installId: "nope", code: "FOUNDING" })).ok, "bad install refused");

const post = (body: unknown, ip: string) => route.POST(new Request("http://localhost/api/codes", { method: "POST", headers: { "Content-Type": "application/json", "x-forwarded-for": ip }, body: JSON.stringify(body) }));
const ok = await post({ installId: A, code: "founding" }, "10.1.0.1");
check(ok.status === 200 && (await ok.json()).offering === "founding", "route returns the offering");
let last = 0;
for (let i = 0; i < 12; i++) last = (await post({ installId: B, code: "GUESS" + i }, "10.1.0.2")).status;
check(last === 429, "guessing is rate limited");

// Free access, with RevenueCat faked.
const calls: { url: string; body?: string }[] = [];
const fake = (async (url: string, init?: RequestInit) => {
  calls.push({ url: String(url), body: init?.body as string | undefined });
  if (String(url).includes("/entitlements")) return new Response(JSON.stringify({ items: [{ id: "entl123", lookup_key: "plan" }] }), { status: 200 });
  if (String(url).includes("missing")) return new Response("{}", { status: 404 });
  return new Response("{}", { status: 201 });
}) as typeof fetch;
delete process.env.REVENUECAT_SECRET_KEY;
check(/REVENUECAT_SECRET_KEY/.test((await grantFreeAccess({ appUserId: "$RCAnonymousID:abc123", duration: "lifetime" }, "me@x.com", fake)).error ?? ""), "free access needs the RevenueCat key");
process.env.REVENUECAT_SECRET_KEY = "sk_test"; process.env.REVENUECAT_PROJECT_ID = "proj1";
check(!!(await grantFreeAccess({ appUserId: "x", duration: "lifetime" }, "me@x.com", fake)).error, "bad ID refused");
check(!!(await grantFreeAccess({ appUserId: "$RCAnonymousID:abc123", duration: "forever" }, "me@x.com", fake)).error, "bad duration refused");
const g = await grantFreeAccess({ appUserId: "My Steadie ID: $RCAnonymousID:abc123", duration: "year", note: "Sam" }, "me@x.com", fake);
const grantCall = calls.find((c) => c.url.includes("grant_entitlement"));
check(!g.error && !!g.ends && grantCall?.url.includes(encodeURIComponent("$RCAnonymousID:abc123")) === true && JSON.parse(grantCall!.body!).entitlement_id === "entl123", "a year's free access granted on the plan entitlement, ID pasted with its label");
check(/RevenueCat doesn't know/.test((await grantFreeAccess({ appUserId: "$RCAnonymousID:missing", duration: "month" }, "me@x.com", fake)).error ?? ""), "unknown ID explained");
const gs = await listGrants();
check(gs.length === 1 && gs[0].note === "Sam" && gs[0].granted_by === "me@x.com", "grant noted for the admin page");
check(accessEnds("lifetime") === null && accessEnds("month", new Date("2026-01-31T00:00:00Z"))!.toISOString().startsWith("2026-03"), "durations");

console.log(failures ? `\n${failures} failed` : "\nAll passed");
process.exit(failures ? 1 : 0);
