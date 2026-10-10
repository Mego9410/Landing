import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Icon, type IconName } from "@/components/Icon";
import { Lede, OnbCard, OnbScreen, TickOpt, Title } from "@/components/Onboarding";
import { track } from "@/state/events";
import { CONSENT_VERSION, set, useApp } from "@/state/store";
import { radius, space, useColors } from "@/theme";

/** 10 · Your health info stays yours: explicit consent to keep health information (UK GDPR special category data), the
 *  same consent as app/consent.tsx records. Steadie needs it to run a plan built on check-ins and the health check, so
 *  there's no way on without it; the privacy policy is a tap away. */
export default function OnboardingConsent() {
  const s = useApp(), c = useColors();
  const [agreed, setAgreed] = useState(!!s.consent);
  function agree() {
    if (!s.consent) {
      set((st) => { st.consent = { healthDataAt: new Date().toISOString(), version: CONSENT_VERSION, backupOffAt: null }; });
      track("consent_given");
    }
    router.push("/onboarding/health");
  }
  const row = (icon: IconName, text: string) => (
    <View style={{ flexDirection: "row", gap: space[3], alignItems: "center" }}>
      <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: c.butter, alignItems: "center", justifyContent: "center" }}><Icon name={icon} size={17} color={c.onPastel} /></View>
      <AppText weight="600" style={{ flex: 1, fontSize: 16, lineHeight: 22 }}>{text}</AppText>
    </View>
  );
  return (
    <OnbScreen route="consent" footer={<>
      <Button label="Agree and continue" variant="brand" block disabled={!agreed} onPress={agree} />
      <Button label="Read the privacy policy" variant="quiet" onPress={() => router.push({ pathname: "/legal/[doc]", params: { doc: "privacy" } })} style={{ alignSelf: "center" }} />
    </>}>
      <View style={{ width: 64, height: 64, borderRadius: 22, backgroundColor: c.sage, alignItems: "center", justifyContent: "center" }}><Icon name="lock" size={28} color={c.onPastel} /></View>
      <View style={{ marginTop: space[2] }}><Title>Your health info stays yours</Title></View>
      <Lede>To shape your plan around your health, Steadie keeps what you choose to share, like your health check, check-ins and weight.</Lede>
      <OnbCard style={{ marginTop: space[3], gap: 14 }}>
        {row("heart", "Never sold, never used for ads")}
        {row("lock", "On this phone, and backed up encrypted in the UK only if you sign in")}
        {row("settings", "Change your mind any time in Settings")}
      </OnbCard>
      <View style={{ marginTop: space[2], borderRadius: radius.md }}>
        <TickOpt label="I agree to Steadie keeping my health information to run my plan" checked={agreed} onChange={setAgreed} />
      </View>
    </OnbScreen>
  );
}
