import { View } from "react-native";
import { PHASES, READY, YEAR_TWO } from "@/data/content";
import { gettingReady, jabWeek, stageOf, weeksToLastJab, yearTwoWeek, type AppState } from "@/state/store";
import { radius, space, useColors } from "@/theme";
import { AppText } from "./AppText";

/** "3 weeks until Settle." / "Week 1 begins after your last jab." Empty in Steady's last weeks before year two starts
 *  counting, and in year two. */
export function weeksAhead(s: AppState): string {
  const phase = stageOf(s), week = jabWeek(s);
  if (gettingReady(s)) return "Week 1 begins after your last jab.";
  const next = phase.key === "steady" ? YEAR_TWO : phase.key === "yearTwo" ? null : PHASES[PHASES.indexOf(phase) + 1];
  if (!next) return "";
  const n = next.from - week;
  return `${n} ${n === 1 ? "week" : "weeks"} until ${next.key === "yearTwo" ? "year two" : next.name}.`;
}

/** The year at a glance: Land, Settle and Steady as one strip, sized by their weeks, filled up to this week, with how
 *  long until the next phase. Empty while getting ready, and full in year two. */
export function PhaseStrip({ s }: { s: AppState }) {
  const c = useColors(), phase = stageOf(s), ready = gettingReady(s), two = yearTwoWeek(s), week = ready ? 0 : jabWeek(s);
  const toGo = weeksToLastJab(s), ahead = weeksAhead(s);
  const label = ready ? `${READY.name} · last jab in about ${toGo} ${toGo === 1 ? "week" : "weeks"}` : two ? `${YEAR_TWO.name} · week ${two}` : `Week ${week} of 52 · ${phase.name}`;
  return (
    <View style={{ gap: 6 }}>
      <View accessible accessibilityRole="progressbar" accessibilityLabel={label} accessibilityValue={{ min: 0, max: 52, now: Math.min(52, week) }} style={{ gap: 6 }}>
        <View style={{ flexDirection: "row", gap: 4 }}>
          {PHASES.map((p) => {
            const len = p.to - p.from + 1, filled = Math.max(0, Math.min(len, week - p.from + 1));
            return (
              <View key={p.key} style={{ flex: len, height: 8, borderRadius: radius.full, backgroundColor: c.surfaceSunk, overflow: "hidden" }}>
                <View style={{ width: `${(filled / len) * 100}%`, height: "100%", backgroundColor: c[p.tone] }} />
              </View>
            );
          })}
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: space[2] }}>
          <AppText variant="caption" weight="700" style={{ flexShrink: 1 }}>{label}</AppText>
          <AppText variant="caption" color="inkMuted">{two ? "A year done" : PHASES.map((p) => p.name).join(" › ")}</AppText>
        </View>
      </View>
      {ahead ? <AppText variant="caption" color="inkMuted">{ahead}</AppText> : null}
    </View>
  );
}
