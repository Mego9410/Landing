import type { ReactNode } from "react";
import { View } from "react-native";
import { space } from "@/theme";
import { AppText } from "./AppText";
import { Button } from "./Button";
import { Screen } from "./Screen";
import { Header, Meter } from "./ui";

export const STEPS = 6;

/** An onboarding step: progress, a title and lede, the questions, and Continue. */
export function Step({ n, title, lede, next, children, label = "Continue" }: { n: number; title: string; lede: string; next: () => void; children: ReactNode; label?: string }) {
  return (
    <Screen contentContainerStyle={{ gap: space[5], paddingBottom: 48 }} header={
      <Header fallback="/onboarding" title={title}
        middle={<View style={{ alignSelf: "stretch" }}><Meter value={n} max={STEPS} tone="apricot" label={`Step ${n} of ${STEPS}`} /></View>}
        right={<AppText variant="caption" color="inkMuted">{n} of {STEPS}</AppText>} />
    }>
      <View style={{ gap: space[2] }}>
        <AppText variant="title" accessibilityRole="header">{title}</AppText>
        <AppText color="inkMuted">{lede}</AppText>
      </View>
      {children}
      <Button label={label} block onPress={next} />
    </Screen>
  );
}
