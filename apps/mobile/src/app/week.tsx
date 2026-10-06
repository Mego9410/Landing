import { router } from "expo-router";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Chip } from "@/components/Chip";
import { HabitCheck } from "@/components/HabitCheck";
import { Screen } from "@/components/Screen";
import { Header, RowCard } from "@/components/ui";
import { HABITS, LESSONS, phaseOf, SESSIONS } from "@/data/content";
import { useApp, weekOf } from "@/state/store";
import { space } from "@/theme";
import { habitDetail, isTicked, sessionDoneOn, toggleHabit } from "@/state/habits";
import { fmt } from "@/data/dates";

/** PL2 Week detail: the lesson, the three habits and the two sessions. */
export default function Week() {
  const s = useApp();
  const week = weekOf(s), phase = phaseOf(week), lesson = LESSONS[phase.key];
  return (
    <Screen contentContainerStyle={{ gap: space[5] }}>
      <Header fallback="/plan" middle={<Chip label={`${phase.name} · week ${week}`} tone={phase.tone} />} />
      <View style={{ gap: space[2] }}>
        <AppText variant="display" style={{ fontSize: 36, lineHeight: 40 }}>{lesson.week}</AppText>
        <AppText variant="bodyLg" color="inkMuted">{lesson.blurb}</AppText>
      </View>
      <RowCard tone="lilac" onPress={() => router.push("/lesson")}>
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="label" color="onPastel">THIS WEEK&apos;S LESSON</AppText>
          <AppText weight="800" color="onPastel" style={{ fontSize: 16 }}>{lesson.title}</AppText>
          <AppText variant="caption" color="onPastel">{s.lessonsRead[week] ? "Read · 3 minute read" : "3 minute read"}</AppText>
        </View>
      </RowCard>
      <View style={{ gap: space[3] }}>
        <AppText variant="heading">Habits</AppText>
        {s.habits.ids.map((id) => <HabitCheck key={id} label={HABITS[id].label} detail={habitDetail(s, id)} checked={isTicked(s, id)} onChange={(v) => toggleHabit(id, v)} />)}
      </View>
      <View style={{ gap: space[3] }}>
        <AppText variant="heading">Sessions</AppText>
        {(["A", "B"] as const).map((k) => { const on = sessionDoneOn(s, k); return (
          <RowCard key={k} tone={on ? "sage" : "raised"} onPress={() => router.push({ pathname: "/workouts/[id]", params: { id: k } })}>
            <View style={{ flex: 1, gap: 2 }}>
              <AppText weight="800" color={on ? "onPastel" : "ink"}>{SESSIONS[k].name}</AppText>
              <AppText variant="caption" color={on ? "onPastel" : "inkMuted"}>{on ? `Done on ${fmt.weekday(on)}` : `${SESSIONS[k].minutes} minutes · ${SESSIONS[k].moves.length} exercises`}</AppText>
            </View>
          </RowCard>
        ); })}
      </View>
    </Screen>
  );
}
