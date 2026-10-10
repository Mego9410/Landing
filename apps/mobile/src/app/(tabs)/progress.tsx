import { router } from "expo-router";
import { View } from "react-native";
import Svg, { Circle, Line, Path, Rect, Text as SvgText } from "react-native-svg";
import { AppText } from "@/components/AppText";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { Avatar, Disc, List, Row, RowCard } from "@/components/ui";
import { HABITS } from "@/data/content";
import { addDays, daysBetween, fmt, today } from "@/data/dates";
import { sessionsByMonth, strengthYear } from "@/data/sessions";
import { change, weight } from "@/data/units";
import { sessionTarget } from "@/state/habits";
import { sharePrescriberPack } from "@/state/prescriber";
import { recentScores, scoreHistory, steadiestStretch } from "@/state/score";
import { toast } from "@/state/toast";
import { insights, loggedOf } from "@/state/journal";
import { avg7, habitDays, sessionsInWeek, steadyZone, useApp, type AppState, type Units } from "@/state/store";
import { radius, space, useColors } from "@/theme";

/** A short axis label in their units: "78" or "12st 5". */
const axisLabel = (kg: number, units: Units) => (units === "kg" ? kg.toFixed(0) : weight(kg, units).replace(" st ", "st ").replace(" lb", ""));

/** The 7-day average for each of the last 28 days, with the steady zone behind it. With `bare` (just the trend), the
 *  line and the zone only: no numbers on the axis or in the description. */
function TrendChart({ s, bare }: { s: AppState; bare?: boolean }) {
  const c = useColors(), units = s.settings.units;
  const days = 28, W = 320, H = 150, L = bare ? 8 : units === "kg" ? 34 : 44, R = 8, T = 10, B = 22;
  const pts = Array.from({ length: days }, (_, i) => avg7(s, addDays(today(), -(days - 1 - i)))).map((v, i) => ({ i, v }));
  const vals = pts.map((p) => p.v).filter((v): v is number => v != null);
  const [lo, hi] = steadyZone(s);
  const min = Math.floor(Math.min(lo, ...vals) - 0.5), max = Math.ceil(Math.max(hi, ...vals) + 0.5);
  const x = (i: number) => L + (i / (days - 1)) * (W - L - R), y = (v: number) => T + ((max - v) / (max - min)) * (H - T - B);
  const d = pts.filter((p) => p.v != null).map((p, k) => `${k ? "L" : "M"}${x(p.i).toFixed(1)},${y(p.v!).toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={bare || last.v == null ? "Seven-day average weight over four weeks, as a line, with your steady zone behind it." : `Seven-day average weight over four weeks, now ${weight(last.v, units)}. Steady zone ${weight(lo, units)} to ${weight(hi, units)}.`}>
      <Svg width="100%" height={170} viewBox={`0 0 ${W} ${H}`}>
        <Rect x={L} y={y(hi)} width={W - L - R} height={Math.max(2, y(lo) - y(hi))} fill={c.sage} opacity={0.6} rx={6} />
        {bare ? null : [min, (min + max) / 2, max].map((g) => (
          <SvgText key={g} x={L - 6} y={y(g) + 4} fontSize={10} fontFamily="Nunito_600SemiBold" fill={c.inkMuted} textAnchor="end">{axisLabel(g, units)}</SvgText>
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

/** The last 12 weeks' steady scores as a strip of small bars, with their steadiest stretch. No weight in it. */
function ScoreStrip({ s }: { s: AppState }) {
  const c = useColors();
  const history = scoreHistory(s), stretch = steadiestStretch(history);
  if (history.filter((h) => h.score != null).length < 2) return null;
  const label = history.map((h) => `week ${h.week}, ${h.score ?? "no score"}`).join("; ");
  return (
    <Card style={{ gap: space[3] }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
        <AppText variant="heading">Your last 12 weeks</AppText>
        <AppText variant="caption" color="inkMuted">Steady score</AppText>
      </View>
      <View accessible accessibilityRole="image" accessibilityLabel={`Steady score by week: ${label}.`} style={{ flexDirection: "row", alignItems: "flex-end", gap: 4, height: 48 }}>
        {history.map((h) => (
          <View key={h.monday} style={{ flex: 1, height: h.score == null ? 4 : Math.max(6, (h.score / 100) * 48), borderRadius: radius.sm, backgroundColor: h.score == null ? c.line : stretch && h.week >= stretch.from && h.week <= stretch.to ? c.sageInk : c.sage }} />
        ))}
      </View>
      <AppText variant="caption" color="inkMuted">{stretch ? `Your steadiest stretch: weeks ${stretch.from} to ${stretch.to}.` : "Each bar is one week. Gaps are weeks with nothing logged, and that's fine."}</AppText>
    </Card>
  );
}

const MONTH_NAME = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "Your strength year": where each pattern started and where it is now, and sessions done each month. No weight. */
function StrengthYear({ s }: { s: AppState }) {
  const c = useColors();
  const rows = strengthYear(s), moved = rows.filter((r) => r.up), months = sessionsByMonth(s);
  const total = months.reduce((a, m) => a + m.count, 0), most = Math.max(1, ...months.map((m) => m.count));
  if (!moved.length && !total) return null;
  return (
    <Card style={{ gap: space[3] }}>
      <AppText variant="heading">Your strength year</AppText>
      {moved.length ? <View style={{ gap: 4 }}>
        {moved.slice(0, 6).map((r) => (
          <AppText key={r.pattern} variant="caption"><AppText variant="caption" weight="800">{r.pattern}:</AppText> {r.from} → {r.to}</AppText>
        ))}
        {moved.length > 6 ? <AppText variant="caption" color="inkMuted">And {moved.length - 6} more.</AppText> : null}
        {rows.length > moved.length ? <AppText variant="caption" color="inkMuted">The others stay at the level that suits you.</AppText> : null}
      </View> : <AppText variant="caption" color="inkMuted">Your moves step up every eight weeks. This is where you&apos;ll see how far each one has come.</AppText>}
      {total ? <View style={{ gap: 4 }}>
        <View accessible accessibilityRole="image" accessibilityLabel={`Sessions each month: ${months.map((m) => `${MONTH_NAME[Number(m.month.slice(5)) - 1]}, ${m.count}`).join("; ")}.`} style={{ flexDirection: "row", alignItems: "flex-end", gap: 4, height: 56 }}>
          {months.map((m) => (
            <View key={m.month} style={{ flex: 1, alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
              {m.count ? <AppText variant="caption" weight="800" maxFontSizeMultiplier={1.2}>{m.count}</AppText> : null}
              <View style={{ alignSelf: "stretch", maxWidth: 44, marginHorizontal: "auto", height: m.count ? Math.max(6, (m.count / most) * 36) : 4, borderRadius: radius.sm, backgroundColor: m.count ? c.butter : c.line }} />
            </View>
          ))}
        </View>
        <View style={{ flexDirection: "row", gap: 4 }} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
          {months.map((m) => <AppText key={m.month} variant="caption" color="inkMuted" maxFontSizeMultiplier={1.2} style={{ flex: 1, textAlign: "center", fontSize: months.length > 8 ? 10 : 12 }}>{MONTH_NAME[Number(m.month.slice(5)) - 1].slice(0, 3)}</AppText>)}
        </View>
        <AppText variant="caption" color="inkMuted">{total} {total === 1 ? "session" : "sessions"} so far, month by month.</AppText>
      </View> : null}
    </Card>
  );
}

/** PR1 Progress: the steady score, the weight trend (hidden in Habit Only mode) and recent weigh-ins. */
export default function Progress() {
  const s = useApp(), c = useColors();
  const safe = s.settings.safeMode, bare = s.story.weightView === "trend";
  const { last, before } = recentScores(s);
  const scoredBefore = !last && scoreHistory(s).some((h) => h.score != null);
  const ids = s.habits.ids.filter((id) => HABITS[id]?.kind !== "sessions");
  const habitTotal = ids.reduce((a, id) => a + Math.min(habitDays(s, id), HABITS[id]?.target ?? 0), 0);
  const habitTarget = ids.reduce((a, id) => a + (HABITS[id]?.target ?? 0), 0);
  const sessions = sessionsInWeek(s).length, units = s.settings.units, target = sessionTarget(s);
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
            <AppText variant="label" color="onPastel">STEADY SCORE · LAST WEEK</AppText>
            <AppText weight="800" color="onPastel" style={{ fontSize: 16 }}>{!before || last.score >= before.score ? "A steady week" : "A wobblier week, and that's fine"}</AppText>
            <AppText variant="caption" color="onPastel">
              {before ? (last.score === before.score ? "The same as the week before. " : last.score > before.score ? `Up ${last.score - before.score} on the week before. ` : `Down ${before.score - last.score} on the week before. `) : ""}
              Built from habits, sessions{last.usedWeight ? " and your trend" : " and your check-ins"}.
            </AppText>
          </View>
        </Card>
      ) : scoredBefore ? (
        <Card tone="sage" hero style={{ gap: 4 }}>
          <AppText variant="label" color="onPastel">STEADY SCORE · LAST WEEK</AppText>
          <AppText weight="800" color="onPastel" style={{ fontSize: 16 }}>A quiet week</AppText>
          <AppText variant="caption" color="onPastel">Nothing was logged last week, and that&apos;s fine. Whatever you log this week makes Monday&apos;s score.</AppText>
        </Card>
      ) : (
        <Card tone="sage" hero style={{ gap: 4 }}>
          <AppText variant="label" color="onPastel">STEADY SCORE</AppText>
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
          <AppText variant="numeral" style={{ fontSize: 26, lineHeight: 30 }}>{sessions}<AppText color="inkMuted"> / {target}</AppText></AppText>
          <AppText variant="caption" color="inkMuted">Strength sessions</AppText>
        </Card>
      </View>
      <ScoreStrip s={s} />
      <StrengthYear s={s} />
      <RowCard onPress={() => sharePrescriberPack(s).catch(() => toast("Couldn't make the summary. Try again."))}>
        <Disc icon="doc" tone="butter" />
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="label" color="inkMuted">FOR YOUR PRESCRIBER</AppText>
          <AppText weight="800" style={{ fontSize: 16 }}>A one-page summary</AppText>
          <AppText variant="caption" color="inkMuted">Your last four weeks, to share or print</AppText>
        </View>
      </RowCard>
      <RowCard onPress={() => router.push("/journal/insights")}>
        <Disc icon="today" tone="sky" />
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="label" color="inkMuted">YOUR DAY</AppText>
          <AppText weight="800" style={{ fontSize: 16 }}>What shapes your days</AppText>
          <AppText variant="caption" color="inkMuted">{loggedOf(s, 30) ? `${insights(s).ready.filter((i) => i.lead).length} patterns from ${loggedOf(s, 30)} days of check-ins` : "Patterns appear after a few morning check-ins"}</AppText>
        </View>
      </RowCard>
      {safe ? (
        <Card tone="sunk" style={{ gap: 6 }}>
          <AppText weight="800">Weight is hidden in Habit Only mode</AppText>
          <AppText color="inkMuted">Your score comes from your routines. You can change this in Settings whenever you like.</AppText>
        </Card>
      ) : (
        <>
          <Card style={{ gap: space[3] }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
              <AppText variant="heading">Your trend</AppText>
              <AppText variant="caption" color="inkMuted">7-day average</AppText>
            </View>
            {now != null && !bare ? <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}>
              <AppText variant="numeral" style={{ fontSize: 30, lineHeight: 34 }}>{weight(now, units)}</AppText>
              {now != null && weekAgo != null ? <AppText variant="caption" color="inkMuted">{Math.abs(now - weekAgo) < 0.05 ? "Same as last week" : `${change(now - weekAgo, units)} ${now > weekAgo ? "higher" : "lower"} than last week`}</AppText> : null}
            </View> : null}
            {now != null ? <TrendChart s={s} bare={bare} /> : <AppText color="inkMuted">Log a weigh-in from Today, or connect Apple Health in Settings, and your 7-day average shows here.</AppText>}
            {now != null ? <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View style={{ width: 14, height: 10, borderRadius: radius.sm, backgroundColor: c.sage }} />
              <AppText variant="caption" color="inkMuted">{bare ? "The shaded band is your steady zone." : `Steady zone: ${weight(steadyZone(s)[0], units)} to ${weight(steadyZone(s)[1], units)}.`} Day-to-day changes are mostly water.</AppText>
            </View> : null}
          </Card>
          {recent.length && !bare ? <View style={{ gap: space[2] }}>
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
