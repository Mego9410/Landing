import { router } from "expo-router";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Bubble, OnbScreen, Title } from "@/components/Onboarding";
import { Button } from "@/components/Button";
import { useApp } from "@/state/store";
import { space, useColors } from "@/theme";

/** 17 · People who keep it off tend to say the same three things: the plan's three pillars. */
export default function Helps() {
  const s = useApp(), c = useColors();
  const pillars = [
    { n: 1, title: "Protein first", sub: "It keeps you fuller for longer.", tone: c.butter },
    { n: 2, title: "Get stronger", sub: "Muscle helps your body hold steady.", tone: c.lilac },
    { n: 3, title: "Notice changes early", sub: "Small wobbles are easy to steady.", tone: c.sage },
  ];
  return (
    <OnbScreen route="helps" footer={<Button label="Continue" variant="brand" block onPress={() => router.push("/onboarding/nudge")} />}>
      <Title>People who keep it off tend to say the same three things</Title>
      <View style={{ gap: 10, marginTop: space[4] }}>
        {pillars.map((p) => (
          <View key={p.n} accessible style={{ flexDirection: "row", gap: 14, alignItems: "center", borderRadius: 22, padding: space[4], backgroundColor: p.tone }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: c.surfaceRaised, alignItems: "center", justifyContent: "center" }}><AppText variant="heading" style={{ fontSize: 20 }}>{p.n}</AppText></View>
            <View style={{ flex: 1 }}>
              <AppText weight="800" color="onPastel" style={{ fontSize: 18 }}>{p.title}</AppText>
              <AppText weight="600" color="onPastel" style={{ fontSize: 15 }}>{p.sub}</AppText>
            </View>
          </View>
        ))}
      </View>
      <View style={{ marginTop: space[4] }}><Bubble size={56}>{s.name.trim() ? `Your plan is built on all three, ${s.name.trim()}.` : "Your plan is built on all three."}</Bubble></View>
    </OnbScreen>
  );
}
