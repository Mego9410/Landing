// Discount codes. A code doesn't unlock anything by itself: Apple and Google only allow subscriptions to be sold
// through their own billing, so each code names a RevenueCat offering whose packages are discounted store products
// (made in App Store Connect and the Play Console, see docs/payments.md). The app checks the code here, then shows that
// offering's prices on the paywall, and the purchase goes through the store as usual.
//
// Free access (100% off, for testers, friends and family) is given from /admin to a Steadie ID, through RevenueCat's
// API: never by a code typed into the app.
//
// Env: REVENUECAT_SECRET_KEY + REVENUECAT_PROJECT_ID (a v2 secret key with customer read/write and entitlements read)
// for free access. Codes themselves need only the database.
import { sql } from "drizzle-orm";
import { getDb } from "./db";
import { ensureExtraTables } from "./db/extra";

type Row = Record<string, unknown>;
async function q(query: ReturnType<typeof sql>): Promise<Row[]> {
  const res = (await (await getDb()).execute(query)) as unknown as { rows: Row[] };
  return res.rows;
}

/** A code as people type it, tidied: trimmed, capitals, 3 to 24 letters, digits or dashes. Null if it can't be one. */
export function normaliseCode(v: unknown): string | null {
  const c = typeof v === "string" ? v.trim().toUpperCase().replace(/\s+/g, "") : "";
  return /^[A-Z0-9][A-Z0-9-]{2,23}$/.test(c) ? c : null;
}
/** A RevenueCat offering identifier: letters, digits, dashes and underscores. */
const OFFERING = /^[A-Za-z0-9_-]{1,64}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const when = (v: unknown) => { const s = text(v, 40); if (!s) return null; const d = new Date(s); return Number.isNaN(d.getTime()) ? undefined : d.toISOString(); };

export interface AppliedCode { code: string; label: string; offering: string }
export type CheckResult = { ok: true; applied: AppliedCode } | { ok: false; status: number; error: string };

/** Checks a code for one install and, if it's good, counts the install against the code's limit (once per install). */
export async function checkCode(body: unknown, now = new Date()): Promise<CheckResult> {
  const b = body as { code?: unknown; installId?: unknown } | null;
  if (!b || typeof b.installId !== "string" || !UUID.test(b.installId)) return { ok: false, status: 400, error: "Send { installId, code }." };
  const code = normaliseCode(b.code), install = b.installId.toLowerCase();
  const nope = { ok: false as const, status: 404, error: "That code isn’t one we recognise. Check it and try again." };
  if (!code) return nope;
  await ensureExtraTables();
  const [c] = await q(sql`select code, label, offering, active, starts_at, ends_at, max_uses, uses from discount_codes where code = ${code}`);
  if (!c || !c.active) return nope;
  if (c.starts_at && new Date(String(c.starts_at)) > now) return { ok: false, status: 410, error: "That code isn’t open yet." };
  if (c.ends_at && new Date(String(c.ends_at)) <= now) return { ok: false, status: 410, error: "That code has ended." };
  const applied = { code, label: String(c.label), offering: String(c.offering) };
  const [seen] = await q(sql`select 1 as x from discount_code_uses where code = ${code} and install_id = ${install}`);
  if (seen) return { ok: true, applied };
  // Counted in one statement, so two people can't both take the last place.
  const taken = await q(sql`update discount_codes set uses = uses + 1, updated_at = now() where code = ${code} and (max_uses is null or uses < max_uses) returning uses`);
  if (!taken.length) return { ok: false, status: 410, error: "That code has been fully used." };
  await q(sql`insert into discount_code_uses (code, install_id) values (${code}, ${install}) on conflict do nothing`);
  return { ok: true, applied };
}

export interface DiscountCode { code: string; label: string; offering: string; active: boolean; starts_at: string | null; ends_at: string | null; max_uses: number | null; uses: number; note: string | null; created_at: string }

export async function listCodes(): Promise<DiscountCode[]> {
  await ensureExtraTables();
  return (await q(sql`select code, label, offering, active, starts_at, ends_at, max_uses, uses, note, created_at from discount_codes order by created_at desc limit 500`)).map((r) => ({
    code: String(r.code), label: String(r.label), offering: String(r.offering), active: !!r.active,
    starts_at: r.starts_at ? new Date(String(r.starts_at)).toISOString() : null, ends_at: r.ends_at ? new Date(String(r.ends_at)).toISOString() : null,
    max_uses: r.max_uses == null ? null : Number(r.max_uses), uses: Number(r.uses ?? 0), note: r.note == null ? null : String(r.note), created_at: new Date(String(r.created_at)).toISOString(),
  }));
}

/** Adds a code or changes one: { code, label, offering, starts_at?, ends_at?, max_uses?, note? }. Uses so far are kept. */
export async function saveCode(body: Record<string, unknown>): Promise<{ error?: string }> {
  const code = normaliseCode(body.code);
  if (!code) return { error: "Codes are 3 to 24 letters, numbers or dashes, like FOUNDING or CLINIC-ONE." };
  const label = text(body.label, 80);
  if (!label) return { error: "Add the line people see when the code is applied, like “Founding member price”." };
  const offering = text(body.offering, 64);
  if (!OFFERING.test(offering)) return { error: "Add the RevenueCat offering identifier this code shows, like founding." };
  const starts = when(body.starts_at), ends = when(body.ends_at);
  if (starts === undefined || ends === undefined) return { error: "Check the start and end dates." };
  if (starts && ends && ends <= starts) return { error: "The end date needs to be after the start." };
  const rawMax = body.max_uses === "" || body.max_uses == null ? null : Number(body.max_uses);
  if (rawMax !== null && (!Number.isInteger(rawMax) || rawMax < 1 || rawMax > 1_000_000)) return { error: "The limit is a whole number of people, or leave it blank for no limit." };
  const note = text(body.note, 300) || null;
  await ensureExtraTables();
  await q(sql`insert into discount_codes (code, label, offering, starts_at, ends_at, max_uses, note)
    values (${code}, ${label}, ${offering}, ${starts}, ${ends}, ${rawMax}, ${note})
    on conflict (code) do update set label = excluded.label, offering = excluded.offering, starts_at = excluded.starts_at, ends_at = excluded.ends_at,
      max_uses = excluded.max_uses, note = excluded.note, updated_at = now()`);
  return {};
}

/** Turns a code on or off: { code, active }. Off, the app is told it isn't recognised; people who already applied it
 *  keep the price they see until they leave the paywall. */
export async function setCodeActive(body: Record<string, unknown>): Promise<{ error?: string }> {
  const code = normaliseCode(body.code);
  if (!code) return { error: "That code wasn't found." };
  await ensureExtraTables();
  const done = await q(sql`update discount_codes set active = ${body.active === true}, updated_at = now() where code = ${code} returning code`);
  return done.length ? {} : { error: "That code wasn't found." };
}

/* ---------- free access ---------- */

export const DURATIONS = { month: "1 month", three_months: "3 months", six_months: "6 months", year: "1 year", lifetime: "For good" } as const;
export type Duration = keyof typeof DURATIONS;
const ENTITLEMENT = "plan";

/** When free access for this long would end, or null for good. */
export function accessEnds(d: Duration, from = new Date()): Date | null {
  if (d === "lifetime") return null;
  const end = new Date(from), months = { month: 1, three_months: 3, six_months: 6, year: 12 }[d];
  end.setUTCMonth(end.getUTCMonth() + months);
  return end;
}

/** A Steadie ID as the app shares it: RevenueCat's anonymous ID ($RCAnonymousID:…) or any ID it was given. */
const APP_USER_ID = /^[A-Za-z0-9$:._-]{6,100}$/;

/** Gives free access to the plan: { appUserId, duration, note? }, granted in RevenueCat and noted here. */
export async function grantFreeAccess(body: Record<string, unknown>, by: string, fetcher: typeof fetch = fetch): Promise<{ error?: string; ends?: string | null }> {
  const id = text(body.appUserId, 100).replace(/^My Steadie ID:\s*/i, "");
  if (!APP_USER_ID.test(id)) return { error: "Paste the Steadie ID they sent you. It starts with $RCAnonymousID." };
  const duration = String(body.duration ?? "") as Duration;
  if (!(duration in DURATIONS)) return { error: "Choose how long the free access lasts." };
  const key = process.env.REVENUECAT_SECRET_KEY, project = process.env.REVENUECAT_PROJECT_ID;
  if (!key || !project) return { error: "Add REVENUECAT_SECRET_KEY and REVENUECAT_PROJECT_ID in Vercel to give free access from here." };
  const api = (path: string, init?: RequestInit) => fetcher(`https://api.revenuecat.com/v2/projects/${project}${path}`, { ...init, headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, cache: "no-store" });
  // The entitlement's RevenueCat ID, from its identifier ("plan").
  const list = await api("/entitlements?limit=50");
  if (!list.ok) return { error: `RevenueCat refused the entitlements list (${list.status}). The key needs entitlements read access.` };
  const ent = ((await list.json()) as { items?: { id: string; lookup_key: string }[] }).items?.find((e) => e.lookup_key === ENTITLEMENT);
  if (!ent) return { error: `RevenueCat has no entitlement called “${ENTITLEMENT}”.` };
  const ends = accessEnds(duration);
  // RevenueCat wants an end time; "for good" is set a hundred years out.
  const expires = (ends ?? new Date(Date.now() + 100 * 365.25 * 86400000)).getTime();
  const res = await api(`/customers/${encodeURIComponent(id)}/actions/grant_entitlement`, { method: "POST", body: JSON.stringify({ entitlement_id: ent.id, expires_at: expires }) });
  if (res.status === 404) return { error: "RevenueCat doesn't know that Steadie ID. Check it was copied in full." };
  if (!res.ok) return { error: `RevenueCat refused the grant (${res.status}). The key needs customer read and write access.` };
  await ensureExtraTables();
  await q(sql`insert into free_access_grants (app_user_id, duration, note, granted_by) values (${id}, ${duration}, ${text(body.note, 300) || null}, ${by})`);
  return { ends: ends?.toISOString() ?? null };
}

export interface Grant { id: number; app_user_id: string; duration: Duration; note: string | null; granted_by: string; created_at: string }
export async function listGrants(): Promise<Grant[]> {
  await ensureExtraTables();
  return (await q(sql`select id, app_user_id, duration, note, granted_by, created_at from free_access_grants order by id desc limit 100`)).map((r) => ({
    id: Number(r.id), app_user_id: String(r.app_user_id), duration: String(r.duration) as Duration, note: r.note == null ? null : String(r.note),
    granted_by: String(r.granted_by), created_at: new Date(String(r.created_at)).toISOString(),
  }));
}
