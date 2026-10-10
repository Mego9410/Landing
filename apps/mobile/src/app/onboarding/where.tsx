import { router } from "expo-router";
import { View } from "react-native";
import { Button } from "@/components/Button";
import { OnbScreen, Opt, Title } from "@/components/Onboarding";
import { statusFor, WHERE } from "@/state/onboarding";
import { set, useApp } from "@/state/store";

/** 4 · Where are you with your jab right now? */
export default function Where() {
  const s = useApp(), w = s.story.where;
  return (
    <OnbScreen route="where" footer={<Button label="Continue" variant="brand" block disabled={!w} onPress={() => router.push("/onboarding/last-jab")} />}>
      <Title>Where are you with your jab right now?</Title>
      <View accessibilityRole="radiogroup" accessibilityLabel="Where you are with your jab" style={{ gap: 10, marginTop: 10 }}>
        {WHERE.map((o) => (
          <Opt key={o.id} label={o.label} reply={o.reply} on={w === o.id} onPress={() => set((st) => { st.story.where = o.id; st.ob.status = statusFor(o.id); })} />
        ))}
      </View>
    </OnbScreen>
  );
}
