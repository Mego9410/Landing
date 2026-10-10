import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { Header, Tick } from "@/components/ui";
import { fmt } from "@/data/dates";
import { DISCLAIMER_VERSION, set, useApp } from "@/state/store";
import { space } from "@/theme";

// The wording people accept before their plan is built. Changing the points or the ticks means bumping
// DISCLAIMER_VERSION in the store; the title and introduction can change freely.
const TITLE = "Before we build your plan";
const POINTS: { title: string; text: string }[] = [
  { title: "General guidance, not medical advice", text: "Steadie's meal plans, strength sessions and tips follow general healthy-eating and activity guidance. They aren't personalised to your health and don't replace advice from your GP or another health professional." },
  { title: "Nothing about your medication", text: "Steadie never gives advice about weight-loss medicines, doses or stopping. Those decisions are for your prescriber." },
  { title: "Check with your GP first if you", text: "are pregnant or breastfeeding; have a heart, lung, kidney or liver condition, diabetes or high blood pressure; have an injury or joint problem, or have had recent surgery; have, or have had, an eating disorder." },
  { title: "Listen to your body", text: "Stop exercising if you feel pain, dizziness, chest pain or breathlessness that worries you, and get medical help. In an emergency, call 999." },
  { title: "Check labels", text: "Recipes, nutrition and allergen information are a guide. Always check the labels on what you buy, especially if you have an allergy." },
  { title: "If eating feels hard", text: "Beat, the UK's eating disorder charity, has a helpline you can talk to. Safe mode in Settings hides weight and numbers." },
];

/** Health and safety: accepted during onboarding, just before the health check, and again whenever the wording changes.
 *  Readable later from Settings. */
export default function Disclaimer() {
  const s = useApp();
  const review = useLocalSearchParams<{ review?: string }>().review === "1"; // read-only (from Settings, or "in full" in onboarding)
  const [understood, setUnderstood] = useState(false), [adult, setAdult] = useState(false);
  const [error, setError] = useState("");
  const onboarding = !review && !s.onboarded;

  function accept() {
    if (!understood || !adult) { setError("Tick both boxes to carry on."); return; }
    set((st) => { st.disclaimer = { acceptedAt: new Date().toISOString(), version: DISCLAIMER_VERSION }; });
    // During onboarding this sits just before consent and the health check; for someone already set up (new wording), back to Today.
    router.replace(s.onboarded ? "/" : "/onboarding/where");
  }

  return (
    <Screen header={review ? <Header fallback="/settings" title="Health and safety" /> : onboarding ? <Header fallback="/onboarding" title={TITLE} /> : undefined} contentContainerStyle={{ gap: space[5], paddingBottom: 48 }}>
      <View style={{ gap: space[2] }}>
        <AppText variant="title" accessibilityRole="header">{review ? "Health and safety" : TITLE}</AppText>
        <AppText variant="bodyLg" color="inkMuted">{review ? "How Steadie works, and when to talk to a professional." : "Steadie gives calm, everyday guidance for the year after your jab. Here's how it works, and when it's worth checking with your GP."}</AppText>
      </View>
      <Card style={{ gap: space[4] }}>
        {POINTS.map((p) => (
          <View key={p.title} style={{ gap: 2 }}>
            <AppText weight="800">{p.title}</AppText>
            <AppText color="inkMuted">{p.text}</AppText>
          </View>
        ))}
      </Card>
      {review ? (
        <AppText variant="caption" color="inkMuted">You accepted this on {fmt.long(s.disclaimer!.acceptedAt.slice(0, 10))}.</AppText>
      ) : (
        <View style={{ gap: space[3] }}>
          <Tick label="I understand Steadie gives general guidance, not medical advice, and I'll check with my GP if I'm unsure" checked={understood} onChange={(v) => { setError(""); setUnderstood(v); }} />
          <Tick label="I'm 18 or over" checked={adult} onChange={(v) => { setError(""); setAdult(v); }} />
          {error ? <AppText variant="caption" color="roseInk">{error}</AppText> : null}
          <Button label="Continue" block onPress={accept} />
          <View style={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap" }}>
            <Button label="Terms of use" variant="quiet" onPress={() => router.push({ pathname: "/legal/[doc]", params: { doc: "terms" } })} />
            <Button label="Privacy policy" variant="quiet" onPress={() => router.push({ pathname: "/legal/[doc]", params: { doc: "privacy" } })} />
          </View>
        </View>
      )}
    </Screen>
  );
}
