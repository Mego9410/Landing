import { router } from "expo-router";
import { View } from "react-native";
import { Button } from "@/components/Button";
import { Lede, OnbScreen, Opt, Title, toggle } from "@/components/Onboarding";
import { set, useApp } from "@/state/store";

const WHY = [
  { id: "reached", label: "Reached where I wanted to be", reply: "That’s a big thing to have done. Now let’s help it last." },
  { id: "cost", label: "The cost", reply: "You’re far from alone in that. Let’s build something that lasts without the jab." },
  { id: "side-effects", label: "Side effects", reply: "That makes sense. We’ll go gently while things settle." },
  { id: "pregnancy", label: "Planning a pregnancy", reply: "Exciting. Your plan will keep things gentle, and your midwife or GP comes first." },
  { id: "prescriber", label: "My prescriber suggested it", reply: "Good to have them on side. Steadie works alongside their advice." },
  { id: "break", label: "Just ready for a break", reply: "Fair enough. We’ll help you feel steady without it." },
];
const PRIVATE = "private";

/** 6 · What's brought you to this point? Pick any. */
export default function Why() {
  const s = useApp(), why = s.story.why;
  const pick = (id: string) => set((st) => { st.story.why = id === PRIVATE ? (why.includes(PRIVATE) ? [] : [PRIVATE]) : toggle(why.filter((x) => x !== PRIVATE), id); });
  const last = [...why].reverse().find((id) => id !== PRIVATE);
  return (
    <OnbScreen route="why" footer={<Button label="Continue" variant="brand" block onPress={() => router.push("/onboarding/feel")} />}>
      <Title>What’s brought you to this point?</Title>
      <Lede>Pick any.</Lede>
      <View style={{ gap: 9, marginTop: 6 }}>
        {WHY.map((o) => <Opt key={o.id} multi label={o.label} reply={o.id === last ? o.reply : undefined} on={why.includes(o.id)} onPress={() => pick(o.id)} />)}
        <Opt multi muted label="I’d rather not say" on={why.includes(PRIVATE)} onPress={() => pick(PRIVATE)} />
      </View>
    </OnbScreen>
  );
}
