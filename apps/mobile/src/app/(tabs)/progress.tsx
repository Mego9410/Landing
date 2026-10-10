import { router } from "expo-router";
import { useColorScheme, View } from "react-native";
import Svg, { Circle, Line, Path, Rect, Text as SvgText } from "react-native-svg";
import { AppText } from "@/components/AppText";
import { Card } from "@/components/Card";
import { PhaseStrip } from "@/components/PhaseStrip";
import { Screen } from "@/components/Screen";
import { Avatar, Disc, List, Row, RowCard } from "@/components/ui";
import { HABITS } from "@/data/content";
import { addDays, daysBetween, fmt, today, weekDates, weekStart } from "@/data/dates";
import { sessionsByMonth, strengthYear } from "@/data/sessions";
import { change, weight } from "@/data/units";
import { sessionTarget } from "@/state/habits";
import { sharePrescriberPack } from "@/state/prescriber";
import { habitSlots, recentScores, scoreHistory, steadiestStretch } from "@/state/score";
import { toast } from "@/state/toast";
import { insights, loggedOf } from "@/state/journal";
import { avg7, sessionsInWeek, stageCaption, steadyZone, useApp, type AppState, type Units } from "@/state/store";
import { radius, space, useColors, useLargeText } from "@/theme";

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
              <View style={{ width: "100%", maxWidth: 44, height: m.count ? Math.max(6, (m.count / most) * 36) : 4, borderRadius: radius.sm, backgroundColor: m.count ? c.butter : c.line }} />
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
/** A sageInk bar on a soft white track, for one part of the score. */
function Bar({ label, value, fill }: { label: string; value: string; fill: number }) {
  const c = useColors(), dark = useColorScheme() === "dark";
  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: space[2], flexWrap: "wrap" }}>
        <AppText weight="800" color="onPastel" style={{ fontSize: 13 }}>{label}</AppText>
        <AppText weight="800" color="onPastel" style={{ fontSize: 13 }}>{value}</AppText>
      </View>
      <View style={{ height: 10, borderRadius: radius.full, overflow: "hidden" }}>
        <View style={{ position: "absolute", inset: 0, backgroundColor: dark ? c.onPastel : c.surfaceRaised, opacity: dark ? 0.14 : 0.55 }} />
        <View style={{ width: `${Math.round(Math.max(0, Math.min(1, fill)) * 100)}%`, height: "100%", borderRadius: radius.full, backgroundColor: dark ? c.onPastel : c.sageInk }} />
      </View>
    </View>
  );
}

/** The score as a ring: a white centre with the number, and a sageInk arc for score / 100 on a soft white track. */
function ScoreRing({ score }: { score: number }) {
  // The dark theme's sage ink is made for dark surfaces, so on the pastel card the ring uses the card's own ink.
  const c = useColors(), dark = useColorScheme() === "dark", size = 84, r = 37, len = 2 * Math.PI * r;
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={dark ? c.onPastel : c.surfaceRaised} strokeOpacity={dark ? 0.14 : 0.55} strokeWidth={9} fill={dark ? c.ink : c.surfaceRaised} />
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={dark ? c.onPastel : c.sageInk} strokeWidth={9} fill="none" strokeLinecap="round"
          strokeDasharray={`${(len * score) / 100} ${len}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </Svg>
      <View style={{ position: "absolute", inset: 0, alignItems: "center", justifyContent: "center" }}>
        <AppText variant="display" color="onPastel" maxFontSizeMultiplier={1.2} style={{ fontSize: 30, lineHeight: 34, letterSpacing: 0 }}>{score}</AppText>
      </View>
    </View>
  );
}

/** Last week's steady score and what built it: habits, strength, and check-ins or the trend (never a weight). */
function ScoreCard({ s }: { s: AppState }) {
  const large = useLargeText(), safe = s.settings.safeMode, accent = useColorScheme() === "dark" ? "onPastel" : "sageInk";
  const { last, before } = recentScores(s), monday = addDays(weekStart(today()), -7);
  const scoredBefore = !last && scoreHistory(s).some((h) => h.score != null);
  const card = { borderRadius: 26, padding: 18, gap: space[3] } as const;
  if (!last) {
    return (
      <Card tone="sage" style={card} accessible>
        <AppText variant="label" color={accent}>STEADY SCORE{scoredBefore ? " · LAST WEEK" : ""}</AppText>
        <AppText weight="800" color="onPastel" style={{ fontSize: 16 }}>{scoredBefore ? "A quiet week" : "Your first score arrives on Monday"}</AppText>
        <AppText variant="caption" color="onPastel">{scoredBefore ? "Nothing was logged last week, and that's fine. Whatever you log this week makes Monday's score."
          : `It's built each week from your habits, sessions and ${safe ? "check-ins" : "trend"}. There's no target to hit.`}</AppText>
      </Card>
    );
  }
  const slots = habitSlots(s, monday), aim = slots.reduce((a, h) => a + HABITS[h.id].target, 0), kept = slots.reduce((a, h) => a + Math.min(h.days, HABITS[h.id].target), 0);
  const done = sessionsInWeek(s, addDays(monday, 6)).length, target = sessionTarget(s);
  const mornings = weekDates(monday).filter((d) => s.journal.entries[d]).length;
  const headline = !before || last.score >= before.score ? "A steady week" : "A wobblier week, and that's fine";
  const compare = before ? (last.score === before.score ? "The same as the week before" : last.score > before.score ? `Up ${last.score - before.score} on the week before` : `Down ${before.score - last.score} on the week before`) : "";
  const third = last.usedWeight ? { label: "Your trend", value: last.trend >= 1 ? "Inside your steady zone" : "A little above your zone" } : { label: "Check-ins", value: `${mornings} of 7 mornings` };
  const said = `Steady score last week ${last.score}, ${headline.toLowerCase()}. Habits ${kept} of ${aim} days, strength ${done} of ${target} sessions, ${third.label.toLowerCase()} ${third.value.toLowerCase()}.`;
  return (
    <Card tone="sage" style={card} accessible accessibilityLabel={said}>
      <View style={{ flexDirection: large ? "column" : "row", alignItems: large ? "flex-start" : "center", gap: space[4] }}>
        <ScoreRing score={last.score} />
        <View style={{ flex: large ? undefined : 1, gap: 2 }}>
          <AppText variant="label" color={accent}>STEADY SCORE · LAST WEEK</AppText>
          <AppText variant="heading" color="onPastel" style={{ fontSize: 19, lineHeight: 24 }}>{headline}</AppText>
          {compare ? <AppText variant="caption" color={accent}>{compare}</AppText> : null}
        </View>
      </View>
      <Bar label="Habits" value={`${kept} of ${aim} days`} fill={last.habits} />
      <Bar label="Strength" value={`${done} of ${target} sessions`} fill={last.sessions} />
      <Bar label={third.label} value={third.value} fill={last.trend} />
    </Card>
  );
}

export default function Progress() {
  const s = useApp(), c = useColors();
  const safe = s.settings.safeMode, bare = s.story.weightView === "trend";
  const units = s.settings.units;
  const now = avg7(s), weekAgo = avg7(s, addDays(today(), -7));
  const recent = [...s.weights].sort((a, b) => (a.date < b.date ? 1 : -1)).filter((w) => daysBetween(w.date, today()) < 10);
  return (
    <Screen contentContainerStyle={{ gap: space[5] }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ gap: 2 }}>
          <AppText variant="caption" color="inkMuted">{stageCaption(s)}</AppText>
          <AppText variant="title" accessibilityRole="header">Progress</AppText>
        </View>
        <Avatar name={s.name} />
      </View>
      <PhaseStrip s={s} />
      <ScoreCard s={s} />
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
