// The growth scorecard on /admin, from the Organic Growth Playbook (Oct 2026): the weekly KPIs and their month-6
// targets, the decision rules, the scenario checkpoints, and the database side (one row per week, plus a change log).
// Rows are entered at the Monday review; downloads, payers and net MRR are suggested from App Store Connect and
// RevenueCat where those are set up.
import { sql } from "drizzle-orm";
import { getDb } from "./db";
import { ensureExtraTables } from "./db/extra";

export type KpiKey =
  | "search_impressions" | "search_conv_pct" | "downloads" | "install_trial_pct" | "trial_paid_pct"
  | "active_payers" | "net_mrr_gbp" | "rating" | "rating_count" | "web_clicks" | "top10_keywords";

export interface Kpi {
  key: KpiKey; label: string; short: string; definition: string; source: string;
  target: string; goal?: number; // goal: the month-6 target as a number, where there is one (below it shows red)
  kind: "count" | "pct" | "gbp" | "stars"; whole: boolean;
}

export const KPIS: Kpi[] = [
  { key: "active_payers", label: "Active payers", short: "Payers", definition: "Paying subscribers at week end", source: "RevenueCat", target: "~45", goal: 45, kind: "count", whole: true },
  { key: "net_mrr_gbp", label: "Net MRR", short: "Net MRR", definition: "Monthly recurring revenue after Apple's 15%", source: "RevenueCat", target: "~£300", goal: 300, kind: "gbp", whole: false },
  { key: "downloads", label: "Downloads", short: "Downloads", definition: "All UK downloads, Monday to Sunday", source: "App Store Connect", target: "~120 a week", goal: 120, kind: "count", whole: true },
  { key: "search_conv_pct", label: "Search conversion", short: "Search conv.", definition: "Search downloads ÷ search impressions", source: "App Store Connect", target: "5%+", goal: 5, kind: "pct", whole: false },
  { key: "install_trial_pct", label: "Install → trial", short: "Install→trial", definition: "Trials ÷ downloads", source: "RevenueCat", target: "10%", goal: 10, kind: "pct", whole: false },
  { key: "trial_paid_pct", label: "Trial → paid", short: "Trial→paid", definition: "Paid ÷ trials ending in the week", source: "RevenueCat", target: "40%", goal: 40, kind: "pct", whole: false },
  { key: "search_impressions", label: "Search impressions", short: "Search impr.", definition: "App Store search impressions, UK, for the week", source: "App Store Connect", target: "Rising week on week", kind: "count", whole: true },
  { key: "rating", label: "Rating", short: "Rating", definition: "Average star rating, UK", source: "App Store Connect", target: "4.6+", goal: 4.6, kind: "stars", whole: false },
  { key: "rating_count", label: "Ratings", short: "Ratings", definition: "Number of UK ratings", source: "App Store Connect", target: "100+", goal: 100, kind: "count", whole: true },
  { key: "web_clicks", label: "Web clicks", short: "Web clicks", definition: "Google clicks to the site, for the week", source: "Search Console", target: "Rising week on week", kind: "count", whole: true },
  { key: "top10_keywords", label: "Top-10 keywords", short: "Top-10 kw", definition: "Core App Store keywords ranking in the top 10", source: "ASO tool or manual search", target: "3+", goal: 3, kind: "count", whole: true },
];
/** The six headline cards, outcome first. */
export const HEADLINE: KpiKey[] = ["active_payers", "net_mrr_gbp", "downloads", "search_conv_pct", "install_trial_pct", "trial_paid_pct"];
/** The funnel steps the weekly "leak" is picked from. */
export const FUNNEL: KpiKey[] = ["search_conv_pct", "install_trial_pct", "trial_paid_pct"];

export const RULES = [
  { signal: "Keyword not in top 50 after 4 weeks", threshold: "Any of the 10 core terms", action: "Swap it out of the keyword field for a longer-tail term" },
  { signal: "Impressions up, search conversion down", threshold: "Conversion below 5% for 2 weeks", action: "Change screenshot 1 or the subtitle (one only)" },
  { signal: "Downloads fine, install→trial low", threshold: "Below 8%", action: "Fix the onboarding step with the biggest drop-off" },
  { signal: "Trial→paid low", threshold: "Below 35%", action: "Review trial-end reminder, day-3 and day-5 check-ins" },
  { signal: "Rating slipping", threshold: "Below 4.5 or a repeated complaint", action: "Fix the complaint; delay prompts until shipped" },
  { signal: "Web page ranking 8–20", threshold: "Any page", action: "Refresh it: sharper first 50 words, more internal links" },
  { signal: "Web clicks flat 3 weeks", threshold: "No growth", action: "Ship the next tool page before more guides" },
  { signal: "Nothing below threshold", threshold: "–", action: "Keep shipping the content cadence; change nothing in the listing" },
];

export const CHECKPOINTS = [
  { when: "Month 3", onTarget: "~10 payers, 4.5+ rating, top 10 for 2 core keywords", behind: "Under 5 payers or no top-20 keywords", ifBehind: "Re-check title and screenshot 1; is onboarding v2 live?" },
  { when: "Month 6", onTarget: "~45 payers, ~£300 net MRR, 100+ ratings", behind: "Under 20 payers", ifBehind: "Narrow keywords to longer-tail terms; double down on tool pages" },
  { when: "Month 9", onTarget: "~150 payers, ~£1k net MRR", behind: "Under 60 payers", ifBehind: "Consider a freelance content writer; decide on Android" },
  { when: "Month 12", onTarget: "~315 payers, ~£2.1k net MRR", behind: "Under 100 payers", ifBehind: "Re-assess positioning (tapering and maintenance on a low dose)" },
  { when: "Month 18", onTarget: "~780 payers, ~£5k net MRR", behind: "Under 300 payers", ifBehind: "US trigger reached on target: plan the US launch" },
];

export type Week = { week_start: string } & Partial<Record<KpiKey, number | null>>;
export interface Change { id: number; day: string; change: string; why: string | null; result: string | null }

const toNum = (v: unknown) => (v === null || v === undefined || v === "" || Number.isNaN(Number(v)) ? null : Number(v));
const toDay = (v: unknown) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v).slice(0, 10));
async function q(query: ReturnType<typeof sql>) {
  const res = (await (await getDb()).execute(query)) as unknown as { rows: Record<string, unknown>[] };
  return res.rows;
}

/** Every week, oldest first, and the change log, newest first. */
export async function loadScorecard() {
  await ensureExtraTables();
  const weeks = (await q(sql`select * from scorecard_weeks order by week_start`)).map((r) => {
    const w: Week = { week_start: toDay(r.week_start) };
    for (const k of KPIS) w[k.key] = toNum(r[k.key]);
    return w;
  });
  const changes = (await q(sql`select id, day, change, why, result from growth_changes order by day desc, id desc limit 200`))
    .map((r) => ({ id: Number(r.id), day: toDay(r.day), change: String(r.change), why: r.why == null ? null : String(r.why), result: r.result == null ? null : String(r.result) }));
  return { weeks, changes };
}

const DAY = /^\d{4}-\d{2}-\d{2}$/;
const isMonday = (d: string) => new Date(`${d}T12:00:00Z`).getUTCDay() === 1;

/** Checks a week from the form: a Monday, and each figure blank or a sensible number. Returns the row or an error. */
export function cleanWeek(body: Record<string, unknown>): { week: Week } | { error: string } {
  const start = String(body.week_start ?? "");
  if (!DAY.test(start) || !isMonday(start)) return { error: "Pick the Monday the week started." };
  const week: Week = { week_start: start };
  for (const k of KPIS) {
    const raw = body[k.key];
    if (raw === undefined || raw === null || raw === "") { week[k.key] = null; continue; }
    const n = Number(raw);
    if (!Number.isFinite(n) || n < 0) return { error: `${k.label} must be a number of 0 or more.` };
    if (k.kind === "pct" && n > 100) return { error: `${k.label} is a percentage, so 100 at most.` };
    if (k.kind === "stars" && n > 5) return { error: "Rating is out of 5." };
    if (k.whole && !Number.isInteger(n)) return { error: `${k.label} must be a whole number.` };
    week[k.key] = n;
  }
  return { week };
}

/** Adds the week, or replaces it if that Monday is already there. */
export async function saveWeek(w: Week) {
  await ensureExtraTables();
  const v = (k: KpiKey) => w[k] ?? null;
  await q(sql`insert into scorecard_weeks (week_start, search_impressions, search_conv_pct, downloads, install_trial_pct, trial_paid_pct, active_payers, net_mrr_gbp, rating, rating_count, web_clicks, top10_keywords, updated_at)
    values (${w.week_start}, ${v("search_impressions")}, ${v("search_conv_pct")}, ${v("downloads")}, ${v("install_trial_pct")}, ${v("trial_paid_pct")}, ${v("active_payers")}, ${v("net_mrr_gbp")}, ${v("rating")}, ${v("rating_count")}, ${v("web_clicks")}, ${v("top10_keywords")}, now())
    on conflict (week_start) do update set search_impressions = excluded.search_impressions, search_conv_pct = excluded.search_conv_pct, downloads = excluded.downloads,
      install_trial_pct = excluded.install_trial_pct, trial_paid_pct = excluded.trial_paid_pct, active_payers = excluded.active_payers, net_mrr_gbp = excluded.net_mrr_gbp,
      rating = excluded.rating, rating_count = excluded.rating_count, web_clicks = excluded.web_clicks, top10_keywords = excluded.top10_keywords, updated_at = now()`);
}

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** A new change-log line: { day, change, why? }. */
export async function addChange(body: Record<string, unknown>): Promise<{ error?: string }> {
  const day = String(body.day ?? ""), change = text(body.change, 300), why = text(body.why, 300);
  if (!DAY.test(day)) return { error: "Add the date of the change." };
  if (!change) return { error: "Say what changed." };
  await ensureExtraTables();
  await q(sql`insert into growth_changes (day, change, why) values (${day}, ${change}, ${why || null})`);
  return {};
}

/** The result of a change, two weeks later: { id, result }. */
export async function setResult(body: Record<string, unknown>): Promise<{ error?: string }> {
  const id = Number(body.id), result = text(body.result, 300);
  if (!Number.isInteger(id) || id < 1) return { error: "That change wasn't found." };
  await ensureExtraTables();
  const done = await q(sql`update growth_changes set result = ${result || null} where id = ${id} returning id`);
  return done.length ? {} : { error: "That change wasn't found." };
}

/** The Monday of the week before the one `today` (YYYY-MM-DD) is in: the week a Monday review fills in. */
export function lastWeekStart(today: string) {
  const d = new Date(`${today}T12:00:00Z`);
  const back = ((d.getUTCDay() + 6) % 7) + 7; // to this Monday, then a week more
  d.setUTCDate(d.getUTCDate() - back);
  return d.toISOString().slice(0, 10);
}
