// Dates as "YYYY-MM-DD" strings in the phone's own time zone. A day starts at local midnight and a week on Monday.
// today() reads the clock each time; the store notices when the day changes (see watchDay in state/store.ts) so
// screens redraw after midnight or when the app comes back from the background.
const DAY = 864e5;
const DOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MON = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const pad = (n: number) => String(n).padStart(2, "0");
/** The local calendar date of a moment. */
export const isoDate = (t: Date) => `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
/** Today, by the phone's clock. */
export const today = () => isoDate(new Date());
export const yesterday = () => addDays(today(), -1);

// Date arithmetic in UTC on the date alone, so daylight saving never moves a day.
const d = (iso: string) => { const [y, m, dd] = iso.split("-").map(Number); return new Date(Date.UTC(y, m - 1, dd)); };
export const addDays = (iso: string, n: number) => new Date(d(iso).getTime() + n * DAY).toISOString().slice(0, 10);
export const daysBetween = (a: string, b: string) => Math.round((d(b).getTime() - d(a).getTime()) / DAY);
/** Monday is 0. */
export const weekdayIndex = (iso: string) => (d(iso).getUTCDay() + 6) % 7;
/** The Monday of the week a date falls in. */
export const weekStart = (iso: string) => addDays(iso, -weekdayIndex(iso));
/** The seven dates of the week a date falls in, Monday first. */
export const weekDates = (iso: string) => Array.from({ length: 7 }, (_, i) => addDays(weekStart(iso), i));

export const fmt = {
  long: (s: string) => { const x = d(s); return `${DOW[x.getUTCDay()]} ${x.getUTCDate()} ${MON[x.getUTCMonth()]}`; },
  short: (s: string) => { const x = d(s); return `${DOW[x.getUTCDay()].slice(0, 3)} ${x.getUTCDate()} ${MON[x.getUTCMonth()].slice(0, 3)}`; },
  dayMonth: (s: string) => { const x = d(s); return `${x.getUTCDate()} ${MON[x.getUTCMonth()]}`; },
  weekday: (s: string) => DOW[d(s).getUTCDay()],
};

/** Morning, afternoon or evening, for greetings and tips. */
export function partOfDay(t = new Date()): "morning" | "afternoon" | "evening" {
  const h = t.getHours();
  return h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
}
