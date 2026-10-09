// The owner's dashboard (app/admin): who may see it, and everything it shows, gathered from the database, Resend,
// RevenueCat, App Store Connect and the guide schedule. Each source loads on its own and reports a plain reason when
// it isn't set up or fails, so one missing key never blanks the page.
//
// Env: ADMIN_EMAILS (comma-separated; who may open /admin). Optional, each turns a section on:
//   REVENUECAT_SECRET_KEY + REVENUECAT_PROJECT_ID   subscribers, trials, MRR, revenue
//   ASC_KEY_ID + ASC_ISSUER_ID + ASC_PRIVATE_KEY + ASC_VENDOR_NUMBER   App Store downloads
import { createSign } from "node:crypto";
import { gunzipSync } from "node:zlib";
import { sql } from "drizzle-orm";
import { ALL_GUIDES, londonToday } from "@/content/guides";
import { getAuth } from "./auth";
import { getDb } from "./db";
import { resend, segmentId } from "./newsletter";

export type Loaded<T> = { ok: true; data: T } | { ok: false; reason: string };
const load = async <T>(fn: () => Promise<T>, what: string): Promise<Loaded<T>> => {
  try { return { ok: true, data: await fn() }; } catch (e) {
    console.error(`admin: ${what}`, e);
    return { ok: false, reason: e instanceof NotSetUp ? e.message : `Couldn't load ${what}: ${(e as Error).message}` };
  }
};
class NotSetUp extends Error {}

/** The signed-in admin from the session cookie, or null. */
export async function adminFrom(headers: Headers) {
  const session = await (await getAuth()).api.getSession({ headers: new Headers(headers) }).catch((e) => { console.error("admin: session", e); return null; });
  const email = session?.user.email.toLowerCase();
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  return email && allowed.includes(email) ? session!.user : null;
}

/** London dates, oldest first, ending today. */
const lastDays = (n: number) => Array.from({ length: n }, (_, i) => londonToday(new Date(Date.now() - (n - 1 - i) * 86400000)));

/* ---------- members (the database) ---------- */
type Row = Record<string, unknown>;
async function rows(q: ReturnType<typeof sql>): Promise<Row[]> {
  const db = await getDb();
  const res = (await db.execute(q)) as unknown as { rows: Row[] };
  return res.rows;
}
const num = (v: unknown) => Number(v ?? 0);

export const loadMembers = () => load(async () => {
  const review = (process.env.REVIEW_EMAIL ?? "").toLowerCase();
  const [totals] = await rows(sql`
    select
      (select count(*) from "user" where lower(email) <> ${review}) as total,
      (select count(*) from "user" where lower(email) <> ${review} and created_at > now() - interval '7 days') as new7,
      (select count(*) from "user" where lower(email) <> ${review} and created_at > now() - interval '30 days') as new30,
      (select count(distinct user_id) from account where provider_id = 'apple') as apple,
      (select count(*) from app_state) as backups,
      (select count(distinct user_id) from session where updated_at > now() - interval '7 days') as active7,
      (select count(distinct user_id) from session where updated_at > now() - interval '30 days') as active30,
      (select count(*) from waitlist) as waitlist`);
  const days = lastDays(30);
  const perDay = await rows(sql`
    select to_char(created_at at time zone 'Europe/London', 'YYYY-MM-DD') as day, count(*) as n
    from "user" where created_at > now() - interval '31 days' and lower(email) <> ${review} group by 1`);
  const byDay = new Map(perDay.map((r) => [String(r.day), num(r.n)]));
  const recent = await rows(sql`
    select u.email, u.created_at, exists(select 1 from account a where a.user_id = u.id and a.provider_id = 'apple') as apple,
      exists(select 1 from app_state s where s.user_id = u.id) as backed_up
    from "user" u where lower(u.email) <> ${review} order by u.created_at desc limit 10`);
  return {
    total: num(totals.total), new7: num(totals.new7), new30: num(totals.new30), apple: num(totals.apple), backups: num(totals.backups),
    active7: num(totals.active7), active30: num(totals.active30), waitlist: num(totals.waitlist),
    signups: days.map((day) => ({ day, n: byDay.get(day) ?? 0 })),
    recent: recent.map((r) => ({ email: String(r.email), at: new Date(String(r.created_at)).toISOString(), apple: !!r.apple, backedUp: !!r.backed_up })),
  };
}, "members");

/* ---------- funnel (our own events table) ---------- */
export const FUNNEL_STEPS = [
  { name: "app_first_open", label: "Opened the app" },
  { name: "onboarding_completed", label: "Finished onboarding" },
  { name: "paywall_viewed", label: "Saw the plans" },
  { name: "trial_started", label: "Started a trial" },
  { name: "subscription_paid", label: "Paid" },
] as const;
export interface FunnelWindow { days: number; steps: { label: string; n: number; ofFirst: number | null; ofPrev: number | null }[] }
export interface Retention { label: string; eligible: number; kept: number; pct: number | null }

/** Installs that reached each step in the last 7 and 30 days (each install counted once per step), and check-in
 *  retention: of installs first opened 7 (or 30) or more days ago, in the last 90 days, how many checked in on or after
 *  that day. "Paid" is a subscription seen by the app as paid (after a trial or bought outright). */
export const loadFunnel = () => load(async () => {
  await (await import("./db/extra")).ensureExtraTables();
  const counts = await rows(sql`
    select name,
      count(distinct install_id) filter (where created_at > now() - interval '7 days') as d7,
      count(distinct install_id) filter (where created_at > now() - interval '30 days') as d30
    from events where created_at > now() - interval '30 days'
      and name in ('app_first_open', 'onboarding_completed', 'paywall_viewed', 'trial_started', 'subscription_paid', 'purchase_completed')
    group by name`);
  const get = (name: string, k: "d7" | "d30") => num(counts.find((r) => r.name === name)?.[k]);
  const pct = (a: number, b: number) => (b ? Math.round((a / b) * 1000) / 10 : null);
  const windows: FunnelWindow[] = (["d7", "d30"] as const).map((k) => {
    const ns = FUNNEL_STEPS.map((st) => get(st.name, k));
    return { days: k === "d7" ? 7 : 30, steps: FUNNEL_STEPS.map((st, i) => ({ label: st.label, n: ns[i], ofFirst: i ? pct(ns[i], ns[0]) : null, ofPrev: i ? pct(ns[i], ns[i - 1]) : null })) };
  });
  const retention: Retention[] = [];
  for (const d of [7, 30]) {
    const [r] = await rows(sql`
      with first as (
        select install_id, min(created_at) as at from events where name = 'app_first_open' group by install_id
        having min(created_at) > now() - interval '90 days' and min(created_at) <= now() - make_interval(days => ${d}))
      select count(*) as eligible,
        count(*) filter (where exists (select 1 from events e where e.install_id = first.install_id and e.name = 'check_in_completed'
          and e.created_at >= first.at + make_interval(days => ${d}))) as kept
      from first`);
    retention.push({ label: `${d}-day`, eligible: num(r?.eligible), kept: num(r?.kept), pct: pct(num(r?.kept), num(r?.eligible)) });
  }
  const [{ total, installs }] = await rows(sql`select count(*) as total, count(distinct install_id) as installs from events where created_at > now() - interval '30 days'`);
  return { windows, retention, total: num(total), installs: num(installs) };
}, "funnel");

/* ---------- why people cancel (lapse_feedback) ---------- */
export const LAPSE_LABELS: Record<string, string> = {
  cost: "Cost", got_what_i_needed: "Got what I needed", not_enough_time: "Not enough time", didnt_suit_me: "Didn't suit me", other: "Other",
};
/** Answers to the cancellation card: all-time and last-30-day counts by reason, and the latest notes. */
export const loadLapses = () => load(async () => {
  await (await import("./db/extra")).ensureExtraTables();
  const counts = await rows(sql`select reason, count(*) as n, count(*) filter (where created_at > now() - interval '30 days') as n30 from lapse_feedback group by reason`);
  const notes = await rows(sql`select reason, note, created_at from lapse_feedback where note is not null order by created_at desc limit 10`);
  return {
    reasons: Object.keys(LAPSE_LABELS).map((k) => { const r = counts.find((c) => c.reason === k); return { key: k, label: LAPSE_LABELS[k], n: num(r?.n), n30: num(r?.n30) }; }),
    total: counts.reduce((a, r) => a + num(r.n), 0),
    notes: notes.map((r) => ({ reason: LAPSE_LABELS[String(r.reason)] ?? String(r.reason), note: String(r.note), at: new Date(String(r.created_at)).toISOString() })),
  };
}, "cancellation answers");

/* ---------- emails (Resend) ---------- */
interface Metrics { delivered?: number; unique_opened?: number; unique_clicked?: number; unsubscribed?: number; bounced?: number; open_rate?: number; click_rate?: number }
export const loadEmails = () => load(async () => {
  if (!process.env.RESEND_API_KEY) throw new NotSetUp("Add RESEND_API_KEY to see email stats.");
  const id = await segmentId();
  let subscribed = 0, unsubscribed = 0, after: string | undefined;
  for (let page = 0; page < 50; page++) {
    const res = await resend<{ data: { id: string; unsubscribed: boolean }[]; has_more: boolean }>(`/segments/${id}/contacts?limit=100${after ? `&after=${after}` : ""}`);
    for (const c of res.data) if (c.unsubscribed) unsubscribed++; else subscribed++;
    if (!res.has_more || !res.data.length) break;
    after = res.data.at(-1)!.id;
  }
  const list = await resend<{ data: { id: string; name: string | null; status: string; sent_at: string | null; created_at: string }[] }>("/broadcasts?limit=12");
  const start = new Date(Date.now() - 60 * 86400000).toISOString().slice(0, 10);
  const metrics = await resend<{ totals: Metrics; data?: (Metrics & { broadcast_id?: string })[] }>(`/emails/metrics?start_date=${start}&dimensions=broadcast`).catch(() => null);
  const byId = new Map((metrics?.data ?? []).map((m) => [m.broadcast_id, m]));
  return {
    subscribed, unsubscribed, totals: metrics?.totals ?? null,
    broadcasts: list.data.map((b) => ({ name: b.name ?? "(no name)", status: b.status, sentAt: b.sent_at, stats: byId.get(b.id) ?? null })),
  };
}, "emails");

/* ---------- subscriptions (RevenueCat) ---------- */
export interface RcMetric { id: string; name: string; description?: string; unit?: string; period?: string; value: number }
export const loadRevenue = () => load(async () => {
  const key = process.env.REVENUECAT_SECRET_KEY, project = process.env.REVENUECAT_PROJECT_ID;
  if (!key || !project) throw new NotSetUp("Add REVENUECAT_SECRET_KEY and REVENUECAT_PROJECT_ID to see subscribers and revenue.");
  const res = await fetch(`https://api.revenuecat.com/v2/projects/${project}/metrics/overview?currency=GBP`, { headers: { Authorization: `Bearer ${key}` }, cache: "no-store" });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`RevenueCat ${res.status} ${body?.message ?? ""}`);
  return (body.metrics ?? []) as RcMetric[];
}, "subscriptions");

/* ---------- downloads (App Store Connect sales reports) ---------- */
function ascToken() {
  const kid = process.env.ASC_KEY_ID, iss = process.env.ASC_ISSUER_ID, pem = process.env.ASC_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!kid || !iss || !pem || !process.env.ASC_VENDOR_NUMBER) throw new NotSetUp("Add the App Store Connect API key (ASC_KEY_ID, ASC_ISSUER_ID, ASC_PRIVATE_KEY, ASC_VENDOR_NUMBER) to see downloads.");
  const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const data = `${b64({ alg: "ES256", kid, typ: "JWT" })}.${b64({ iss, iat: now, exp: now + 900, aud: "appstoreconnect-v1" })}`;
  const sig = createSign("SHA256").update(data).sign({ key: pem, dsaEncoding: "ieee-p1363" }).toString("base64url");
  return `${data}.${sig}`;
}
/** First-time downloads on one day: units of app products (types 1, 1F, 1T), from the daily sales summary. */
async function downloadsOn(day: string, token: string) {
  const q = new URLSearchParams({ "filter[frequency]": "DAILY", "filter[reportDate]": day, "filter[reportSubType]": "SUMMARY", "filter[reportType]": "SALES", "filter[vendorNumber]": process.env.ASC_VENDOR_NUMBER! });
  const res = await fetch(`https://api.appstoreconnect.apple.com/v1/salesReports?${q}`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/a-gzip" }, next: { revalidate: 3600 } });
  if (res.status === 404) return null; // no report (yet) for that day
  if (!res.ok) throw new Error(`App Store Connect ${res.status}`);
  const lines = gunzipSync(Buffer.from(await res.arrayBuffer())).toString("utf8").trim().split("\n");
  const head = lines[0].split("\t");
  const units = head.indexOf("Units"), type = head.indexOf("Product Type Identifier");
  return lines.slice(1).map((l) => l.split("\t")).filter((c) => ["1", "1F", "1T"].includes(c[type])).reduce((n, c) => n + Number(c[units] || 0), 0);
}
export const loadDownloads = () => load(async () => {
  const token = ascToken();
  // Reports come a day or so late, so look at the 14 days up to yesterday.
  const days = lastDays(15).slice(0, -1);
  const counts = await Promise.all(days.map((d) => downloadsOn(d, token)));
  return days.map((day, i) => ({ day, n: counts[i] }));
}, "downloads");

/* ---------- guides ---------- */
export function guideSchedule() {
  const today = londonToday();
  const live = ALL_GUIDES.filter((g) => g.published <= today);
  const upcoming = ALL_GUIDES.filter((g) => g.published > today).sort((a, b) => (a.published < b.published ? -1 : 1));
  return { live: live.length, scheduled: upcoming.length, next: upcoming.slice(0, 4).map((g) => ({ slug: g.slug, title: g.title, date: g.published })), lastDate: upcoming.at(-1)?.published ?? null };
}

/* ---------- set-up checks ---------- */
export function setupChecks() {
  const on = ["on", "true", "yes", "1"].includes((process.env.GUIDE_EMAILS ?? "").trim().toLowerCase());
  return [
    { label: "Guide emails switched on (GUIDE_EMAILS)", ok: on },
    { label: "Daily guides job secured (CRON_SECRET)", ok: !!process.env.CRON_SECRET },
    { label: "Emails (RESEND_API_KEY)", ok: !!process.env.RESEND_API_KEY },
    { label: "Sign in with Apple (APPLE_BUNDLE_ID)", ok: !!process.env.APPLE_BUNDLE_ID },
    { label: "App Review sign-in (REVIEW_EMAIL, REVIEW_CODE)", ok: !!process.env.REVIEW_EMAIL && !!process.env.REVIEW_CODE },
    { label: "Subscriptions (REVENUECAT_SECRET_KEY, REVENUECAT_PROJECT_ID)", ok: !!process.env.REVENUECAT_SECRET_KEY && !!process.env.REVENUECAT_PROJECT_ID },
    { label: "Downloads (App Store Connect API key)", ok: !!(process.env.ASC_KEY_ID && process.env.ASC_ISSUER_ID && process.env.ASC_PRIVATE_KEY && process.env.ASC_VENDOR_NUMBER) },
  ];
}
