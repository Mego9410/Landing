import { useColorScheme, View } from "react-native";
import { PHASES, READY, YEAR_TWO } from "@/data/content";
import { gettingReady, jabWeek, stageOf, yearTwoWeek, type AppState } from "@/state/store";
import { radius, space, useColors } from "@/theme";
import { AppText } from "./AppText";
import { Card } from "./Card";

const lower = (t: string) => t[0].toLowerCase() + t.slice(1);

/** Where they are in the year: Land, Settle and Steady as one bar sized by their weeks (done phases filled, the
 *  current one filled up to this week), the phase names, and what comes next. */
export function YearCard({ s }: { s: AppState }) {
  const c = useColors(), dark = useColorScheme() === "dark", ready = gettingReady(s), two = yearTwoWeek(s), week = ready ? 0 : jabWeek(s), phase = stageOf(s);
  const next = ready ? null : phase.key === "steady" ? YEAR_TWO : phase.key === "yearTwo" ? null : PHASES[PHASES.indexOf(phase) + 1];
  const right = ready ? READY.name : two ? `${YEAR_TWO.name}, week ${two}` : `Week ${week} of 52`;
  const caption = ready ? `Week 1 begins after your last jab. Until then: ${lower(READY.focus)}`
    : two ? YEAR_TWO.focus
    : next ? `${next.from - week} ${next.from - week === 1 ? "week" : "weeks"} until ${next.key === "yearTwo" ? "year two" : next.name}: ${lower(next.focus)}` : "";
  const cur = PHASES.find((p) => p.key === phase.key);
  const later = PHASES.filter((p) => p.from > week).map((p) => p.name);
  const said = ready ? `${READY.name}. Then Land, Settle and Steady.` : two ? `${YEAR_TWO.name}, week ${two}. Land, Settle and Steady are done.`
    : `${cur!.name}, week ${week - cur!.from + 1} of ${cur!.to - cur!.from + 1}.${later.length ? ` Then ${later.join(" and ")}.` : ""}`;
  return (
    <Card style={{ borderRadius: 24, padding: 18, gap: space[3] }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", gap: space[2], flexWrap: "wrap" }}>
        <AppText variant="heading" accessibilityRole="header" style={{ fontSize: 20 }}>Your year</AppText>
        <AppText variant="caption" color="inkMuted">{right}</AppText>
      </View>
      <View accessible accessibilityRole="progressbar" accessibilityLabel={said} accessibilityValue={{ min: 0, max: 52, now: Math.max(0, Math.min(52, week)) }} style={{ gap: 6 }}>
        <View style={{ flexDirection: "row", gap: 4 }}>
          {PHASES.map((p) => {
            const len = p.to - p.from + 1, filled = Math.max(0, Math.min(len, week - p.from + 1));
            return (
              <View key={p.key} style={{ flex: len, height: 10, borderRadius: radius.full, overflow: "hidden" }}>
                {/* Light: the pastel, filled in its ink. Dark: the phase colour faint, filled in full (its dark ink is
                    too close to the pastel to tell apart). */}
                <View style={{ position: "absolute", inset: 0, backgroundColor: c[p.tone], opacity: dark ? 0.3 : 1 }} />
                <View style={{ width: `${(filled / len) * 100}%`, height: "100%", borderRadius: radius.full, backgroundColor: dark ? c[p.tone] : c[`${p.tone}Ink`] }} />
              </View>
            );
          })}
        </View>
        <View style={{ flexDirection: "row", gap: 4 }}>
          {PHASES.map((p, i) => (
            <AppText key={p.key} weight="800" color={p.key === phase.key ? "ink" : "inkMuted"}
              style={{ flex: p.to - p.from + 1, fontSize: 13, textAlign: i === 0 ? "left" : i === PHASES.length - 1 ? "right" : "center" }}>{p.name}</AppText>
          ))}
        </View>
      </View>
      {caption ? <AppText variant="caption" color="inkMuted">{caption}</AppText> : null}
    </Card>
  );
}
