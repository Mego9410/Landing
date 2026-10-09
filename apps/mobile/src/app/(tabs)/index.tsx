import { Redirect, router, type Href } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { HabitCheck } from "@/components/HabitCheck";
import { Icon, type IconName } from "@/components/Icon";
import { Screen } from "@/components/Screen";
import { Avatar, Disc } from "@/components/ui";
import { HABITS, phaseOf, PHASES, TIPS } from "@/data/content";
import { sessionFor } from "@/data/sessions";
import { fmt, partOfDay, today, weekdayIndex } from "@/data/dates";
import { minutes, px, thisWeek } from "@/state/food";
import { habitDetail, nextSession, sessionTarget, toggleHabit } from "@/state/habits";
import { needsDisclaimer, sessionsInWeek, useApp, weekOf } from "@/state/store";
import { sessionsPaused } from "@/state/health";
import { notificationsAllowed, trialMessage } from "@/state/reminders";
import { headline, todayPlan, type Task } from "@/state/today";
import { radius, space, useColors } from "@/theme";

/** The day as a ring of segments, one per thing in today's plan, filled as they're done. Echoes the brand's sun. */
function DayRing({ done, total }: { done: number; total: number }) {
  const c = useColors();
  const size = 96, r = 40, cx = size / 2, gap = total > 1 ? 0.22 : 0;
  const arc = (i: number) => {
    const a0 = (i / total) * 2 * Math.PI + gap / 2 - Math.PI / 2, a1 = ((i + 1) / total) * 2 * Math.PI - gap / 2 - Math.PI / 2;
    const p = (a: number) => `${(cx + r * Math.cos(a)).toFixed(2)},${(cx + r * Math.sin(a)).toFixed(2)}`;
    return `M${p(a0)} A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p(a1)}`;
  };
  return (
    <View accessible accessibilityLabel={`${done} of ${total} done today`} style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {total === 1 ? <Circle cx={cx} cy={cx} r={r} stroke={c.onPastel} strokeOpacity={done ? 1 : 0.18} strokeWidth={9} fill="none" />
          : Array.from({ length: total }, (_, i) => (
            <Path key={i} d={arc(i)} stroke={c.onPastel} strokeOpacity={i < done ? 1 : 0.18} strokeWidth={9} strokeLinecap="round" fill="none" />
          ))}
      </Svg>
      <View style={{ position: "absolute", inset: 0, alignItems: "center", justifyContent: "center" }}>
        <AppText variant="numeral" color="onPastel" style={{ fontSize: 28, lineHeight: 32 }}>{done}<AppText color="onPastel" style={{ fontSize: 16 }}>/{total}</AppText></AppText>
      </View>
    </View>
  );
}

/** A thing to go and do, laid out like a habit so the day reads as one list. Tapping opens where it's done. */
function TaskRow({ t }: { t: Task }) {
  const c = useColors();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${t.label}${t.done ? ", done" : ""}. ${t.detail}`} onPress={() => router.push(t.href as Href)}
      style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: space[3], paddingVertical: space[3], paddingHorizontal: space[4], borderRadius: radius.md,
        backgroundColor: t.done ? c.sage : c.surfaceRaised, opacity: pressed ? 0.85 : 1 })}>
      <View style={{ width: 32, height: 32, borderRadius: radius.full, alignItems: "center", justifyContent: "center", backgroundColor: t.done ? c.onPastel : c.surfaceSunk }}>
        <Icon name={t.done ? "check" : t.icon} size={18} color={t.done ? c.sage : c.ink} />
      </View>
      <View style={{ flex: 1 }}>
        <AppText weight="700" color={t.done ? "onPastel" : "ink"}>{t.label}</AppText>
        <AppText variant="caption" color={t.done ? "onPastel" : "inkMuted"}>{t.detail}</AppText>
      </View>
      <Icon name="chevron" size={18} color={t.done ? c.onPastel : c.inkMuted} />
    </Pressable>
  );
}

/** A big way into one of the two plans, with what it holds for today. */
function PlanTile({ icon, tone, title, line, detail, onPress }: { icon: IconName; tone: "apricot" | "sage"; title: string; line: string; detail: string; onPress: () => void }) {
  const c = useColors();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${title}. ${line}. ${detail}`} onPress={onPress}
      style={({ pressed }) => ({ flex: 1, gap: space[3], padding: space[4], borderRadius: radius.lg, backgroundColor: c.surfaceRaised, opacity: pressed ? 0.85 : 1,
        shadowColor: "#6b4a30", shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 })}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Disc icon={icon} tone={tone} size={44} />
        <Icon name="chevron" size={18} color={c.inkMuted} />
      </View>
      <View style={{ gap: 2 }}>
        <AppText variant="heading" style={{ fontSize: 18, lineHeight: 22 }}>{title}</AppText>
        <AppText weight="700" numberOfLines={2}>{line}</AppText>
        <AppText variant="caption" color="inkMuted" numberOfLines={2}>{detail}</AppText>
      </View>
    </Pressable>
  );
}

/** Small pill links for the jobs people come back for. */
function Shortcut({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  const c = useColors();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}
      style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 6, height: 40, paddingHorizontal: space[3], borderRadius: radius.full, backgroundColor: c.surfaceRaised, borderWidth: 1.5, borderColor: c.line, opacity: pressed ? 0.7 : 1 })}>
      <Icon name={icon} size={16} color={c.ink} />
      <AppText weight="700" style={{ fontSize: 14 }}>{label}</AppText>
    </Pressable>
  );
}

function Plans() {
  const s = useApp();
  const day = weekdayIndex(today()), m = thisWeek(s).days[day].dinner;
  const dinner = m.kind === "takeaway" ? { line: "Takeaway night", detail: "A night off cooking, planned in" }
    : m.kind === "free" || !m.recipe ? { line: "A free night", detail: "Eat out, use the freezer or pick a recipe" }
    : { line: px(s, m.recipe).name, detail: m.kind === "leftover" ? "Tonight's leftovers" : `Tonight · ${minutes(px(s, m.recipe).recipe)}` };
  const next = nextSession(s), done = sessionsInWeek(s).length, paused = sessionsPaused(s);
  const strength = paused ? { line: "Waiting for a word with your GP", detail: "Your food and habits carry on" } : next ? { line: `${sessionFor(s, next).name} next`, detail: `${done} of ${sessionTarget(s)} done this week · ${sessionFor(s, next).minutes} min` } : { line: "Both sessions done", detail: "Next ones arrive on Monday" };
  return (
    <View style={{ gap: space[3] }}>
      <AppText variant="heading" accessibilityRole="header">Your plans</AppText>
      <View style={{ flexDirection: "row", gap: space[3] }}>
        <PlanTile icon="meal" tone="apricot" title="Meal plan" line={dinner.line} detail={dinner.detail} onPress={() => router.push("/meals")} />
        <PlanTile icon="workout" tone="sage" title="Strength plan" line={strength.line} detail={strength.detail} onPress={() => router.push("/workouts")} />
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
        <Shortcut icon="basket" label="Shopping list" onPress={() => router.push({ pathname: "/meals/shopping", params: { which: "this" } })} />
        <Shortcut icon="doc" label="Recipes" onPress={() => router.push("/meals/recipes")} />
        <Shortcut icon="plan" label={s.food.next ? "Next week's meals" : "Plan next week"} onPress={() => router.push("/meals/next")} />
      </View>
    </View>
  );
}

/** In the last two days of a free trial that will turn into a subscription, the trial reminder's message, here instead,
 *  for anyone who hasn't allowed notifications (so never got it). */
function TrialEnding() {
  const sub = useApp().subscription;
  const [allowed, setAllowed] = useState(true);
  useEffect(() => { notificationsAllowed().then(setAllowed, () => setAllowed(false)); }, []);
  if (allowed || !sub?.trial || !sub.willRenew || !sub.until) return null;
  const left = new Date(sub.until).getTime() - Date.now();
  if (left <= 0 || left > 2 * 24 * 60 * 60 * 1000) return null;
  const m = trialMessage(sub.until);
  return (
    <Card style={{ gap: 6 }}>
      <AppText weight="800">{m.title}</AppText>
      <AppText color="inkMuted">{m.body}</AppText>
      <Pressable accessibilityRole="button" onPress={() => router.push("/settings")} style={{ alignSelf: "flex-start", paddingVertical: space[2], minHeight: 44, justifyContent: "center" }}>
        <AppText weight="800" style={{ textDecorationLine: "underline" }}>Your subscription in Settings</AppText>
      </Pressable>
    </Card>
  );
}

export default function Today() {
  const s = useApp();
  // New people start at the welcome screen; the health information comes during onboarding. Someone already set up
  // sees it again here only if its wording has changed.
  if (!s.onboarded) return <Redirect href="/onboarding" />;
  if (needsDisclaimer(s)) return <Redirect href="/disclaimer" />;
  if (!s.consent) return <Redirect href="/consent" />;
  const week = weekOf(s), phase = phaseOf(week), nextPhase = PHASES[PHASES.indexOf(phase) + 1];
  const items = todayPlan(s), done = items.filter((i) => i.done).length;
  const up = items.find((i): i is Task => i.kind === "task" && !i.done), habitsLeft = items.some((i) => i.kind === "habit" && !i.done);
  const part = partOfDay(), tip = part === "evening" ? TIPS.evening : TIPS.day;
  return (
    <Screen>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: space[3] }}>
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="caption" color="inkMuted">{fmt.long(today())}</AppText>
          <AppText variant="title" accessibilityRole="header">Good {part}{s.name ? `, ${s.name}` : ""}</AppText>
        </View>
        <Avatar name={s.name} />
      </View>

      <TrialEnding />

      <Card tone="apricot" hero style={{ gap: space[4] }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: space[4] }}>
          <DayRing done={done} total={items.length} />
          <View style={{ flex: 1, gap: 4 }}>
            <AppText variant="label" color="onPastel">WEEK {week} · {phase.name.toUpperCase()}</AppText>
            <AppText variant="heading" color="onPastel" style={{ fontSize: 22, lineHeight: 26 }}>{headline(done, items.length)}</AppText>
            <AppText variant="caption" color="onPastel">
              {up ? "Small steps that add up to a steady week." : habitsLeft ? "Just your habits left. Tick them off below as you do them." : "Rest up. Tomorrow's check-in will be here in the morning."}
              {nextPhase ? ` ${nextPhase.from - week} ${nextPhase.from - week === 1 ? "week" : "weeks"} until ${nextPhase.name}.` : ""}
            </AppText>
          </View>
        </View>
        {up ? <Button variant="secondary" block label={up.cta} onPress={() => router.push(up.href as Href)} />
          : habitsLeft ? null : <Button variant="secondary" block label="See what shapes your days" onPress={() => router.push("/journal/insights")} />}
      </Card>

      <Plans />

      <View style={{ gap: space[3] }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <AppText variant="heading" accessibilityRole="header">Today&apos;s plan</AppText>
          <AppText variant="caption" color="inkMuted">{done} of {items.length} done</AppText>
        </View>
        {items.map((i) => i.kind === "task" ? <TaskRow key={i.id} t={i} />
          : <HabitCheck key={i.id} label={HABITS[i.id].label} detail={habitDetail(s, i.id)} checked={i.done} onChange={(v) => toggleHabit(i.id, v)} />)}
        <Button label="Swap a habit" variant="quiet" onPress={() => router.push("/swap-habit")} style={{ alignSelf: "center" }} />
      </View>

      <Card tone="lilac" style={{ gap: 6 }}>
        <AppText variant="label" color="onPastel">{tip.label}</AppText>
        <AppText variant="bodyLg" color="onPastel">{tip.text}</AppText>
        <Pressable accessibilityRole="button" onPress={() => router.push("/coach")} style={{ alignSelf: "flex-start", paddingVertical: space[2] }}>
          <AppText weight="800" color="onPastel" style={{ textDecorationLine: "underline" }}>Ask the coach for more ideas</AppText>
        </Pressable>
      </Card>
    </Screen>
  );
}
