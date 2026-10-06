import { router } from "expo-router";
import { View } from "react-native";
import Svg, { Circle, Line, Path, Rect, Text as SvgText } from "react-native-svg";
import { AppText } from "@/components/AppText";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { Avatar, Disc, List, Row, RowCard } from "@/components/ui";
import { HABITS } from "@/data/content";
import { addDays, daysBetween, fmt, today } from "@/data/dates";
import { change, weight } from "@/data/units";
import { recentScores } from "@/state/score";
import { insights, loggedOf } from "@/state/journal";
import { avg7, habitDays, sessionsInWeek, steadyZone, useApp, weekOf, type AppState } from "@/state/store";
import { radius, space, useColors } from "@/theme";

/** The 7-day average for each of the last 28 days, with the steady zone behind it. */
function TrendChart({ s }: { s: AppState }) {
  const c = useColors();
  const days = 28, W = 320, H = 150, L = 34, R = 8, T = 10, B = 22;
  const pts = Array.from({ length: days }, (_, i) => avg7(s, addDays(today(), -(days - 1 - i)))).map((v, i) => ({ i, v }));
  const vals = pts.map((p) => p.v).filter((v): v is number => v != null);
  const [lo, hi] = steadyZone(s);
  const min = Math.floor(Math.min(lo, ...vals) - 0.5), max = Math.ceil(Math.max(hi, ...vals) + 0.5);
  const x = (i: number) => L + (i / (days - 1)) * (W - L - R), y = (v: number) => T + ((max - v) / (max - min)) * (H - T - B);
  const d = pts.filter((p) => p.v != null).map((p, k) => `${k ? "L" : "M"}${x(p.i).toFixed(1)},${y(p.v!).toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={`Seven-day average weight over four weeks, now ${last.v} kg. Steady zone ${lo} to ${hi} kg.`}>
      <Svg width="100%" height={170} viewBox={`0 0 ${W} ${H}`}>
        <Rect x={L} y={y(hi)} width={W - L - R} height={Math.max(2, y(lo) - y(hi))} fill={c.sage} opacity={0.6} rx={6} />
        {[min, (min + max) / 2, max].map((g) => (
          <SvgText key={g} x={L - 6} y={y(g) + 4} fontSize={10} fontFamily="Nunito_600SemiBold" fill={c.inkMuted} textAnchor="end">{g.toFixed(0)}</SvgText>
        ))}
        <Line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke={c.line} />
        <Path d={d} stroke={c.ink} strokeWidth={2.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        {last.v != null ? <Circle cx={x(last.i)} cy={y(last.v)} r={4.5} fill={c.apricot} stroke={c.ink} strokeWidth={1.5} /> : null}
        <SvgText x={L} y={H - 6} fontSize={10} fontFamily="Nunito_600SemiBold" fill={c.inkMuted}>4 weeks ago</SvgText>
        <SvgText x={W - R} y={H - 6} fontSize={10} fontFamily="Nunito_600SemiBold" fill={c.inkMuted} textAnchor="end">Today</SvgText>
      </Svg>
    </View>
  );
}

/** PR1 Progress: the landing score, the weight trend (hidden in safe mode) and recent weigh-ins. */
export default function Progress() {
  const s = useApp(), c = useColors();
  const week = weekOf(s), safe = s.settings.safeMode;
  const { last, before } = recentScores(s), lastWeek = week - 1;
  const ids = s.habits.ids.filter((id) => HABITS[id]?.kind !== "sessions");
  const habitTotal = ids.reduce((a, id) => a + Math.min(habitDays(s, id), HABITS[id]?.target ?? 0), 0);
  const habitTarget = ids.reduce((a, id) => a + (HABITS[id]?.target ?? 0), 0);
  const sessions = sessionsInWeek(s).length, units = s.settings.units;
  const now = avg7(s), weekAgo = avg7(s, addDays(today(), -7));
  const recent = [...s.weights].sort((a, b) => (a.date < b.date ? 1 : -1)).filter((w) => daysBetween(w.date, today()) < 10);
  return (
    <Screen contentContainerStyle={{ gap: space[5] }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <AppText variant="title" accessibilityRole="header">Progress</AppText>
        <Avatar name={s.name} />
      </View>
      {last ? (
        <Card tone="sage" hero style={{ flexDirection: "row", alignItems: "center", gap: space[4] }}>
          <View style={{ width: 84, height: 84, borderRadius: 42, borderWidth: 9, borderColor: c.sageInk, alignItems: "center", justifyContent: "center", backgroundColor: c.surfaceRaised }}>
            <AppText variant="numeral" style={{ fontSize: 28, lineHeight: 32 }}>{last.score}</AppText>
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <AppText variant="label" color="onPastel">LANDING SCORE · {lastWeek >= 1 ? `WEEK ${lastWeek}` : "LAST WEEK"}</AppText>
            <AppText weight="800" color="onPastel" style={{ fontSize: 16 }}>{!before || last.score >= before.score ? "A steady week" : "A wobblier week, and that's fine"}</AppText>
            <AppText variant="caption" color="onPastel">
              {before ? (last.score >= before.score ? `Up ${last.score - before.score} on the week before. ` : `Down ${before.score - last.score} on the week before. `) : ""}
              Built from habits, sessions{last.usedWeight ? " and your trend" : " and your check-ins"}.
            </AppText>
          </View>
        </Card>
      ) : (
        <Card tone="sage" hero style={{ gap: 4 }}>
          <AppText variant="label" color="onPastel">LANDING SCORE</AppText>
          <AppText weight="800" color="onPastel" style={{ fontSize: 16 }}>Your first score arrives on Monday</AppText>
          <AppText variant="caption" color="onPastel">It&apos;s built each week from your habits, sessions and {safe ? "check-ins" : "trend"}. There&apos;s no target to hit.</AppText>
        </Card>
      )}
      <View style={{ flexDirection: "row", gap: space[3] }}>
        <Card style={{ flex: 1, gap: 2 }}>
          <AppText variant="numeral" style={{ fontSize: 26, lineHeight: 30 }}>{habitTotal}<AppText color="inkMuted"> / {habitTarget}</AppText></AppText>
          <AppText variant="caption" color="inkMuted">Habit days this week</AppText>
        </Card>
        <Card style={{ flex: 1, gap: 2 }}>
          <AppText variant="numeral" style={{ fontSize: 26, lineHeight: 30 }}>{sessions}<AppText color="inkMuted"> / 2</AppText></AppText>
          <AppText variant="caption" color="inkMuted">Strength sessions</AppText>
        </Card>
      </View>
      <RowCard onPress={() => router.push("/journal/insights")}>
        <Disc icon="today" tone="sky" />
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="label" color="inkMuted">YOUR DAY</AppText>
          <AppText weight="800" style={{ fontSize: 16 }}>What shapes your days</AppText>
          <AppText variant="caption" color="inkMuted">{insights(s).ready.filter((i) => i.lead).length} patterns from {loggedOf(s, 30)} days of check-ins</AppText>
        </View>
      </RowCard>
      {safe ? (
        <Card tone="sunk" style={{ gap: 6 }}>
          <AppText weight="800">Weight is hidden in safe mode</AppText>
          <AppText color="inkMuted">Your score comes from your routines. You can change this in Settings whenever you like.</AppText>
        </Card>
      ) : (
        <>
          <Card style={{ gap: space[3] }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
              <AppText variant="heading">Your trend</AppText>
              <AppText variant="caption" color="inkMuted">7-day average</AppText>
            </View>
            {now != null ? <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}>
              <AppText variant="numeral" style={{ fontSize: 30, lineHeight: 34 }}>{weight(now, units)}</AppText>
              {now != null && weekAgo != null ? <AppText variant="caption" color="inkMuted">{Math.abs(now - weekAgo) < 0.05 ? "Same as last week" : `${change(now - weekAgo, units)} ${now > weekAgo ? "higher" : "lower"} than last week`}</AppText> : null}
            </View> : null}
            {now != null ? <TrendChart s={s} /> : <AppText color="inkMuted">Log a weigh-in from Today, or connect Apple Health in Settings, and your 7-day average shows here.</AppText>}
            {now != null ? <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View style={{ width: 14, height: 10, borderRadius: radius.sm, backgroundColor: c.sage }} />
              <AppText variant="caption" color="inkMuted">Steady zone: {weight(steadyZone(s)[0], units)} to {weight(steadyZone(s)[1], units)}. Day-to-day changes are mostly water.</AppText>
            </View> : null}
          </Card>
          {recent.length ? <View style={{ gap: space[2] }}>
            <AppText variant="label" color="inkMuted">RECENT WEIGH-INS</AppText>
            <List>
              {recent.map((w, i) => <Row key={w.date} first={i === 0} title={weight(w.kg, units)} sub={fmt.short(w.date)} value={w.source} />)}
            </List>
          </View> : null}
        </>
      )}
    </Screen>
  );
}
