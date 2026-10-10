import { Redirect, router, type Href } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import Animated, { LinearTransition, useReducedMotion } from "react-native-reanimated";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { HabitCheck, Tick } from "@/components/HabitCheck";
import { QuoteCard } from "@/components/QuoteCard";
import { Icon, type IconName } from "@/components/Icon";
import { Screen } from "@/components/Screen";
import { Avatar, Choices, Field } from "@/components/ui";
import { HABITS, PHASES, READY, type Phase } from "@/data/content";
import { fmt, partOfDay, today } from "@/data/dates";
import { habitDetail, isWeekly, toggleHabit } from "@/state/habits";
import { lessonNow, lessonRead, lookBackDue, markLessonRead } from "@/state/plans";
import { gettingReady, jabWeek, monthOnPlan, needsDisclaimer, set, stageOf, useApp, yearTwoWeek } from "@/state/store";
import { notificationsAllowed, trialMessage } from "@/state/reminders";
import { askForReview } from "@/state/review";
import { sendLapseFeedback, type LapseReason } from "@/state/events";
import { install, updateInstall } from "@/state/install";
import { billingEnabled } from "@/state/subscription";
import { todayPlan, type Task, type TodayItem } from "@/state/today";
import { radius, space, useColors } from "@/theme";

/** A thing to go and do, as a compact row in the day's list. Tapping opens where it's done. */
function TaskRow({ t }: { t: Task }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${t.label}${t.done ? ", done" : ""}. ${t.detail}`} onPress={() => router.push(t.href as Href)}
      style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: space[3], minHeight: 56, paddingVertical: space[2], paddingHorizontal: space[4], opacity: pressed ? 0.7 : 1 })}>
      <Tick done={t.done} />
      <View style={{ flex: 1 }}>
        <AppText weight="700" color={t.done ? "inkMuted" : "ink"} style={t.done ? { textDecorationLine: "line-through" } : undefined}>{t.label}</AppText>
        {t.done ? null : <AppText variant="caption" color="inkMuted" numberOfLines={1}>{t.detail}</AppText>}
      </View>
    </Pressable>
  );
}

// The icon tile's tone for each kind of thing: strength sage, food butter, the check-in sky.
const TONE: Record<string, { icon: IconName; tone: "sage" | "butter" | "sky" | "lilac" | "apricot" }> = {
  session: { icon: "workout", tone: "sage" }, protein: { icon: "meal", tone: "butter" }, journal: { icon: "today", tone: "sky" }, health: { icon: "check", tone: "apricot" },
};

/** The one next thing: a task still to do (with its button), else the first habit left, else the day's done. */
function UpNext({ up, habit, done, total }: { up: Task | null; habit: string | null; done: number; total: number }) {
  const c = useColors();
  const t = up ? { title: up.label, detail: up.detail, ...(TONE[up.id] ?? { icon: up.icon, tone: "lilac" as const }) }
    : habit ? { title: HABITS[habit].label, detail: "Tick it off below when it's done", icon: "check" as IconName, tone: "lilac" as const }
    : { title: "All done for today", detail: "Rest up. Tomorrow's check-in will be here in the morning.", icon: "smile" as IconName, tone: "sage" as const };
  return (
    <Card style={{ gap: space[4], padding: space[5], borderRadius: radius.xl }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: space[2] }}>
        <AppText variant="label" color="inkMuted" accessibilityRole="header">UP NEXT</AppText>
        <View style={{ paddingVertical: 4, paddingHorizontal: space[3], borderRadius: radius.full, backgroundColor: c.surfaceSunk }}>
          <AppText variant="caption" weight="700">{done} of {total} done today</AppText>
        </View>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[4] }} accessible accessibilityLabel={`${t.title}. ${t.detail}`}>
        <View style={{ width: 54, height: 54, borderRadius: radius.md, alignItems: "center", justifyContent: "center", backgroundColor: c[t.tone] }}>
          <Icon name={t.icon} size={26} color={c.onPastel} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <AppText weight="800" style={{ fontSize: 19, lineHeight: 24 }}>{t.title}</AppText>
          <AppText variant="caption" color="inkMuted">{t.detail}</AppText>
        </View>
      </View>
      {up ? <Button variant="brand" block label={up.cta} onPress={() => router.push(up.href as Href)} />
        : habit ? null : <Button variant="brand" block label="See what shapes your days" onPress={() => router.push("/journal/insights")} />}
    </Card>
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

/** This week's lesson, as a row in the day's list until it's been opened that week. */
function LessonRow() {
  const s = useApp(), c = useColors(), pick = lessonNow(s);
  if (lessonRead(s, pick.key)) return null;
  const title = pick.refresher ? "A refresher" : "This week's lesson";
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${title}: ${pick.lesson.title}`}
      onPress={() => { set((st) => markLessonRead(st, pick.key)); router.push({ pathname: "/lesson", params: { key: pick.key } }); }}
      style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: space[3], minHeight: 56, paddingVertical: space[2], paddingHorizontal: space[4], opacity: pressed ? 0.7 : 1 })}>
      <View style={{ width: 30, height: 30, borderRadius: radius.full, alignItems: "center", justifyContent: "center", backgroundColor: c.sky }}>
        <Icon name="book" size={16} color={c.onPastel} />
      </View>
      <View style={{ flex: 1 }}>
        <AppText weight="700">{title}</AppText>
        <AppText variant="caption" color="inkMuted" numberOfLines={1}>{pick.lesson.title}</AppText>
      </View>
      <Icon name="chevron" size={18} color={c.inkMuted} />
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
  const s = useApp(), reduce = useReducedMotion();
  // New people start at the welcome screen; the health information comes during onboarding. Someone already set up
  // sees it again here only if its wording has changed.
  if (!s.onboarded) return <Redirect href="/onboarding" />;
  if (needsDisclaimer(s)) return <Redirect href="/disclaimer" />;
  if (!s.consent) return <Redirect href="/consent" />;
  const phase = stageOf(s), ready = gettingReady(s), week = jabWeek(s), two = yearTwoWeek(s);
  // Weekly habits (done once in the week) sit at the end of the list, outside the day's count.
  const all = todayPlan(s), weekly = all.filter((i) => i.kind === "habit" && isWeekly(i.id)), items = all.filter((i) => !weekly.includes(i));
  const done = items.filter((i) => i.done).length;
  const up = items.find((i): i is Task => i.kind === "task" && !i.done) ?? null;
  const habit = up ? null : items.find((i) => i.kind === "habit" && !i.done) ?? null;
  const next = up ?? habit;
  // The rest: still to do first, in their order, then what's done.
  const rest = [...items.filter((i) => i !== next && !i.done), ...items.filter((i) => i !== next && i.done)];
  const layout = reduce ? undefined : LinearTransition.duration(260);
  const row = (i: TodayItem, weeklyRow = false) => (
    <Animated.View key={i.id} layout={layout}>
      {i.kind === "task" ? <TaskRow t={i} />
        : <HabitCheck compact label={HABITS[i.id].label} detail={weeklyRow ? "Once this week" : habitDetail(s, i.id)} checked={i.done} onChange={(v) => toggleHabit(i.id, v)} />}
    </Animated.View>
  );
  return (
    <Screen contentContainerStyle={{ gap: space[4] }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: space[3] }}>
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="caption" color="inkMuted">{fmt.long(today())} · {ready ? "Getting ready" : two ? `Year two, week ${two}` : `Week ${week}`}</AppText>
          <AppText variant="title" accessibilityRole="header">Good {partOfDay()}{s.name ? `, ${s.name}` : ""}</AppText>
        </View>
        <Avatar name={s.name} />
      </View>

      <PhaseCelebration phase={phase} week={week} />
      <MonthCard />
      <TrialEnding />
      <LapseCard />
      <QuoteCard />

      <UpNext up={up} habit={habit?.id ?? null} done={done} total={items.length} />

      <View style={{ gap: space[2] }}>
        <Card style={{ padding: 0, paddingVertical: space[1], gap: 0, borderRadius: radius.lg }}>
          {rest.map((i) => row(i))}
          {weekly.map((i) => row(i, true))}
          <LessonRow />
        </Card>
        <Button label="Swap a habit" variant="quiet" onPress={() => router.push("/swap-habit")} style={{ alignSelf: "center" }} />
      </View>
    </Screen>
  );
}
