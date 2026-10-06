import { router } from "expo-router";
import { AppText } from "@/components/AppText";
import { Step } from "@/components/Onboarding";
import { Choices, Field, Options } from "@/components/ui";
import { set, setWeek, useApp, weekOf } from "@/state/store";
import { View } from "react-native";
import { space } from "@/theme";

/** O1–O2 Where you are now, and how long since the last injection. */
export default function Start() {
  const s = useApp();
  return (
    <Step n={1} title="Where are you now?" lede="Your plan is built around the year after your last injection." next={() => router.push("/onboarding/health")}>
      <Field label="What should we call you? (optional)" value={s.name} onChangeText={(v) => set((st) => { st.name = v.slice(0, 30); })} placeholder="Your first name" autoComplete="given-name" textContentType="givenName" returnKeyType="done" />
      <Options label="Where you are" value={s.ob.status} onChange={(v) => set((st) => { st.ob.status = v; })} options={[
        { id: "stopped", title: "I've stopped", detail: "My last injection was a while ago" },
        { id: "soon", title: "Stopping soon", detail: "I'm planning my last injection" },
        { id: "on", title: "Still on it", detail: "I want to get ready for afterwards" },
      ]} />
      {s.ob.status === "stopped" ? (
        <View style={{ gap: space[2] }}>
          <AppText variant="label">ROUGHLY HOW LONG AGO?</AppText>
          <Choices label="Weeks since your last injection" value={weekOf(s)} onChange={(v) => set((st) => setWeek(st, v as number))}
            options={[{ id: 1, label: "This week" }, { id: 3, label: "2 to 3 weeks" }, { id: 6, label: "About 6 weeks" }, { id: 12, label: "About 3 months" }, { id: 27, label: "6 months or more" }]} />
        </View>
      ) : null}
    </Step>
  );
}
