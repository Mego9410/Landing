import { router } from "expo-router";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { OnbScreen, Opt, Title } from "@/components/Onboarding";
import { IF_THEN, ifThenSentence, noiseMoment } from "@/state/onboarding";
import { set, useApp } from "@/state/store";
import { radius, space, useColors } from "@/theme";

/** 14 · Their first if-then plan, for the moment food noise gets loudest, in their own words. */
export default function IfThen() {
  const s = useApp(), c = useColors();
  const chosen = s.story.ifThen ?? IF_THEN[0].id;
  const moment = noiseMoment(s.story), sentence = ifThenSentence({ ...s.story, ifThen: chosen });
  return (
    <OnbScreen route="if-then" footer={<Button label="That’s my plan" variant="brand" block onPress={() => { set((st) => { st.story.ifThen = chosen; }); router.push("/onboarding/eat"); }} />}>
      <Title>{moment.title}, what would you like to try first?</Title>
      <View accessibilityRole="radiogroup" accessibilityLabel="What to try first" style={{ gap: space[2], marginTop: space[2] }}>
        {IF_THEN.map((o) => <Opt key={o.id} label={o.label} on={chosen === o.id} onPress={() => set((st) => { st.story.ifThen = o.id; })} />)}
      </View>
      <View accessibilityLiveRegion="polite" style={{ marginTop: space[4], backgroundColor: c.ink, borderRadius: radius.lg, padding: space[5], gap: 10 }}>
        <AppText variant="label" style={{ color: "#F2A27A" }}>YOUR PLAN, IN YOUR WORDS</AppText>
        <AppText variant="heading" style={{ color: c.surface, fontSize: 22, lineHeight: 29 }}>
          {sentence.when}, I’ll <AppText variant="heading" style={{ color: "#F2A27A", fontSize: 22, lineHeight: 29 }}>{sentence.action}</AppText>.
        </AppText>
        <AppText weight="700" style={{ color: c.surface, opacity: 0.8, fontSize: 14 }}>Plans like this make the moment easier to handle. You can add more later.</AppText>
      </View>
    </OnbScreen>
  );
}
