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
