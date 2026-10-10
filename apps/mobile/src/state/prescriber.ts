// The prescriber pack: a one-page summary someone can take to their prescriber or GP. Facts only, from what they've
// logged: weekly averages, habits, sessions and check-ins. No advice and no interpretation, and it says it's
// self-logged, not a clinical record. In Habit Only mode weight is left out.
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import { LOCKUP_SVG } from "@/data/brand";
import { addDays, fmt, today, weekDates, weekStart } from "@/data/dates";
import { weight } from "@/data/units";
import { habitSlots } from "./score";
import { avg7, jabStopped, sessionsInWeek, stageLabel, type AppState } from "./store";

const esc = (t: string) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const avg = (xs: number[]) => (xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10 : null);

interface WeekRow { from: string; weight: string; habits: string; sessions: number; checkIns: number; hunger: string; energy: string }

/** The last four full weeks plus this week so far, newest first. */
export function summaryWeeks(s: AppState): WeekRow[] {
  const t = today();
  return [0, 1, 2, 3, 4].map((n) => {
    const monday = addDays(weekStart(t), -7 * n), dates = weekDates(monday).filter((d) => d <= t), end = dates[dates.length - 1];
    const slots = habitSlots(s, monday, dates), ticked = slots.reduce((a, h) => a + h.days, 0);
    const entries = dates.map((d) => s.journal.entries[d]).filter(Boolean);
    const w = avg7(s, end);
    const scale = (k: "fullness" | "energy") => { const v = avg(entries.map((e) => e[k]).filter((x): x is number => x != null)); return v == null ? "–" : `${v} / 5`; };
    return {
      from: monday, weight: w == null ? "–" : weight(w, s.settings.units),
      habits: `${ticked} of ${slots.length * dates.length} habit days`, sessions: sessionsInWeek(s, end).length,
      checkIns: entries.length, hunger: scale("fullness"), energy: scale("energy"),
    };
  });
}

export function prescriberHtml(s: AppState): string {
  const weeks = summaryWeeks(s), safe = s.settings.safeMode, t = today();
  const name = s.name ? esc(s.name) : "Steadie user";
  const rows = weeks.map((w, i) => `<tr><td>${i === 0 ? "This week so far" : `Week of ${fmt.dayMonth(w.from)}`}</td>${safe ? "" : `<td>${esc(w.weight)}</td>`}<td>${esc(w.habits)}</td><td>${w.sessions}</td><td>${w.checkIns}</td><td>${w.hunger}</td><td>${w.energy}</td></tr>`).join("");
  const status = jabStopped(s) ? `Last injection around ${fmt.dayMonth(s.ob.lastInjection)} (plan: ${stageLabel(s).toLowerCase()})` : s.ob.status === "soon" ? "Planning to stop soon" : "Still taking it";
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    body { font-family: -apple-system, Helvetica, Arial, sans-serif; color: #2B2730; margin: 36px; font-size: 12px; line-height: 1.45; }
    h1 { font-size: 20px; margin: 0 0 4px; } h2 { font-size: 13px; margin: 22px 0 6px; }
    .muted { color: #6E6875; } table { width: 100%; border-collapse: collapse; margin-top: 6px; }
    th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #E6DED4; vertical-align: top; } th { font-size: 11px; color: #6E6875; font-weight: 600; }
    .brand { margin-bottom: 18px; } .brand svg { display: block; }
    .note { margin-top: 26px; padding: 10px 12px; background: #F4EFE8; border-radius: 8px; font-size: 11px; }
  </style></head><body>
    <div class="brand">${LOCKUP_SVG}</div>
    <h1>Summary for your prescriber</h1>
    <div class="muted">${name} · made ${fmt.long(t)}</div>
    <h2>About this summary</h2>
    <div>${esc(status)}. These figures are what ${name === "Steadie user" ? "this person" : name} logged in the Steadie app over the last four weeks.</div>
    <h2>Week by week</h2>
    <table><tr><th>Week</th>${safe ? "" : "<th>7-day average weight</th>"}<th>Habits</th><th>Strength sessions</th><th>Morning check-ins</th><th>Hunger (1 very hungry, 5 comfortably full)</th><th>Energy (1 to 5)</th></tr>${rows}</table>
    ${safe ? `<div class="muted" style="margin-top:8px">Weight isn't included because Habit Only mode is on.</div>` : ""}
    <div class="note">Self-logged in Steadie, a general wellness app. Not a clinical record. Steadie gives no advice about medication, doses or stopping treatment; those decisions are for the prescriber.</div>
  </body></html>`;
}

/** Makes the PDF and opens the share sheet (or the print dialog on the web). */
export async function sharePrescriberPack(s: AppState) {
  const html = prescriberHtml(s);
  if (Platform.OS === "web") {
    // expo-print on the web prints the current page, so open the summary in its own window and print that.
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); w.focus(); w.print(); }
    return;
  }
  const { uri } = await Print.printToFileAsync({ html });
  if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri, { mimeType: "application/pdf", UTI: "com.adobe.pdf", dialogTitle: "Summary for your prescriber" });
  else await Print.printAsync({ uri });
}
