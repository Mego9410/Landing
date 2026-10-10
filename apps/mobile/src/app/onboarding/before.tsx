import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { OnbCard, OnbScreen, TickOpt, Title } from "@/components/Onboarding";
import { DISCLAIMER_VERSION, set, useApp } from "@/state/store";
import { space, useColors } from "@/theme";

/** 3 · Before we start: the essentials of the health and safety information (in full one tap away), accepted with two
 *  ticks. Records the same acceptance as the full screen did. */
export default function Before() {
  const s = useApp(), c = useColors();
  const [adult, setAdult] = useState(!!s.disclaimer), [gotIt, setGotIt] = useState(!!s.disclaimer);
  const [error, setError] = useState("");
  function next() {
    if (!adult || !gotIt) { setError("Tick both to carry on."); return; }
    set((st) => { st.disclaimer = { acceptedAt: new Date().toISOString(), version: DISCLAIMER_VERSION }; });
    router.push("/onboarding/where");
  }
  const point = (tone: "sage" | "sky", ink: string, icon: "heart" | "person", text: string) => (
    <View style={{ flexDirection: "row", gap: space[3], alignItems: "flex-start" }}>
      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: c[tone], alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={20} color={ink} />
      </View>
      <AppText weight="600" style={{ flex: 1, fontSize: 17, lineHeight: 25 }}>{text}</AppText>
    </View>
  );
  return (
    <OnbScreen route="before" footer={<>
      {error ? <AppText variant="caption" color="roseInk" style={{ textAlign: "center" }}>{error}</AppText> : null}
      <Button label="Continue" variant="brand" block onPress={next} />
      <View style={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap" }}>
        <Button label="Health and safety in full" variant="quiet" onPress={() => router.push({ pathname: "/disclaimer", params: { review: "1" } })} />
        <Button label="Terms" variant="quiet" onPress={() => router.push({ pathname: "/legal/[doc]", params: { doc: "terms" } })} />
        <Button label="Privacy" variant="quiet" onPress={() => router.push({ pathname: "/legal/[doc]", params: { doc: "privacy" } })} />
      </View>
    </>}>
      <Title>{s.name.trim() ? `Before we start, ${s.name.trim()}` : "Before we start"}</Title>
      <OnbCard style={{ marginTop: space[4], gap: 14 }}>
        {point("sage", c.sageInk, "heart", "Steadie is for adults, and it’s general guidance, not medical advice.")}
        {point("sky", c.skyInk, "person", "Your GP or prescriber is still the person to ask about your medication.")}
      </OnbCard>
      <View style={{ gap: 10, marginTop: space[4] }}>
        <TickOpt label="I’m 18 or over" checked={adult} onChange={(v) => { setError(""); setAdult(v); }} />
        <TickOpt label="Got it" checked={gotIt} onChange={(v) => { setError(""); setGotIt(v); }} />
      </View>
    </OnbScreen>
  );
}
