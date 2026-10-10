import { router } from "expo-router";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Chip } from "@/components/Chip";
import { HabitCheck } from "@/components/HabitCheck";
import { Screen } from "@/components/Screen";
import { Header, RowCard } from "@/components/ui";
import { HABITS } from "@/data/content";
import { sessionFor } from "@/data/sessions";
import { lessonNow, lessonRead, markLessonRead } from "@/state/plans";
import { gettingReady, jabWeek, monthOnPlan, set, stageOf, useApp, weeksToLastJab, yearTwoWeek } from "@/state/store";
import { space } from "@/theme";
import { habitDetail, isTicked, sessionDoneOn, toggleHabit } from "@/state/habits";
import { fmt } from "@/data/dates";

/** PL2 Week detail: the lesson, the three habits and the two sessions. */
export default function Week() {
  const s = useApp();
  const phase = stageOf(s), pick = lessonNow(s), lesson = pick.lesson, read = lessonRead(s, pick.key);
  const chip = gettingReady(s) ? `${phase.name} · last jab in about ${weeksToLastJab(s)} ${weeksToLastJab(s) === 1 ? "week" : "weeks"}`
    : yearTwoWeek(s) ? `${phase.name} · week ${yearTwoWeek(s)}` : `${phase.name} · week ${jabWeek(s)}`;
  // Session habits are the sessions below, so they aren't ticked here.
  const habits = s.habits.ids.filter((id) => HABITS[id] && HABITS[id].kind !== "sessions");
  return (
    <Screen header={<Header fallback="/plan" middle={<Chip label={chip} tone={phase.tone} />} title={lesson.week} />} contentContainerStyle={{ gap: space[5] }}>
      <View style={{ gap: space[2] }}>
        <AppText variant="display" style={{ fontSize: 36, lineHeight: 40 }}>{lesson.week}</AppText>
        <AppText variant="bodyLg" color="inkMuted">{lesson.blurb}</AppText>
      </View>
      <RowCard tone="lilac" onPress={() => { if (!read) set((st) => markLessonRead(st, pick.key)); router.push({ pathname: "/lesson", params: { key: pick.key } }); }}>
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="label" color="onPastel">{pick.refresher ? "A REFRESHER" : "THIS WEEK'S LESSON"}</AppText>
          <AppText weight="800" color="onPastel" style={{ fontSize: 16 }}>{lesson.title}</AppText>
          <AppText variant="caption" color="onPastel">{read ? "Read · 3 minute read" : "3 minute read"}</AppText>
        </View>
      </RowCard>
      <View style={{ gap: space[3] }}>
        <AppText variant="heading">Habits</AppText>
        {habits.map((id) => <HabitCheck key={id} label={HABITS[id].label} detail={habitDetail(s, id)} checked={isTicked(s, id)} onChange={(v) => toggleHabit(id, v)} />)}
      </View>
      <View style={{ gap: space[3] }}>
        <AppText variant="heading">Sessions</AppText>
        {(["A", "B"] as const).map((k) => { const on = sessionDoneOn(s, k); return (
          <RowCard key={k} tone={on ? "sage" : "raised"} onPress={() => router.push({ pathname: "/workouts/[id]", params: { id: k } })}>
            <View style={{ flex: 1, gap: 2 }}>
              <AppText weight="800" color={on ? "onPastel" : "ink"}>{sessionFor(s, k).name}</AppText>
              <AppText variant="caption" color={on ? "onPastel" : "inkMuted"}>{on ? `Done on ${fmt.weekday(on)}` : `${sessionFor(s, k).minutes} minutes · ${sessionFor(s, k).moves.length} exercises`}</AppText>
            </View>
          </RowCard>
        ); })}
      </View>
      {monthOnPlan(s) >= 1 ? (
        <RowCard onPress={() => router.push("/look-back")}>
          <View style={{ flex: 1, gap: 2 }}>
            <AppText weight="800">Your last month</AppText>
            <AppText variant="caption" color="inkMuted">A short look back at the past four weeks</AppText>
          </View>
        </RowCard>
      ) : null}
    </Screen>
  );
}
