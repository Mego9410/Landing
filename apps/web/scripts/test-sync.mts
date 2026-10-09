// Backups and health consent, against an embedded database: `pnpm --filter @landing/web test:sync`.
// No consent → refused; consent → saved and recorded with its version; withdrawn → backup deleted and dated.
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

process.env.PGLITE_DIR = path.join(mkdtempSync(path.join(tmpdir(), "steadie-sync-")), "db");
delete process.env.DATABASE_URL; delete process.env.RESEND_API_KEY;
const codes: Record<string, string> = {};
const info = console.info; console.info = (...a: unknown[]) => { const m = String(a[0]).match(/code for (\S+): (\d{6})/); if (m) codes[m[1]] = m[2]; else info(...a); };

const { getAuth } = await import("../lib/auth.ts");
const sync = await import("../app/api/sync/route.ts");
const { getDb } = await import("../lib/db/index.ts");
const { sql } = await import("drizzle-orm");
const auth = await getAuth();
await auth.api.sendVerificationOTP({ body: { email: "sync@example.com", type: "sign-in" } });
const { token } = await auth.api.signInEmailOTP({ body: { email: "sync@example.com", otp: codes["sync@example.com"] } });
const req = (method: string, body?: unknown) => new Request("http://localhost/api/sync", { method, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });
const rows = async (q: ReturnType<typeof sql>) => ((await (await getDb()).execute(q)) as unknown as { rows: Record<string, unknown>[] }).rows;
let failures = 0;
const check = (ok: boolean, label: string) => { console.log(ok ? "PASS" : "FAIL", label); if (!ok) failures++; };

check((await sync.PUT(req("PUT", { data: { weights: [] }, baseRevision: 0 }))).status === 403, "no consent: backup refused");
check((await sync.PUT(req("PUT", { data: { consent: { healthDataAt: "2026-10-09T10:00:00Z", backupOffAt: "2026-10-09T11:00:00Z" } }, baseRevision: 0 }))).status === 403, "consent withdrawn: backup refused");
check((await sync.PUT(req("PUT", { data: { consent: { healthDataAt: "2026-10-09T10:00:00Z", version: "health-v1" } }, baseRevision: 0 }))).status === 200, "consent: backup saved");
const [c] = await rows(sql`select version, given_at, withdrawn_at from health_consent`);
check(c?.version === "health-v1" && !!c.given_at && !c.withdrawn_at, "consent recorded with version and time");
check((await sync.DELETE(req("DELETE"))).status === 204, "withdraw: 204");
check((await rows(sql`select 1 from app_state`)).length === 0, "withdraw: backup deleted");
check(!!(await rows(sql`select withdrawn_at from health_consent`))[0]?.withdrawn_at, "withdraw: dated");
console.log(failures ? `${failures} failed` : "All passed");
process.exit(failures ? 1 : 0);
