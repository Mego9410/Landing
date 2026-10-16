// Discount codes. A code doesn't unlock anything by itself: Apple and Google only allow subscriptions to be sold
// through their own billing, so each code names a RevenueCat offering whose packages are discounted store products
// (made in App Store Connect and the Play Console, see docs/payments.md). The app checks the code here, then shows that
// offering's prices on the paywall, and the purchase goes through the store as usual.
//
// Free access (100% off, for testers, friends and family) is given from /admin to a Steadie ID, through RevenueCat's
// API: never by a code alone. A "free" kind of code files a request with the Steadie ID, and an admin approves it.
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
/** A Steadie ID as the app shares it: RevenueCat's anonymous ID ($RCAnonymousID:…) or any ID it was given. */
const APP_USER_ID = /^[A-Za-z0-9$:._-]{6,100}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const when = (v: unknown) => { const s = text(v, 40); if (!s) return null; const d = new Date(s); return Number.isNaN(d.getTime()) ? undefined : d.toISOString(); };

export const DURATIONS = { month: "1 month", three_months: "3 months", six_months: "6 months", year: "1 year", lifetime: "For good" } as const;
export type Duration = keyof typeof DURATIONS;

/** What the app gets back: discounted prices to show, or a free-access request sent for an admin to approve. */
export type AppliedCode = { kind: "offering"; code: string; label: string; offering: string } | { kind: "free"; code: string; label: string };
export type CheckResult = { ok: true; applied: AppliedCode } | { ok: false; status: number; error: string };

/** Checks a code for one install: { installId, code, appUserId?, hadPlan? }. A good code counts the install against the
 *  code's limit (once per install). A free-access code needs the Steadie ID (`appUserId`) and files a request; nothing
 *  is unlocked until an admin approves it. A new-members code refuses anyone who has had the plan (`hadPlan`); the
 *  store's own offer rules check it again at purchase. */
export async function checkCode(body: unknown, now = new Date()): Promise<CheckResult> {
  const b = body as { code?: unknown; installId?: unknown; appUserId?: unknown; hadPlan?: unknown } | null;
  if (!b || typeof b.installId !== "string" || !UUID.test(b.installId)) return { ok: false, status: 400, error: "Send { installId, code }." };
  const code = normaliseCode(b.code), install = b.installId.toLowerCase();
  const nope = { ok: false as const, status: 404, error: "That code isn’t one we recognise. Check it and try again." };
  if (!code) return nope;
  await ensureExtraTables();
  const [c] = await q(sql`select code, label, offering, kind, new_only, active, starts_at, ends_at, max_uses, uses from discount_codes where code = ${code}`);
  if (!c || !c.active) return nope;
  if (c.starts_at && new Date(String(c.starts_at)) > now) return { ok: false, status: 410, error: "That code isn’t open yet." };
  if (c.ends_at && new Date(String(c.ends_at)) <= now) return { ok: false, status: 410, error: "That code has ended." };
  if (c.new_only && b.hadPlan === true) return { ok: false, status: 403, error: "That code is for people new to Steadie." };
  const free = c.kind === "free";
  const appUserId = typeof b.appUserId === "string" ? b.appUserId.trim() : "";
  if (free && !APP_USER_ID.test(appUserId)) return { ok: false, status: 400, error: "That code can’t be used on this phone. Update Steadie and try again." };
  const applied: AppliedCode = free ? { kind: "free", code, label: String(c.label) } : { kind: "offering", code, label: String(c.label), offering: String(c.offering) };
  const [seen] = await q(sql`select 1 as x from discount_code_uses where code = ${code} and install_id = ${install}`);
  if (!seen) {
    // Counted in one statement, so two people can't both take the last place.
    const taken = await q(sql`update discount_codes set uses = uses + 1, updated_at = now() where code = ${code} and (max_uses is null or uses < max_uses) returning uses`);
    if (!taken.length) return { ok: false, status: 410, error: "That code has been fully used." };
    await q(sql`insert into discount_code_uses (code, install_id) values (${code}, ${install}) on conflict do nothing`);
  }
  if (free) await q(sql`insert into free_access_requests (code, install_id, app_user_id) values (${code}, ${install}, ${appUserId}) on conflict (code, app_user_id) do nothing`);
  return { ok: true, applied };
}

export interface DiscountCode { code: string; kind: "offering" | "free"; label: string; offering: string; free_duration: Duration | null; new_only: boolean; active: boolean; starts_at: string | null; ends_at: string | null; max_uses: number | null; uses: number; note: string | null; created_at: string }

export async function listCodes(): Promise<DiscountCode[]> {
  await ensureExtraTables();
  return (await q(sql`select code, kind, label, offering, free_duration, new_only, active, starts_at, ends_at, max_uses, uses, note, created_at from discount_codes order by created_at desc limit 500`)).map((r) => ({
    code: String(r.code), kind: r.kind === "free" ? "free" : "offering", label: String(r.label), offering: String(r.offering ?? ""),
    free_duration: r.free_duration ? (String(r.free_duration) as Duration) : null, new_only: !!r.new_only, active: !!r.active,
    starts_at: r.starts_at ? new Date(String(r.starts_at)).toISOString() : null, ends_at: r.ends_at ? new Date(String(r.ends_at)).toISOString() : null,
    max_uses: r.max_uses == null ? null : Number(r.max_uses), uses: Number(r.uses ?? 0), note: r.note == null ? null : String(r.note), created_at: new Date(String(r.created_at)).toISOString(),
  }));
}

/** Adds a code or changes one: { code, code_kind, label, offering (discounted prices) or free_duration (free access),
 *  new_only?, starts_at?, ends_at?, max_uses?, note? }. Uses so far are kept. */
export async function saveCode(body: Record<string, unknown>): Promise<{ error?: string }> {
  const code = normaliseCode(body.code);
  if (!code) return { error: "Codes are 3 to 24 letters, numbers or dashes, like FOUNDING or CLINIC-ONE." };
  const kind = body.code_kind === "free" ? "free" : "offering";
  const label = text(body.label, 80);
  if (!label) return { error: kind === "free" ? "Add the line people see when they use it, like “Free access from the Steadie team”." : "Add the line people see when the code is applied, like “Founding member price”." };
  const offering = kind === "offering" ? text(body.offering, 64) : "";
  if (kind === "offering" && !OFFERING.test(offering)) return { error: "Add the RevenueCat offering identifier this code shows, like founding." };
  const duration = kind === "free" ? String(body.free_duration ?? "") : null;
  if (kind === "free" && !(duration! in DURATIONS)) return { error: "Choose how long the free access lasts." };
  const starts = when(body.starts_at), ends = when(body.ends_at);
  if (starts === undefined || ends === undefined) return { error: "Check the start and end dates." };
  if (starts && ends && ends <= starts) return { error: "The end date needs to be after the start." };
  const rawMax = body.max_uses === "" || body.max_uses == null ? null : Number(body.max_uses);
  if (rawMax !== null && (!Number.isInteger(rawMax) || rawMax < 1 || rawMax > 1_000_000)) return { error: "The limit is a whole number of people, or leave it blank for no limit." };
  const note = text(body.note, 300) || null, newOnly = body.new_only === true;
  await ensureExtraTables();
  await q(sql`insert into discount_codes (code, kind, label, offering, free_duration, new_only, starts_at, ends_at, max_uses, note)
    values (${code}, ${kind}, ${label}, ${offering}, ${duration}, ${newOnly}, ${starts}, ${ends}, ${rawMax}, ${note})
    on conflict (code) do update set kind = excluded.kind, label = excluded.label, offering = excluded.offering, free_duration = excluded.free_duration,
      new_only = excluded.new_only, starts_at = excluded.starts_at, ends_at = excluded.ends_at, max_uses = excluded.max_uses, note = excluded.note, updated_at = now()`);
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

const ENTITLEMENT = "plan";

/** When free access for this long would end, or null for good. */
export function accessEnds(d: Duration, from = new Date()): Date | null {
  if (d === "lifetime") return null;
  const end = new Date(from), months = { month: 1, three_months: 3, six_months: 6, year: 12 }[d];
  end.setUTCMonth(end.getUTCMonth() + months);
  return end;
}


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

/* ---------- free-access requests (codes of the "free" kind) ---------- */

export interface AccessRequest { id: number; code: string; app_user_id: string; status: "pending" | "approved" | "declined"; created_at: string; decided_at: string | null; free_duration: Duration | null }
export async function listRequests(): Promise<AccessRequest[]> {
  await ensureExtraTables();
  return (await q(sql`select r.id, r.code, r.app_user_id, r.status, r.created_at, r.decided_at, c.free_duration from free_access_requests r join discount_codes c on c.code = r.code
    order by (r.status = 'pending') desc, r.id desc limit 200`)).map((r) => ({
    id: Number(r.id), code: String(r.code), app_user_id: String(r.app_user_id), status: String(r.status) as AccessRequest["status"],
    created_at: new Date(String(r.created_at)).toISOString(), decided_at: r.decided_at ? new Date(String(r.decided_at)).toISOString() : null,
    free_duration: r.free_duration ? (String(r.free_duration) as Duration) : null,
  }));
}

/** Approves a request (grants free access for the code's duration) or declines it: { id, approve }. */
export async function decideRequest(body: Record<string, unknown>, by: string, fetcher: typeof fetch = fetch): Promise<{ error?: string }> {
  const id = Number(body.id);
  if (!Number.isInteger(id) || id < 1) return { error: "That request wasn't found." };
  await ensureExtraTables();
  const [r] = await q(sql`select r.app_user_id, r.code, r.status, c.free_duration from free_access_requests r join discount_codes c on c.code = r.code where r.id = ${id}`);
  if (!r) return { error: "That request wasn't found." };
  if (r.status !== "pending") return { error: "That request has already been answered." };
  if (body.approve === true) {
    const g = await grantFreeAccess({ appUserId: r.app_user_id, duration: r.free_duration ?? "lifetime", note: `Code ${r.code}` }, by, fetcher);
    if (g.error) return { error: g.error };
  }
  await q(sql`update free_access_requests set status = ${body.approve === true ? "approved" : "declined"}, decided_at = now(), decided_by = ${by} where id = ${id}`);
  return {};
}
