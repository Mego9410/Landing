import { router } from "expo-router";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Screen } from "@/components/Screen";
import { Header, RowCard } from "@/components/ui";
import { SESSIONS } from "@/data/content";
import { useApp } from "@/state/store";
import { space } from "@/theme";

/** W1 This week's sessions. */
export default function Sessions() {
  const s = useApp();
  return (
    <Screen contentContainerStyle={{ gap: space[5], paddingBottom: 48 }}>
      <Header fallback="/" />
      <AppText variant="title" accessibilityRole="header">This week&apos;s sessions</AppText>
      <AppText color="inkMuted">Two short strength sessions at home. Every move has an easier version.</AppText>
      {(["A", "B"] as const).map((k) => {
        const done = s.workouts.done[k];
        return (
          <RowCard key={k} tone={done ? "sage" : "raised"} onPress={() => router.push({ pathname: "/workouts/[id]", params: { id: k } })}>
            <View style={{ flex: 1, gap: 2 }}>
              <AppText variant="label" color={done ? "onPastel" : "inkMuted"}>{done ? `DONE ON ${done.toUpperCase()}` : "TO DO"}</AppText>
              <AppText weight="800" color={done ? "onPastel" : "ink"} style={{ fontSize: 16 }}>{SESSIONS[k].name}</AppText>
              <AppText variant="caption" color={done ? "onPastel" : "inkMuted"}>{SESSIONS[k].minutes} minutes · {SESSIONS[k].moves.length} exercises</AppText>
            </View>
          </RowCard>
        );
      })}
    </Screen>
  );
}
