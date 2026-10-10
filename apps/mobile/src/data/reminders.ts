// What reminders someone has chosen. Scheduling lives in state/reminders.ts.
export interface Reminders {
  checkIn: { on: boolean; hour: number; minute: number };
  sessions: { on: boolean; hour: number; minute: number; /** Monday is 0. */ days: number[] };
  planning: { on: boolean };
}

export const REMINDER_DEFAULTS: Reminders = {
  checkIn: { on: false, hour: 8, minute: 0 },
  sessions: { on: false, hour: 18, minute: 0, days: [1, 4] },
  planning: { on: false },
};

/** The morning check-in reminder's wording, five ways, taken in turn day by day. Gentle, no guilt, no weight. */
export const CHECK_IN_VARIANTS: { title: string; body: string }[] = [
  { title: "How was yesterday?", body: "A minute of quick questions. Over time they show what helps your days." },
  { title: "Morning check-in", body: "A few taps on how yesterday went, then on with your day." },
  { title: "A minute for you", body: "How did yesterday feel? Your answers build a picture of what helps." },
  { title: "Yesterday, in a minute", body: "Hunger, energy and a couple of yes-or-no questions. That's it." },
  { title: "Your check-in is here", body: "Whenever suits you this morning. It only takes a minute." },
];

/** How many days of check-in reminders are scheduled ahead. Opening the app tops them up; after three weeks away
 *  they stop, which is kinder than nudging someone who has stepped back. */
export const CHECK_IN_DAYS_AHEAD = 21;

/** The check-in reminders to schedule from `now`: one a day at the chosen time, starting the day after onboarding, and
 *  skipping any day whose check-in (about the day before) is already done. Dates are local. */
export function checkInSchedule(
  s: { startedOn: string | null; journal: { entries: Record<string, unknown> } },
  hour: number, minute: number, now: Date, days = CHECK_IN_DAYS_AHEAD,
): { at: Date; day: string; title: string; body: string }[] {
  const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const out: { at: Date; day: string; title: string; body: string }[] = [];
  for (let i = 0; i < days; i++) {
    const at = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, hour, minute, 0, 0);
    if (at.getTime() <= now.getTime()) continue;
    const day = iso(at);
    if (s.startedOn && day <= s.startedOn) continue;
    const before = new Date(at.getFullYear(), at.getMonth(), at.getDate() - 1);
    if (s.journal.entries[iso(before)]) continue;
    const n = Math.floor(Date.UTC(at.getFullYear(), at.getMonth(), at.getDate()) / 86_400_000);
    out.push({ at, day, ...CHECK_IN_VARIANTS[n % CHECK_IN_VARIANTS.length] });
  }
  return out;
}

/* ---------- the plan's own reminders: the end of a free trial and a yearly renewal ---------- */
/** The plan someone chose, as far as the phone knows it: "yearly" or "monthly" and the App Store price ("£69.99"). */
export interface Chosen { plan?: "yearly" | "monthly" | null; price?: string | null }

const longDay = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
const planName = (plan: Chosen["plan"]) => (plan === "yearly" ? "yearly plan" : plan === "monthly" ? "monthly plan" : "plan");
const per = (plan: Chosen["plan"]) => (plan === "yearly" ? " a year" : plan === "monthly" ? " a month" : "");

/** The trial reminder's wording: what happens, when, and the price of the plan they chose when it's known. */
export function trialMessage(until: string, chosen: Chosen = {}) {
  const day = longDay(until);
  const starts = chosen.price ? `your Steadie ${planName(chosen.plan)} starts at ${chosen.price}${per(chosen.plan)}, charged to your Apple ID` : "your Steadie plan starts and your Apple ID is charged";
  return { title: "Your free week ends in 2 days", body: `On ${day} ${starts}. If you’d rather not carry on, cancel in your Apple settings before then.` };
}

/** The note a week before a yearly plan renews, so nobody is charged for a year by surprise. */
export function renewalMessage(until: string, price: string | null = null) {
  return {
    title: "Your yearly plan renews in 7 days",
    body: `It renews on ${longDay(until)}${price ? ` for ${price}` : ""}. Nothing to do if you’d like to carry on. To change or cancel, use Manage subscription.`,
  };
}

/** The renewal note goes off at 9am local time, 7 days before a yearly plan renews. Null if that moment has passed. */
export function renewalReminderAt(until: string, now = Date.now()): Date | null {
  const at = new Date(new Date(until).getTime() - 7 * 24 * 60 * 60 * 1000);
  at.setHours(9, 0, 0, 0);
  return at.getTime() > now + 5 * 1000 ? at : null;
}

/** True in the 7 days before a yearly plan renews (not during a trial, and not if it's been cancelled). */
export function renewalSoon(sub: { active: boolean; plan?: "yearly" | "monthly" | null; trial?: boolean; until?: string | null; willRenew?: boolean } | null, now = Date.now()) {
  if (!sub?.active || sub.trial || sub.plan !== "yearly" || !sub.willRenew || !sub.until) return false;
  const left = new Date(sub.until).getTime() - now;
  return left > 0 && left <= 7 * 24 * 60 * 60 * 1000;
}
