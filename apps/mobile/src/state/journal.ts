import { MIN_DAYS, questionById, type YesNoQuestion } from "@/data/journal";
import { addDays, daysBetween, yesterday } from "@/data/dates";
import { change } from "@/data/units";
import { set, type AppState, type JournalEntry, type Units } from "./store";

export type Metric = "fullness" | "energy" | "weight";

/** One thing compared on days with and without a yes. */
export interface Effect { metric: Metric; withAvg: number; withoutAvg: number; diff: number; nWith: number; nWithout: number; units?: Units }
export interface Insight { q: YesNoQuestion; nYes: number; nNo: number; effects: Effect[]; lead: Effect | null }

// Below these, a difference is shown as "no clear difference": a third of a step on a scale, 0.1 kg overnight.
const NOISE: Record<Metric, number> = { fullness: 0.3, energy: 0.3, weight: 0.1 };
// How big a difference reads as, for ordering: a whole step on a scale weighs about the same as 0.3 kg overnight.
const UNIT: Record<Metric, number> = { fullness: 1, energy: 1, weight: 0.3 };


/** The weigh-in the morning after a day, less the one that morning. Null if either is missing. */
export function overnight(s: AppState, day: string): number | null {
  const a = s.weights.find((w) => w.date === day)?.kg, b = s.weights.find((w) => w.date === addDays(day, 1))?.kg;
  return a != null && b != null ? b - a : null;
}

function value(s: AppState, day: string, e: JournalEntry, m: Metric): number | null {
  if (m === "weight") return overnight(s, day);
  return e[m] ?? null;
}

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

/** Compares days with and without each chosen question. Weight is left out in safe mode. */
export function insights(s: AppState): { ready: Insight[]; learning: Insight[] } {
  const days = Object.entries(s.journal.entries);
  const metrics: Metric[] = s.settings.safeMode ? ["fullness", "energy"] : ["weight", "fullness", "energy"];
  const all = s.journal.questions.map(questionById).filter((q): q is YesNoQuestion => !!q).map((q): Insight => {
    const yes = days.filter(([, e]) => e.yes[q.id] === true), no = days.filter(([, e]) => e.yes[q.id] === false);
    const effects = metrics.flatMap((metric): Effect[] => {
      const w = yes.map(([d, e]) => value(s, d, e, metric)).filter((v): v is number => v != null);
      const wo = no.map(([d, e]) => value(s, d, e, metric)).filter((v): v is number => v != null);
      if (w.length < MIN_DAYS || wo.length < MIN_DAYS) return [];
      const withAvg = mean(w), withoutAvg = mean(wo);
      return [{ metric, withAvg, withoutAvg, diff: withAvg - withoutAvg, nWith: w.length, nWithout: wo.length, units: s.settings.units }];
    });
    const lead = effects.filter(clear).sort((a, b) => Math.abs(b.diff) / UNIT[b.metric] - Math.abs(a.diff) / UNIT[a.metric])[0] ?? null;
    return { q, nYes: yes.length, nNo: no.length, effects, lead };
  });
  const size = (i: Insight) => (i.lead ? Math.abs(i.lead.diff) / UNIT[i.lead.metric] : 0);
  return {
    ready: all.filter((i) => i.effects.length).sort((a, b) => size(b) - size(a)),
    learning: all.filter((i) => !i.effects.length),
  };
}

export const clear = (e: Effect) => Math.abs(e.diff) >= NOISE[e.metric];

/** A calm sentence for one comparison. Weight differences never get a colour or a judgement. */
export function describe(e: Effect, short = false): string {
  if (!clear(e)) return "No clear difference";
  const up = e.diff > 0;
  if (e.metric === "fullness") return up ? "Fuller, less hungry" : "Hungrier";
  if (e.metric === "energy") return up ? "More energy" : "Less energy";
  return `${change(e.diff, e.units ?? "kg")} ${up ? "higher" : "lower"}${short ? "" : " the next morning"}`;
}

export function figures(e: Effect): string {
  const f = (v: number) => {
    if (e.metric !== "weight") return v.toFixed(1);
    const r = Math.round(v * 10) / 10, units = e.units ?? "kg";
    if (r === 0) return "no change";
    return `${r > 0 ? "+" : "−"}${change(v, units)}`;
  };
  return `With: ${f(e.withAvg)} · without: ${f(e.withoutAvg)}`;
}

export const METRIC_LABEL: Record<Metric, string> = { fullness: "Hunger", energy: "Energy", weight: "Next-morning weight" };

/** Days logged out of the last n, counting back from yesterday. */
export function loggedOf(s: AppState, n: number) {
  return Object.keys(s.journal.entries).filter((d) => { const k = daysBetween(d, yesterday()); return k >= 0 && k < n; }).length;
}

export function saveEntry(day: string, entry: JournalEntry) {
  set((s) => { s.journal.entries[day] = entry; });
}

export function setQuestions(ids: string[]) {
  set((s) => { s.journal.questions = ids; });
}
