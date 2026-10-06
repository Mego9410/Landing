import { router } from "expo-router";
import type { ReactNode } from "react";
import { View } from "react-native";
import { space } from "@/theme";
import { AppText } from "./AppText";
import { Button } from "./Button";
import { Screen } from "./Screen";
import { IconButton, Meter } from "./ui";

export const STEPS = 6;

/** An onboarding step: progress, a title and lede, the questions, and Continue. */
export function Step({ n, title, lede, next, children, label = "Continue" }: { n: number; title: string; lede: string; next: () => void; children: ReactNode; label?: string }) {
  return (
    <Screen contentContainerStyle={{ gap: space[5], paddingBottom: 48 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
        <IconButton icon="back" label="Back" flat onPress={() => (router.canGoBack() ? router.back() : router.replace("/onboarding"))} />
        <View style={{ flex: 1 }}><Meter value={n} max={STEPS} tone="apricot" label={`Step ${n} of ${STEPS}`} /></View>
        <AppText variant="caption" color="inkMuted">{n} of {STEPS}</AppText>
      </View>
      <View style={{ gap: space[2] }}>
        <AppText variant="title" accessibilityRole="header">{title}</AppText>
        <AppText color="inkMuted">{lede}</AppText>
      </View>
      {children}
      <Button label={label} block onPress={next} />
    </Screen>
  );
}
