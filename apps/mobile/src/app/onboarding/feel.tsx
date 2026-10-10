import { router } from "expo-router";
import { View } from "react-native";
import { Bubble, Lede, OnbScreen, Opt, Title, toggle } from "@/components/Onboarding";
import { Button } from "@/components/Button";
import { set, useApp } from "@/state/store";

const FEEL = [
  { id: "proud", label: "Proud of what I’ve done" },
  { id: "nervous", label: "Nervous it’ll creep back" },
  { id: "noise", label: "Worried the food noise will return" },
  { id: "unsure", label: "Not sure what to do now" },
  { id: "fine", label: "Honestly fine, I just want a plan" },
];

/** What Steadie says back, from what they picked. */
function reply(feel: string[]) {
  if (feel.includes("proud") && feel.includes("nervous")) return "Proud and nervous at the same time is really common. Both make sense.";
  if (feel.includes("noise")) return "Lots of people worry about that. We’ll plan for the loud moments together.";
  if (feel.includes("nervous")) return "That’s a really common feeling. A plan makes the year ahead feel more certain.";
  if (feel.includes("unsure")) return "That’s exactly what Steadie is for. We’ll take it one day at a time.";
  if (feel.includes("proud")) return "You should be. Let’s keep hold of what you’ve worked for.";
  if (feel.includes("fine")) return "Great. Let’s get you a plan that fits.";
  return null;
}

/** 7 · How are you feeling about life after the jab? */
export default function Feel() {
  const s = useApp(), feel = s.story.feel, said = reply(feel);
  return (
    <OnbScreen route="feel" footer={<Button label="Continue" variant="brand" block onPress={() => router.push("/onboarding/biology")} />}>
      <Title>How are you feeling about life after the jab?</Title>
      <Lede>Pick any. There are no wrong answers.</Lede>
      <View style={{ gap: 10, marginTop: 8 }}>
        {FEEL.map((o) => <Opt key={o.id} multi label={o.label} on={feel.includes(o.id)} onPress={() => set((st) => { st.story.feel = toggle(feel, o.id); })} />)}
      </View>
      {said ? <View style={{ marginTop: 8 }} accessibilityLiveRegion="polite"><Bubble size={56}>{said}</Bubble></View> : null}
    </OnbScreen>
  );
}
