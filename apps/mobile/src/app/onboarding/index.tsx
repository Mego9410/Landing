import { router } from "expo-router";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { demoState, replace } from "@/state/store";
import { radius, space, useColors } from "@/theme";

/** O0 Welcome. */
export default function Welcome() {
  const c = useColors();
  return (
    <Screen contentContainerStyle={{ gap: space[6], paddingBottom: 48, flexGrow: 1 }}>
      <View accessible={false} style={{ height: 260, borderRadius: radius.xl, backgroundColor: c.sky, overflow: "hidden" }}>
        <View style={{ position: "absolute", left: -30, bottom: 30, right: -30, height: 90, borderRadius: 45, backgroundColor: c.sage }} />
        <View style={{ position: "absolute", right: 50, top: 50, width: 90, height: 90, borderRadius: 45, backgroundColor: c.apricot }} />
        <View style={{ position: "absolute", left: 40, top: 40, width: 60, height: 28, borderRadius: 14, backgroundColor: c.butter }} />
      </View>
      <View style={{ gap: space[3] }}>
        <AppText variant="display" accessibilityRole="header">Keep what you&apos;ve worked for.</AppText>
        <AppText variant="bodyLg" color="inkMuted">The 12-month plan for the year after your jab. Strength, protein and steady habits, with support on your side.</AppText>
      </View>
      <View style={{ gap: space[2], marginTop: "auto" }}>
        <Button label="Get started" block onPress={() => router.push("/onboarding/start")} />
        <Button label="Skip to the demo" variant="quiet" style={{ alignSelf: "center" }} onPress={() => { replace(demoState()); router.replace("/"); }} />
      </View>
    </Screen>
  );
}
