import { router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Icon } from "@/components/Icon";
import { Screen } from "@/components/Screen";
import { Choices } from "@/components/ui";
import { sessionsInWeek, set, useApp } from "@/state/store";
import { space, useColors } from "@/theme";

/** W4 Session done. */
export default function SessionDone() {
  const s = useApp(), c = useColors();
  useLocalSearchParams<{ id: string }>();
  const done = sessionsInWeek(s), both = done.includes("A") && done.includes("B");
  return (
    <Screen contentContainerStyle={{ gap: space[6], paddingBottom: 48 }}>
      <View style={{ height: 180, alignItems: "center", justifyContent: "center" }}>
        <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: c.apricot, alignItems: "center", justifyContent: "center" }}>
          <Icon name="check" size={44} color={c.onPastel} strokeWidth={2.4} />
        </View>
      </View>
      <View style={{ gap: space[2], alignItems: "center" }}>
        <AppText variant="display" style={{ fontSize: 36, lineHeight: 40 }}>Session done</AppText>
        <AppText variant="bodyLg" style={{ textAlign: "center" }}>{both ? "That's both strength sessions this week. Your muscles thank you." : "One down, one to go this week. Nicely done."}</AppText>
      </View>
      <Card style={{ gap: 12 }}>
        <AppText variant="label">HOW DID THAT FEEL?</AppText>
        <Choices label="How it felt" value={s.workouts.feel ?? "Just right"} onChange={(v) => set((st) => { st.workouts.feel = v as string; })}
          options={["Too easy", "Just right", "Tough"].map((x) => ({ id: x, label: x }))} />
        <AppText variant="caption" color="inkMuted">We use this to adjust next week&apos;s sessions.</AppText>
      </Card>
      <Button label="Back to Today" block onPress={() => router.dismissTo("/")} />
    </Screen>
  );
}
