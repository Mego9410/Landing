import { router } from "expo-router";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Screen } from "@/components/Screen";
import { Header, RowCard, SessionHealth } from "@/components/ui";
import { sessionFor } from "@/data/sessions";
import { fmt } from "@/data/dates";
import { sessionDoneOn } from "@/state/habits";
import { sessionNotes, sessionsPaused } from "@/state/health";
import { set, useApp } from "@/state/store";
import { toast } from "@/state/toast";
import { space } from "@/theme";

/** W1 This week's sessions. */
export default function Sessions() {
  const s = useApp();
  return (
    <Screen contentContainerStyle={{ gap: space[5], paddingBottom: 48 }}>
      <Header fallback="/" />
      <AppText variant="title" accessibilityRole="header">This week&apos;s sessions</AppText>
      <AppText color="inkMuted">Two short strength sessions at home. Most moves have an easier version.</AppText>
      <SessionHealth paused={sessionsPaused(s)} notes={sessionNotes(s)} onCleared={() => { set((st) => { st.health.gpCleared = true; }); toast("Thanks. Your sessions are ready."); }} />
      {(["A", "B"] as const).map((k) => {
        const on = sessionDoneOn(s, k), done = on ? fmt.weekday(on) : null;
        return (
          <RowCard key={k} tone={done ? "sage" : "raised"} onPress={() => router.push({ pathname: "/workouts/[id]", params: { id: k } })}>
            <View style={{ flex: 1, gap: 2 }}>
              <AppText variant="label" color={done ? "onPastel" : "inkMuted"}>{done ? `DONE ON ${done.toUpperCase()}` : "TO DO"}</AppText>
              <AppText weight="800" color={done ? "onPastel" : "ink"} style={{ fontSize: 16 }}>{sessionFor(s, k).name}</AppText>
              <AppText variant="caption" color={done ? "onPastel" : "inkMuted"}>{sessionFor(s, k).minutes} minutes · {sessionFor(s, k).moves.length} exercises</AppText>
            </View>
          </RowCard>
        );
      })}
    </Screen>
  );
}
