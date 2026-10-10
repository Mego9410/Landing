// The weekly recap email: Sunday at 6pm UK time, to signed-in people who turned it on (off by default), built from
// their backup. Days checked in, strength sessions, the steady score against last week, and a tip from next week's
// lesson. Weight appears only if they log it, safe mode is off and they chose to see the numbers ("Just show the trend"
// and "Not at all" leave it out); never in the subject line. Sent one email each
// through Resend, at most once a week each (recap_sent), with a one-click unsubscribe link.
import { createHmac, timingSafeEqual } from "node:crypto";
import { sql } from "drizzle-orm";
import { lessonForWeek } from "@landing/content/lessons";
import { SITE_URL } from "@/app/site";
import { getDb } from "./db";
import { ensureExtraTables } from "./db/extra";
import { button, C, esc, shell } from "./newsletter";

/* ---------- dates (YYYY-MM-DD, Monday-first weeks) ---------- */
const DAY = 86_400_000;
const at = (d: string) => Date.parse(`${d}T12:00:00Z`);
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
export const addDays = (d: string, n: number) => iso(at(d) + n * DAY);
const mondayOf = (d: string) => addDays(d, -((new Date(at(d)).getUTCDay() + 6) % 7));
const weekDates = (monday: string) => Array.from({ length: 7 }, (_, i) => addDays(monday, i));

/* ---------- what goes in it ---------- */
interface Doc {
  name?: string;
  settings?: { safeMode?: boolean; units?: "kg" | "stlb" };
  story?: { weightView?: "show" | "trend" | "hide" };
  ob?: { lastInjection?: string };
  startedOn?: string | null;
  journal?: { entries?: Record<string, unknown> };
  days?: Record<string, { sessions?: unknown[] }>;
  weights?: { date: string; kg: number }[];
  derived?: { scores?: Record<string, number | null> };
}

export interface Recap { checkIns: number; sessions: number; score: number | null; lastScore: number | null; weight: { avg: number; change: number } | null; week: number; tip: { title: string; text: string } | null }

/** The plan week on a date, counted from the week of the last injection, as the app does (jabWeek): 0 or less while
 *  the last jab is still to come, 53 and on in year two. */
export function planWeek(doc: Doc, on: string) {
  const li = doc.ob?.lastInjection;
  if (!li) return 1;
  return Math.floor((at(mondayOf(on)) - at(mondayOf(li))) / DAY / 7) + 1;
}
/** How the week reads: "week 12 of 52" (or "week 12" when short), "year two, week 3", or "getting ready". */
export const weekText = (week: number, short = false) =>
  week < 1 ? "getting ready" : week > 52 ? `year two, week ${week - 52}` : short ? `week ${week}` : `week ${week} of 52`;

/** The week ending on `sunday`, from someone's backup. */
export function recapFor(doc: Doc, sunday: string): Recap {
  const monday = mondayOf(sunday), dates = weekDates(monday), last = weekDates(addDays(monday, -7));
  const entries = doc.journal?.entries ?? {};
  const checkIns = dates.filter((d) => entries[d]).length;
  const sessions = dates.reduce((n, d) => n + (doc.days?.[d]?.sessions?.length ?? 0), 0);
  const scores = doc.derived?.scores ?? {};
  let weight: Recap["weight"] = null;
  if (!doc.settings?.safeMode && (doc.story?.weightView ?? "show") === "show") {
    const avg = (ds: string[]) => { const ws = (doc.weights ?? []).filter((w) => ds.includes(w.date)); return ws.length >= 3 ? ws.reduce((a, w) => a + w.kg, 0) / ws.length : null; };
    const now = avg(dates), before = avg(last);
    if (now != null && before != null) weight = { avg: now, change: now - before };
  }
  const week = planWeek(doc, sunday);
  // Next week's lesson: before the last jab, the getting-ready one for their next week since starting.
  const prepWeek = doc.startedOn ? Math.max(1, Math.floor((at(mondayOf(sunday)) - at(mondayOf(doc.startedOn))) / DAY / 7) + 2) : 1;
  const next = lessonForWeek(week + 1, prepWeek).lesson;
  return {
    checkIns, sessions, score: scores[monday] ?? null, lastScore: scores[addDays(monday, -7)] ?? null, weight, week,
    tip: { title: next.title, text: next.tries[0] },
  };
}

const kgText = (kg: number, units?: "kg" | "stlb") => {
  if (units !== "stlb") return `${kg.toFixed(1)} kg`;
  const lb = Math.round(kg * 2.20462);
  return `${Math.floor(lb / 14)} st ${lb % 14} lb`;
};
const changeText = (kg: number, units?: "kg" | "stlb") => {
  if (Math.abs(kg) < 0.2) return "about the same as last week";
  const amount = units === "stlb" ? `${Math.max(1, Math.round(Math.abs(kg) * 2.20462))} lb` : `${Math.abs(kg).toFixed(1)} kg`;
  return `${amount} ${kg > 0 ? "higher" : "lower"} than last week`;
};

/** The lines of the recap, in order, as plain sentences. */
export function recapLines(doc: Doc, r: Recap): string[] {
  const lines = [
    r.checkIns ? `You checked in on ${r.checkIns} ${r.checkIns === 1 ? "day" : "days"} this week.` : "No check-ins this week. That's fine: tomorrow's a fresh one.",
    r.sessions ? `${r.sessions} strength ${r.sessions === 1 ? "session" : "sessions"} done.` : "No strength sessions this week. Even one next week helps.",
  ];
  if (r.score != null) {
    const vs = r.lastScore == null ? "" : r.score > r.lastScore + 2 ? `, up from ${r.lastScore} last week` : r.score < r.lastScore - 2 ? `, from ${r.lastScore} last week. A wobblier week, and that's fine` : `, about the same as last week (${r.lastScore})`;
    lines.push(`Your steady score: ${r.score}${vs}.`);
  }
  if (r.weight) lines.push(`Your 7-day average: ${kgText(r.weight.avg, doc.settings?.units)}, ${changeText(r.weight.change, doc.settings?.units)}.`);
  return lines;
}

/* ---------- unsubscribe links ---------- */
const secret = () => process.env.RECAP_SECRET || process.env.BETTER_AUTH_SECRET || (process.env.VERCEL ? "" : "local-development-secret-not-for-production");
const sign = (userId: string) => createHmac("sha256", secret()).update(`recap:${userId}`).digest("base64url").slice(0, 32);
export const unsubscribeUrl = (userId: string) => `${SITE_URL}/api/recap/unsubscribe?u=${encodeURIComponent(userId)}&t=${sign(userId)}`;
export function validUnsubscribe(userId: string, token: string) {
  if (!secret() || !userId || !token) return false;
  const a = Buffer.from(sign(userId)), b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

/* ---------- the email ---------- */
export function recapEmail(doc: Doc, sunday: string, userId: string) {
  const r = recapFor(doc, sunday), lines = recapLines(doc, r);
  const hi = doc.name ? `Hi ${doc.name},` : "Hi,";
  const subject = `Your week with Steadie: ${weekText(r.week, true)}`;
  const preview = lines[0];
  const unsubscribe = unsubscribeUrl(userId);
  const body = `<p style="margin:0 0 8px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${C.apricotInk};">Your week · ${esc(weekText(r.week))}</p>
<h1 style="margin:0 0 16px;font-size:26px;line-height:32px;font-weight:700;">${esc(hi)} here's how it went</h1>
<ul style="margin:0 0 20px;padding-left:20px;font-size:16px;line-height:24px;">${lines.map((l) => `<li style="margin:0 0 8px;">${esc(l)}</li>`).join("")}</ul>
${r.tip ? `<div style="background:${C.cream};border-radius:14px;padding:18px 20px;margin:0 0 8px;"><p style="margin:0 0 6px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${C.apricotInk};">Next week · ${esc(r.tip.title)}</p><p style="margin:0;font-size:16px;line-height:24px;">One thing to try: ${esc(r.tip.text)}</p></div>` : ""}
${button(`${SITE_URL}/guides?utm_source=email&utm_medium=email&utm_campaign=weekly-recap`, "Read this week's guides")}`;
  const text = `${hi} here's how your week went (${weekText(r.week)}).\n\n${lines.map((l) => `- ${l}`).join("\n")}${r.tip ? `\n\nNext week: ${r.tip.title}. One thing to try: ${r.tip.text}` : ""}\n\n---\nYou're getting this because you turned on the weekly recap in Steadie. Unsubscribe: ${unsubscribe}\nSteadie is general information, not medical advice.`;
  const html = shell(preview, body, { why: "You're getting this because you turned on the weekly recap in Steadie.", unsubscribe, where: "turn it off in the app's Settings" });
  return { subject, html, text, unsubscribe };
}

/* ---------- who gets it, and sending ---------- */
type Row = Record<string, unknown>;
async function rows(q: ReturnType<typeof sql>): Promise<Row[]> {
  return ((await (await getDb()).execute(q)) as unknown as { rows: Row[] }).rows;
}

export async function wantsRecap(userId: string) {
  await ensureExtraTables();
  const [r] = await rows(sql`select weekly_recap from email_prefs where user_id = ${userId}`);
  return !!r?.weekly_recap;
}
export async function setWantsRecap(userId: string, on: boolean) {
  await ensureExtraTables();
  await (await getDb()).execute(sql`insert into email_prefs (user_id, weekly_recap, updated_at) values (${userId}, ${on}, now())
    on conflict (user_id) do update set weekly_recap = ${on}, updated_at = now()`);
}

type Outgoing = { to: string; email: ReturnType<typeof recapEmail> };
export type Deliver = (batch: Outgoing[], idempotencyKey: string) => Promise<void>;

/** Sends this week's recaps that haven't gone out, 50 to a request. `send` false reports how many are due. */
export async function sendRecaps(sunday: string, send: boolean, deliver: Deliver = deliverWithResend) {
  await ensureExtraTables();
  const due = await rows(sql`
    select u.id, u.email, s.data from email_prefs p
    join "user" u on u.id = p.user_id
    join app_state s on s.user_id = u.id
    left join health_consent c on c.user_id = u.id
    where p.weekly_recap and (c.user_id is null or c.withdrawn_at is null)
      and not exists (select 1 from recap_sent r where r.user_id = u.id and r.week = ${sunday})
    order by u.id`);
  let sent = 0, failed = 0;
  if (!send) return { due: due.length, sent, failed };
  for (let i = 0; i < due.length; i += 50) {
    const chunk = due.slice(i, i + 50);
    const ids = chunk.map((d) => String(d.id));
    try {
      await deliver(chunk.map((d) => ({ to: String(d.email), email: recapEmail(d.data as Doc, sunday, String(d.id)) })),
        `recap-${sunday}-${createHmac("sha256", "ids").update(ids.join(",")).digest("hex").slice(0, 24)}`);
      const db = await getDb();
      for (const id of ids) await db.execute(sql`insert into recap_sent (user_id, week) values (${id}, ${sunday}) on conflict do nothing`);
      sent += ids.length;
    } catch (e) { failed += ids.length; console.error("recap: a batch didn't send", e); }
  }
  return { due: due.length, sent, failed };
}

async function deliverWithResend(batch: Outgoing[], idempotencyKey: string) {
  const from = process.env.EMAIL_FROM || "Steadie <hello@getsteadieapp.com>";
  const res = await fetch("https://api.resend.com/emails/batch", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
    body: JSON.stringify(batch.map(({ to, email: e }) => ({
      from, to, ...(process.env.EMAIL_REPLY_TO ? { reply_to: process.env.EMAIL_REPLY_TO } : {}),
      subject: e.subject, html: e.html, text: e.text,
      headers: { "List-Unsubscribe": `<${e.unsubscribe}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
    }))),
  });
  if (!res.ok) throw new Error(`Resend refused the recaps (${res.status}).`);
}
