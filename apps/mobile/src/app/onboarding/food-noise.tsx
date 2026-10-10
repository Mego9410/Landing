import { router } from "expo-router";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Chip, Chips, Lede, OnbCard, OnbScreen, Title, toggle } from "@/components/Onboarding";
import { FOOD_NOISE, NOT_REALLY } from "@/state/onboarding";
import { set, useApp } from "@/state/store";
import { space, useColors } from "@/theme";

// The day as six bars; the ones that match what's picked light up.
const BARS = [{ t: "7am", h: 0.3 }, { t: "11am", h: 0.55, id: "midmorning" }, { t: "1pm", h: 0.45 }, { t: "4pm", h: 1, id: "afternoon" }, { t: "7pm", h: 0.7, id: "evening" }, { t: "10pm", h: 0.4, id: "evening" }];

/** 13 · When does food noise tend to get loud? Also sets the hungry times the meal plan puts snacks at. */
export default function FoodNoise() {
  const s = useApp(), c = useColors(), picked = s.story.foodNoise;
  const pick = (id: string) => set((st) => {
    const next = id === NOT_REALLY ? (picked.includes(NOT_REALLY) ? [] : [NOT_REALLY]) : toggle(picked.filter((x) => x !== NOT_REALLY), id);
    st.story.foodNoise = next;
    // "Not really" (or nothing) skips the if-then plan, so an earlier one shouldn't linger.
    if (!next.length || next.includes(NOT_REALLY)) st.story.ifThen = null;
    st.ob.hungryTimes = FOOD_NOISE.filter((f) => next.includes(f.id) && f.hungry).map((f) => f.hungry!);
  });
  return (
    <OnbScreen route="food-noise" footer={<Button label="Continue" variant="brand" block onPress={() => router.push(picked.includes(NOT_REALLY) || !picked.length ? "/onboarding/eat" : "/onboarding/if-then")} />}>
      <Title>When does food noise tend to get loud?</Title>
      <Lede>Pick any. We’ll plan around those moments.</Lede>
      <OnbCard style={{ marginTop: space[3], paddingHorizontal: space[4] }}>
        <View style={{ flexDirection: "row", alignItems: "flex-end", gap: space[2], height: 110 }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          {BARS.map((b) => {
            const on = !!b.id && picked.includes(b.id);
            return <View key={b.t} style={{ flex: 1, height: `${b.h * 100}%`, borderRadius: 10, backgroundColor: on ? (b.h === 1 ? "#E07A52" : c.apricot) : c.surfaceSunk }} />;
          })}
        </View>
        <View style={{ flexDirection: "row", gap: space[2], marginTop: space[2] }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          {BARS.map((b) => <AppText key={b.t} weight="800" color={b.id && picked.includes(b.id) ? "apricotInk" : "inkMuted"} style={{ flex: 1, fontSize: 12, textAlign: "center" }} maxFontSizeMultiplier={1.3}>{b.t}</AppText>)}
        </View>
      </OnbCard>
      <View style={{ marginTop: space[3] }}>
        <Chips>
          {FOOD_NOISE.map((f) => <Chip key={f.id} multi label={f.label} on={picked.includes(f.id)} onPress={() => pick(f.id)} />)}
          <Chip multi label="Not really" on={picked.includes(NOT_REALLY)} onPress={() => pick(NOT_REALLY)} />
        </Chips>
      </View>
    </OnbScreen>
  );
}
