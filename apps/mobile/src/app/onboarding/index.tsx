import { Redirect, router } from "expo-router";
import { Pressable, View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Mark } from "@/components/Mark";
import { Screen } from "@/components/Screen";
import { demoState, needsDisclaimer, replace, useApp } from "@/state/store";
import { accountsAvailable } from "@/state/account";
import { toast } from "@/state/toast";
import { radius, space, useColors } from "@/theme";

/** O0 Welcome. Holding the picture for three seconds opens the demo (Hannah, six weeks in): for previews and App Review. */
export default function Welcome() {
  const c = useColors(), s = useApp();
  if (needsDisclaimer(s)) return <Redirect href="/disclaimer" />;
  return (
    <Screen contentContainerStyle={{ gap: space[6], paddingBottom: 48, flexGrow: 1 }}>
      <Pressable accessible={false} delayLongPress={3000} onLongPress={() => { replace({ ...demoState(), disclaimer: s.disclaimer }); toast("Demo mode: Hannah, six weeks in."); router.replace("/"); }} style={{ height: 260, borderRadius: radius.xl, backgroundColor: c.sky, overflow: "hidden" }}>
        <View style={{ position: "absolute", left: -30, bottom: 30, right: -30, height: 90, borderRadius: 45, backgroundColor: c.sage }} />
        <View style={{ position: "absolute", right: 46, bottom: 104 }}><Mark height={128} hole={c.sky} /></View>
        <View style={{ position: "absolute", left: 40, top: 40, width: 60, height: 28, borderRadius: 14, backgroundColor: c.butter }} />
      </Pressable>
      <View style={{ gap: space[3] }}>
        <AppText variant="display" accessibilityRole="header">Keep what you&apos;ve worked for.</AppText>
        <AppText variant="bodyLg" color="inkMuted">The 12-month plan for the year after your jab. Strength, protein and steady habits, with support on your side.</AppText>
      </View>
      <View style={{ gap: space[2], marginTop: "auto" }}>
        <Button label="Get started" block onPress={() => router.push(accountsAvailable() ? "/onboarding/account" : "/onboarding/start")} />
        {accountsAvailable() ? <Button label="I already have an account" variant="quiet" onPress={() => router.push({ pathname: "/onboarding/account", params: { existing: "1" } })} style={{ alignSelf: "center" }} /> : null}
      </View>
    </Screen>
  );
}
