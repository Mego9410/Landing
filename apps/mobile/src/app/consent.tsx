import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { Header, Tick } from "@/components/ui";
import { CONSENT_VERSION, set, useApp } from "@/state/store";
import { space } from "@/theme";

// Explicit consent to keep health information, as UK GDPR requires for special category data. Asked in onboarding just
// before the health check, and once for anyone set up without it. Changing what's described here means bumping
// CONSENT_VERSION in the store; the server records the version with each backup.
const POINTS: { title: string; text: string }[] = [
  { title: "What we keep", text: "Your health check answers, your weight if you choose to log it, your daily check-ins and strength sessions, and your weight and steps from Apple Health if you connect it." },
  { title: "Why", text: "To build and adjust your plan and show you your progress." },
  { title: "Where", text: "On this phone. If you sign in, also in your private backup, kept encrypted on our servers in London, UK." },
  { title: "Never for ads", text: "Your health information is never sold and never used for advertising." },
  { title: "Your choice, any time", text: "You can withdraw consent for the backup, or delete everything, in Settings > Account and Your data." },
];

export default function Consent() {
  const s = useApp();
  const [agreed, setAgreed] = useState(false);
  function agree() {
    set((st) => { st.consent = { healthDataAt: new Date().toISOString(), version: CONSENT_VERSION, backupOffAt: null }; });
    router.replace(s.onboarded ? "/" : "/onboarding/health");
  }
  return (
    <Screen header={s.onboarded ? undefined : <Header fallback="/onboarding/start" title="Your health information" />} contentContainerStyle={{ gap: space[5], paddingBottom: 48 }}>
      <View style={{ gap: space[2] }}>
        <AppText variant="title" accessibilityRole="header">Your health information</AppText>
        <AppText variant="bodyLg" color="inkMuted">Steadie needs your agreement to keep health information. Here&apos;s exactly what that means.</AppText>
      </View>
      <Card style={{ gap: space[4] }}>
        {POINTS.map((p) => (
          <View key={p.title} style={{ gap: 2 }}>
            <AppText weight="800">{p.title}</AppText>
            <AppText color="inkMuted">{p.text}</AppText>
          </View>
        ))}
      </Card>
      <View style={{ gap: space[3] }}>
        <Tick label="I agree to Steadie storing my health information to run my plan." checked={agreed} onChange={setAgreed} />
        <Button label="Agree and continue" block disabled={!agreed} onPress={agree} />
        <Button label="Read the privacy policy" variant="quiet" onPress={() => router.push({ pathname: "/legal/[doc]", params: { doc: "privacy" } })} style={{ alignSelf: "center" }} />
      </View>
    </Screen>
  );
}
