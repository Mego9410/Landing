// The demo runs on a fixed "today", Monday 5 October 2026, as the prototype and the designs do, so the dummy data
// (Hannah, six weeks after her last injection) always lines up.
export const TODAY = "2026-10-05";
const DAY = 864e5;
const DOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MON = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const d = (iso: string) => { const [y, m, dd] = iso.split("-").map(Number); return new Date(Date.UTC(y, m - 1, dd)); };
export const addDays = (iso: string, n: number) => new Date(d(iso).getTime() + n * DAY).toISOString().slice(0, 10);
export const daysBetween = (a: string, b: string) => Math.round((d(b).getTime() - d(a).getTime()) / DAY);
export const fmt = {
  long: (s: string) => { const x = d(s); return `${DOW[x.getUTCDay()]} ${x.getUTCDate()} ${MON[x.getUTCMonth()]}`; },
  short: (s: string) => { const x = d(s); return `${DOW[x.getUTCDay()].slice(0, 3)} ${x.getUTCDate()} ${MON[x.getUTCMonth()].slice(0, 3)}`; },
  dayMonth: (s: string) => { const x = d(s); return `${x.getUTCDate()} ${MON[x.getUTCMonth()]}`; },
};
/** Monday is 0. */
export const weekdayIndex = (iso: string) => (d(iso).getUTCDay() + 6) % 7;
