import { router } from "expo-router";
import { Pressable, useColorScheme, View } from "react-native";
import Svg, { Circle, Line, Path, Rect, Text as SvgText } from "react-native-svg";
import { AppText } from "@/components/AppText";
import { Card } from "@/components/Card";
import { Icon, type IconName } from "@/components/Icon";
import { YearCard } from "@/components/YearCard";
import { Screen } from "@/components/Screen";
import { Avatar, List, Row } from "@/components/ui";
import { HABITS } from "@/data/content";
import { addDays, daysBetween, fmt, today, weekDates, weekStart } from "@/data/dates";
import { sessionsByMonth, strengthYear } from "@/data/sessions";
import { change, weight } from "@/data/units";
import { habitWeekGrid, sessionTarget } from "@/state/habits";
import { sharePrescriberPack } from "@/state/prescriber";
import { habitSlots, recentScores, scoreHistory, weekHabits } from "@/state/score";
import { toast } from "@/state/toast";
import { describe, insights, loggedOf } from "@/state/journal";
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

const MONTH_NAME = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "Your strength year": where each pattern started and where it is now, and sessions done each month. No weight. */
function StrengthYear({ s }: { s: AppState }) {
  const c = useColors();
  const rows = strengthYear(s), moved = rows.filter((r) => r.up), months = sessionsByMonth(s);
  const total = months.reduce((a, m) => a + m.count, 0), most = Math.max(1, ...months.map((m) => m.count));
  return (
    <Card style={{ borderRadius: 24, padding: 18, gap: space[3] }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", gap: space[2], flexWrap: "wrap" }}>
        <AppText variant="heading" accessibilityRole="header" style={{ fontSize: 20 }}>Strength</AppText>
        <AppText variant="caption" color="inkMuted">{total} {total === 1 ? "session" : "sessions"} so far</AppText>
      </View>
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
      </View> : null}
      {moved.length ? <View style={{ gap: 4 }}>
        {moved.slice(0, 6).map((r) => (
          <AppText key={r.pattern} variant="caption"><AppText variant="caption" weight="800">{r.pattern}:</AppText> {r.from} → {r.to}</AppText>
        ))}
        {moved.length > 6 ? <AppText variant="caption" color="inkMuted">And {moved.length - 6} more.</AppText> : null}
        {rows.length > moved.length ? <AppText variant="caption" color="inkMuted">The others stay at the level that suits you.</AppText> : null}
      </View> : <AppText variant="caption" color="inkMuted">Your moves step up every eight weeks. This is where you&apos;ll see how far each one has come.</AppText>}
    </Card>
  );
}

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

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/** Seven circles for a habit's week: filled when done, a ring for a past day, a dashed ring for days to come. */
function DayDots({ grid }: { grid: ("done" | "missed" | "future")[] }) {
  const c = useColors();
  return (
    <View style={{ flexDirection: "row", gap: 6 }}>
      {grid.map((g, i) => (
        <View key={i} style={{ flex: 1, alignItems: "center" }}>
          <View style={{ width: "100%", maxWidth: 40, aspectRatio: 1, borderRadius: radius.full, backgroundColor: g === "done" ? c.sageInk : "transparent", borderWidth: g === "done" ? 0 : 2, borderColor: c.line, borderStyle: g === "future" ? "dashed" : "solid" }} />
        </View>
      ))}
    </View>
  );
}

/** "Monday to Saturday", "Monday, Wednesday and Friday", or "no days yet". */
function daysSaid(grid: ("done" | "missed" | "future")[]) {
  const on = grid.map((g, i) => (g === "done" ? i : -1)).filter((i) => i >= 0);
  if (!on.length) return "no days yet";
  if (on.length > 2 && on[on.length - 1] - on[0] === on.length - 1) return `${DAY_NAMES[on[0]]} to ${DAY_NAMES[on[on.length - 1]]}`;
  const names = on.map((i) => DAY_NAMES[i]);
  return names.length === 1 ? names[0] : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/** This week's habits and strength, day by day. A missed day is just an empty ring: never a cross or a warning. */
function HabitsWeek({ s }: { s: AppState }) {
  const c = useColors(), monday = weekStart(today());
  const rows = [
    ...weekHabits(s, monday).map((id) => {
      const grid = habitWeekGrid(s, id), n = grid.filter((g) => g === "done").length, target = HABITS[id].target, kept = n >= target;
      return { key: id, name: HABITS[id].label, grid, status: kept ? `${n} ${n === 1 ? "day" : "days"} · kept` : `${n} of ${target}`, n, kept, unit: "days" };
    }),
    (() => {
      const grid = habitWeekGrid(s, "sessions"), n = sessionsInWeek(s).length, target = sessionTarget(s), kept = n >= target;
      return { key: "sessions", name: "Strength sessions", grid, status: `${n} of ${target}${kept ? " · kept" : ""}`, n, kept, unit: "sessions" };
    })(),
  ];
  return (
    <Card style={{ borderRadius: 24, padding: 18, gap: space[3] }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", gap: space[2], flexWrap: "wrap" }}>
        <AppText variant="heading" accessibilityRole="header" style={{ fontSize: 20 }}>Your habits</AppText>
        <AppText variant="caption" color="inkMuted">This week so far</AppText>
      </View>
      <View style={{ flexDirection: "row", gap: 6 }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {DAY_NAMES.map((d, i) => <AppText key={i} weight="800" color="inkMuted" style={{ flex: 1, textAlign: "center", fontSize: 11 }}>{d[0]}</AppText>)}
      </View>
      {rows.map((r) => (
        <View key={r.key} style={{ gap: space[2] }} accessible
          accessibilityLabel={`${r.name}: done ${daysSaid(r.grid)}, ${r.n} ${r.n === 1 ? r.unit.slice(0, -1) : r.unit}${r.kept ? ", kept" : ""}.`}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", gap: space[2], flexWrap: "wrap" }}>
            <AppText weight="800" style={{ fontSize: 15, flexShrink: 1 }}>{r.name}</AppText>
            <AppText variant="caption" color="inkMuted">{r.status}</AppText>
          </View>
          <DayDots grid={r.grid} />
        </View>
      ))}
      <View style={{ flexDirection: "row", flexWrap: "wrap", columnGap: space[3], rowGap: 4 }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {[{ label: "Done", style: { backgroundColor: c.sageInk } }, { label: "Not this day", style: { borderWidth: 1.5, borderColor: c.line } }, { label: "Still to come", style: { borderWidth: 1.5, borderColor: c.line, borderStyle: "dashed" as const } }].map((k) => (
          <View key={k.label} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View style={[{ width: 10, height: 10, borderRadius: 5 }, k.style]} />
            <AppText variant="caption" color="inkMuted">{k.label}</AppText>
          </View>
        ))}
      </View>
    </Card>
  );
}

/** One link with a tinted 40pt tile. */
function LinkRow({ icon, tone, title, sub, onPress, first }: { icon: IconName; tone: "sky" | "butter"; title: string; sub: string; onPress: () => void; first?: boolean }) {
  const c = useColors();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${title}. ${sub}`} onPress={onPress}
      style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: space[3], minHeight: 64, paddingVertical: space[3], paddingHorizontal: space[4], borderTopWidth: first ? 0 : 1, borderColor: c.line, opacity: pressed ? 0.7 : 1 })}>
      <View style={{ width: 40, height: 40, borderRadius: radius.md, alignItems: "center", justifyContent: "center", backgroundColor: c[tone] }}>
        <Icon name={icon} size={20} color={c.onPastel} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <AppText weight="800" style={{ fontSize: 16 }}>{title}</AppText>
        <AppText variant="caption" color="inkMuted">{sub}</AppText>
      </View>
      <Icon name="chevron" size={18} color={c.inkMuted} />
    </Pressable>
  );
}

/** PR1 Progress: last week's score explained, this week's habits, the year, strength, the trend (hidden in Habit Only
 *  mode) and links to patterns and the prescriber summary. */
export default function Progress() {
  const s = useApp(), c = useColors();
  const safe = s.settings.safeMode, bare = s.story.weightView === "trend";
  const units = s.settings.units;
  const pattern = insights(s).ready.find((i) => i.lead) ?? null;
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
      <ScoreCard s={s} />
      <HabitsWeek s={s} />
      <YearCard s={s} />
      <StrengthYear s={s} />
      {safe ? (
        <Card tone="sunk" style={{ gap: 6 }}>
          <AppText weight="800">Weight is hidden in Habit Only mode</AppText>
          <AppText color="inkMuted">Your score comes from your routines. You can change this in Settings whenever you like.</AppText>
        </Card>
      ) : (
        <>
          <Card style={{ borderRadius: 24, padding: 18, gap: space[3] }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", gap: space[2], flexWrap: "wrap" }}>
              <AppText variant="heading" accessibilityRole="header" style={{ fontSize: 20 }}>Your trend</AppText>
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
      <List>
        <LinkRow first icon="today" tone="sky" title="What shapes your days" onPress={() => router.push("/journal/insights")}
          sub={pattern?.lead ? `Days with ${pattern.q.short}: ${describe(pattern.lead).toLowerCase()}` : loggedOf(s, 30) ? "Patterns from your morning check-ins" : "Patterns appear after a few morning check-ins"} />
        <LinkRow icon="doc" tone="butter" title="Summary for your prescriber" sub="Your last four weeks, to share or print"
          onPress={() => sharePrescriberPack(s).catch(() => toast("Couldn't make the summary. Try again."))} />
      </List>
    </Screen>
  );
}
