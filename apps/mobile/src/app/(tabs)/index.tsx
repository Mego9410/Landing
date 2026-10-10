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
import { Avatar, Choices, Disc, Field } from "@/components/ui";
import { HABITS, PHASES, READY, tipFor, YEAR_TWO, type Phase } from "@/data/content";
import { sessionFor } from "@/data/sessions";
import { fmt, partOfDay, today, weekdayIndex } from "@/data/dates";
import { minutes, px, thisWeek } from "@/state/food";
import { habitDetail, isWeekly, nextSession, sessionTarget, toggleHabit } from "@/state/habits";
import { lessonNow, lessonRead, lookBackDue, markLessonRead } from "@/state/plans";
import { gettingReady, jabWeek, monthOnPlan, needsDisclaimer, sessionsInWeek, set, stageOf, useApp, weeksToLastJab, yearTwoWeek, type AppState } from "@/state/store";
import { sessionsPaused } from "@/state/health";
import { notificationsAllowed, trialMessage } from "@/state/reminders";
import { askForReview } from "@/state/review";
import { sendLapseFeedback, type LapseReason } from "@/state/events";
import { install, updateInstall } from "@/state/install";
import { billingEnabled } from "@/state/subscription";
import { headline, todayPlan, type Task } from "@/state/today";
import { radius, space, useColors, useLargeText } from "@/theme";

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
        <AppText variant="numeral" color="onPastel" maxFontSizeMultiplier={1.2} style={{ fontSize: 28, lineHeight: 32 }}>{done}<AppText color="onPastel" style={{ fontSize: 16 }}>/{total}</AppText></AppText>
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
        <AppText weight="700">{line}</AppText>
        <AppText variant="caption" color="inkMuted">{detail}</AppText>
      </View>
    </Pressable>
  );
}

/** Small pill links for the jobs people come back for. */
function Shortcut({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  const c = useColors();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress}
      style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 6, minHeight: 44, paddingVertical: space[2], paddingHorizontal: space[3], borderRadius: radius.full, backgroundColor: c.surfaceRaised, borderWidth: 1.5, borderColor: c.line, opacity: pressed ? 0.7 : 1 })}>
      <Icon name={icon} size={16} color={c.ink} />
      <AppText weight="700" style={{ fontSize: 14 }}>{label}</AppText>
    </Pressable>
  );
}

function Plans() {
  const s = useApp(), large = useLargeText();
  const day = weekdayIndex(today()), m = thisWeek(s).days[day].dinner;
  const dinner = m.kind === "takeaway" ? { line: "Takeaway night", detail: "A night off cooking, planned in" }
    : m.kind === "free" || !m.recipe ? { line: "A free night", detail: "Eat out, use the freezer or pick a recipe" }
    : { line: px(s, m.recipe).name, detail: m.kind === "leftover" ? "Tonight's leftovers" : `Tonight · ${minutes(px(s, m.recipe).recipe)}` };
  const next = nextSession(s), done = sessionsInWeek(s).length, paused = sessionsPaused(s), target = sessionTarget(s);
  const strength = paused ? { line: "Waiting for a word with your GP", detail: "Your food and habits carry on" } : next ? { line: `${sessionFor(s, next).name} next`, detail: `${done} of ${target} done this week · ${sessionFor(s, next).minutes} min` } : { line: target === 2 ? "Both sessions done" : `All ${target} sessions done`, detail: "Next ones arrive on Monday" };
  return (
    <View style={{ gap: space[3] }}>
      <AppText variant="heading" accessibilityRole="header">Your plans</AppText>
      <View style={{ flexDirection: large ? "column" : "row", gap: space[3] }}>
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

/** The year at a glance: Land, Settle and Steady as one strip, sized by their weeks, filled up to this week. Empty while
 *  getting ready, and full in year two. */
function PhaseStrip({ s }: { s: AppState }) {
  const c = useColors(), phase = stageOf(s), ready = gettingReady(s), two = yearTwoWeek(s), week = ready ? 0 : jabWeek(s);
  const toGo = weeksToLastJab(s);
  const label = ready ? `${READY.name} · last jab in about ${toGo} ${toGo === 1 ? "week" : "weeks"}` : two ? `${YEAR_TWO.name} · week ${two}` : `Week ${week} of 52 · ${phase.name}`;
  return (
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
  );
}

const ORDER = ["ready", "land", "settle", "steady", "yearTwo"];

/** Once, when a new phase starts: what it's about. Closing it may be followed by Apple's rating prompt (a milestone). */
function PhaseCelebration({ phase, week }: { phase: Phase; week: number }) {
  const s = useApp();
  const seen = s.phaseSeen;
  // People who had the app before this existed start from where they are, without a card. Anyone getting ready is
  // marked as such, so week 1 gets its card when the last jab has passed.
  useEffect(() => { if (seen === undefined || (phase.key === "ready" && seen !== "ready")) set((st) => { st.phaseSeen = phase.key; }); }, [seen, phase.key]);
  if (!seen || ORDER.indexOf(phase.key) <= ORDER.indexOf(seen)) return null;
  // Only say a phase is finished when it's the one just before (not after a jump, like a corrected date).
  const done = ORDER.indexOf(seen) === ORDER.indexOf(phase.key) - 1 ? [READY, ...PHASES].find((p) => p.key === seen) ?? null : null;
  function close() {
    set((st) => { st.phaseSeen = phase.key; });
    askForReview("phase").catch(() => {});
  }
  const line = phase.key === "yearTwo" ? "A whole year of steady habits. That's a real achievement, and the habits are yours now."
    : done?.key === "ready" ? "Your last jab is behind you, and the habits you've practised are ready for the weeks ahead."
    : done ? `You've finished ${done.name}, weeks ${done.from} to ${done.to}. That's a real stretch of steady habits.`
    : `A new phase starts this week, week ${week}.`;
  return (
    <Card tone={phase.tone} style={{ gap: space[2] }}>
      <AppText variant="label" color="onPastel">{done ? `${done.name.toUpperCase()} DONE · ` : ""}WEEK {week}</AppText>
      <AppText variant="heading" color="onPastel" accessibilityRole="header">Welcome to {phase.key === "yearTwo" ? "year two" : phase.name}</AppText>
      <AppText color="onPastel">{line}</AppText>
      <AppText color="onPastel"><AppText weight="800" color="onPastel">What {phase.key === "yearTwo" ? "year two" : phase.name} is about: </AppText>{phase.focus}</AppText>
      <Button variant="secondary" label={`On to ${phase.key === "yearTwo" ? "year two" : phase.name}`} onPress={close} />
    </Card>
  );
}

/** This week's lesson, small: its title and one thing to try. Opening it marks it read. */
function LessonCard() {
  const s = useApp(), pick = lessonNow(s), read = lessonRead(s, pick.key);
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${pick.refresher ? "A refresher" : "This week's lesson"}: ${pick.lesson.title}. One thing to try: ${pick.lesson.tries[0]}${read ? ". Read" : ""}`}
      onPress={() => { if (!read) set((st) => markLessonRead(st, pick.key)); router.push({ pathname: "/lesson", params: { key: pick.key } }); }}>
      {({ pressed }) => (
        <Card tone="sky" style={{ gap: 4, opacity: pressed ? 0.85 : 1 }}>
          <AppText variant="label" color="onPastel">{pick.refresher ? "A REFRESHER" : "THIS WEEK'S LESSON"}{read ? " · READ" : ""}</AppText>
          <AppText weight="800" color="onPastel" style={{ fontSize: 17 }}>{pick.lesson.title}</AppText>
          <AppText variant="caption" color="onPastel">Try this: {pick.lesson.tries[0]}</AppText>
        </Card>
      )}
    </Pressable>
  );
}

/** Every four weeks on the plan: one calm card offering a look back at the month. Closing it hides it until next time. */
function MonthCard() {
  const s = useApp();
  if (!lookBackDue(s)) return null;
  const m = monthOnPlan(s), close = () => set((st) => { st.lookBackSeen = m; });
  return (
    <Card tone="butter" style={{ gap: space[2] }}>
      <AppText variant="label" color="onPastel">FOUR WEEKS ON</AppText>
      <AppText weight="800" color="onPastel" style={{ fontSize: 17 }}>Your month, in two minutes</AppText>
      <AppText color="onPastel">Check-ins, sessions and the habit you kept most, with a chance to keep, change or swap a habit.</AppText>
      <View style={{ flexDirection: "row", gap: space[2], flexWrap: "wrap" }}>
        <Button variant="secondary" label="Have a look" onPress={() => router.push("/look-back")} />
        <Button variant="quiet" label="Not now" onPress={close} />
      </View>
    </Card>
  );
}

const LAPSE_OPTIONS: { id: LapseReason; label: string }[] = [
  { id: "cost", label: "The cost" }, { id: "got_what_i_needed", label: "I got what I needed" }, { id: "not_enough_time", label: "Not enough time" },
  { id: "didnt_suit_me", label: "It didn't suit me" }, { id: "other", label: "Something else" },
];

/** Once, after someone cancels (their plan won't renew): one optional question. Never blocks anything; closing it or
 *  answering it hides it for that cancellation. */
function LapseCard() {
  const sub = useApp().subscription;
  const key = sub && !sub.willRenew && (sub.active || sub.ended) ? sub.until ?? "ended" : null;
  const [show, setShow] = useState(false);
  const [reason, setReason] = useState<LapseReason | null>(null);
  const [note, setNote] = useState("");
  const [state, setState] = useState<"ask" | "sending" | "thanks" | "error">("ask");
  useEffect(() => {
    let live = true;
    if (key && billingEnabled()) install().then((i) => { if (live) setShow(i.lapseFor !== key); }).catch(() => {});
    return () => { live = false; };
  }, [key]);
  if (!show || !key) return null;
  const close = () => { setShow(false); updateInstall({ lapseFor: key }).catch(() => {}); };
  function send() {
    if (!reason) return;
    setState("sending");
    sendLapseFeedback(reason, reason === "other" || note ? note : "").then(() => { setState("thanks"); updateInstall({ lapseFor: key! }).catch(() => {}); }, () => setState("error"));
  }
  if (state === "thanks") {
    return (
      <Card style={{ gap: space[2] }}>
        <AppText weight="800">Thank you</AppText>
        <AppText color="inkMuted">That really helps. Your plan, logs and everything else stay on this phone, and you can export them in Settings whenever you like.</AppText>
        <Button variant="quiet" label="Close" onPress={() => setShow(false)} style={{ alignSelf: "flex-start" }} />
      </Card>
    );
  }
  return (
    <Card style={{ gap: space[3] }}>
      <View style={{ gap: 4 }}>
        <AppText weight="800" accessibilityRole="header">Sorry to see you go</AppText>
        <AppText color="inkMuted">What&apos;s the main reason? It&apos;s optional, and it helps us make Steadie better.</AppText>
      </View>
      <Choices label="Main reason" value={reason ?? ("" as LapseReason)} onChange={(v) => setReason(v as LapseReason)} options={LAPSE_OPTIONS} />
      {reason ? <Field label={reason === "other" ? "Tell us a little more (optional)" : "Anything to add? (optional)"} value={note} onChangeText={setNote} maxLength={500} placeholder="A few words" /> : null}
      {state === "error" ? <AppText variant="caption" color="roseInk">Couldn&apos;t send that just now. Check your connection and try again.</AppText> : null}
      <View style={{ flexDirection: "row", gap: space[2], flexWrap: "wrap" }}>
        <Button label={state === "sending" ? "Sending…" : "Send"} disabled={!reason || state === "sending"} onPress={send} />
        <Button variant="quiet" label="No thanks" onPress={close} />
      </View>
    </Card>
  );
}

/** In the last two days of a free trial that will turn into a subscription, the trial reminder's message, here instead,
 *  for anyone who hasn't allowed notifications (so never got it). */
function TrialEnding() {
  const sub = useApp().subscription;
  const until = sub?.trial && sub.willRenew ? sub.until ?? null : null;
  const [show, setShow] = useState(false);
  useEffect(() => {
    const left = until ? new Date(until).getTime() - Date.now() : -1;
    const inWindow = left > 0 && left <= 2 * 24 * 60 * 60 * 1000;
    notificationsAllowed().then((ok) => setShow(inWindow && !ok), () => setShow(inWindow));
  }, [until]);
  if (!show || !until) return null;
  const m = trialMessage(until);
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
  const s = useApp(), largeText = useLargeText();
  // New people start at the welcome screen; the health information comes during onboarding. Someone already set up
  // sees it again here only if its wording has changed.
  if (!s.onboarded) return <Redirect href="/onboarding" />;
  if (needsDisclaimer(s)) return <Redirect href="/disclaimer" />;
  if (!s.consent) return <Redirect href="/consent" />;
  const phase = stageOf(s), ready = gettingReady(s), week = jabWeek(s), two = yearTwoWeek(s);
  const nextPhase = ready ? null : phase.key === "steady" ? YEAR_TWO : PHASES[PHASES.indexOf(phase) + 1];
  // Weekly habits (done once in the week) sit below the day's list, outside the ring.
  const all = todayPlan(s), weekly = all.filter((i) => i.kind === "habit" && isWeekly(i.id)), items = all.filter((i) => !weekly.includes(i));
  const done = items.filter((i) => i.done).length;
  const up = items.find((i): i is Task => i.kind === "task" && !i.done), habitsLeft = items.some((i) => i.kind === "habit" && !i.done);
  const part = partOfDay(), large = largeText;
  const tip = { label: part === "evening" ? "TIP FOR TONIGHT" : "TIP FOR TODAY", text: tipFor(phase.key, today(), part === "evening") };
  const where = ready ? READY.name.toUpperCase() : two ? `YEAR TWO · WEEK ${two}` : `WEEK ${week} · ${phase.name.toUpperCase()}`;
  const ahead = ready ? " Week 1 begins after your last jab." : nextPhase ? ` ${nextPhase.from - week} ${nextPhase.from - week === 1 ? "week" : "weeks"} until ${nextPhase.key === "yearTwo" ? "year two" : nextPhase.name}.` : "";
  return (
    <Screen>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: space[3] }}>
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="caption" color="inkMuted">{fmt.long(today())}</AppText>
          <AppText variant="title" accessibilityRole="header">Good {part}{s.name ? `, ${s.name}` : ""}</AppText>
        </View>
        <Avatar name={s.name} />
      </View>

      <PhaseStrip s={s} />
      <PhaseCelebration phase={phase} week={week} />
      <MonthCard />
      <TrialEnding />
      <LapseCard />

      <Card tone="apricot" hero style={{ gap: space[4] }}>
        <View style={{ flexDirection: large ? "column" : "row", alignItems: large ? "flex-start" : "center", gap: space[4] }}>
          <DayRing done={done} total={items.length} />
          <View style={{ flex: 1, gap: 4 }}>
            <AppText variant="label" color="onPastel">{where}</AppText>
            <AppText variant="heading" color="onPastel" style={{ fontSize: 22, lineHeight: 26 }}>{headline(done, items.length)}</AppText>
            <AppText variant="caption" color="onPastel">
              {up ? "Small steps that add up to a steady week." : habitsLeft ? "Just your habits left. Tick them off below as you do them." : "Rest up. Tomorrow's check-in will be here in the morning."}
              {ahead}
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
        {weekly.length ? <AppText variant="label" color="inkMuted" style={{ marginTop: space[2] }}>ONCE THIS WEEK</AppText> : null}
        {weekly.map((i) => <HabitCheck key={i.id} label={HABITS[i.id].label} detail={habitDetail(s, i.id)} checked={i.done} onChange={(v) => toggleHabit(i.id, v)} />)}
        <Button label="Swap a habit" variant="quiet" onPress={() => router.push("/swap-habit")} style={{ alignSelf: "center" }} />
      </View>

      <LessonCard />

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
