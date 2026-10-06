// Weights are always stored in kilograms; these show them in the person's chosen units. Stones and pounds round to
// the nearest pound, which is the precision people use day to day.
import type { Units } from "@/state/store";

const LB_PER_KG = 2.20462;

export function weight(kg: number, units: Units): string {
  if (units === "kg") return `${kg.toFixed(1)} kg`;
  const lb = Math.round(kg * LB_PER_KG), st = Math.floor(lb / 14);
  return `${st} st ${lb - st * 14} lb`;
}

/** A change in weight, unsigned, for "0.4 kg higher" or "1 lb higher". */
export function change(kg: number, units: Units): string {
  if (units === "kg") return `${Math.abs(kg).toFixed(1)} kg`;
  const lb = Math.round(Math.abs(kg) * LB_PER_KG * 10) / 10;
  return `${lb % 1 === 0 ? lb.toFixed(0) : lb.toFixed(1)} lb`;
}

/** Kilograms from what someone typed in their units. Stones and pounds as two numbers. */
export const kgFromStLb = (st: number, lb: number) => (st * 14 + lb) / LB_PER_KG;
