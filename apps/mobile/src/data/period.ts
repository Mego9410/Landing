// Store periods in words. App Store periods come as ISO 8601 durations ("P1W", "P1M", "P1Y").
const UNIT: Record<string, string> = { D: "day", W: "week", M: "month", Y: "year" };

/** "P1W" → "7 days", "P2W" → "14 days", "P1M" → "1 month". Trials read best in days. "" if it isn't a period. */
export function period(iso: string | null | undefined): string {
  const m = iso?.match(/^P(\d+)([DWMY])$/);
  if (!m) return "";
  let n = Number(m[1]), unit = UNIT[m[2]];
  if (unit === "week") { n *= 7; unit = "day"; }
  return `${n} ${unit}${n === 1 ? "" : "s"}`;
}
