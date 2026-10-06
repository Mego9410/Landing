import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Icon } from "@/components/Icon";
import { Screen } from "@/components/Screen";
import { Header } from "@/components/ui";
import { fmt } from "@/data/dates";
import { DISCLAIMER_VERSION, set, useApp } from "@/state/store";
import { radius, space, useColors } from "@/theme";

// The wording people accept before using the app. Changing it means bumping DISCLAIMER_VERSION in the store.
const POINTS: { title: string; text: string }[] = [
  { title: "General guidance, not medical advice", text: "Landing's meal plans, strength sessions and tips follow general healthy-eating and activity guidance. They aren't personalised to your health and don't replace advice from your GP or another health professional." },
  { title: "Nothing about your medication", text: "Landing never gives advice about weight-loss medicines, doses or stopping. Those decisions are for your prescriber." },
  { title: "Check with your GP first if you", text: "are pregnant or breastfeeding; have a heart, lung, kidney or liver condition, diabetes or high blood pressure; have an injury or joint problem, or have had recent surgery; have, or have had, an eating disorder." },
  { title: "Listen to your body", text: "Stop exercising if you feel pain, dizziness, chest pain or breathlessness that worries you, and get medical help. In an emergency, call 999." },
  { title: "Check labels", text: "Recipes, nutrition and allergen information are a guide. Always check the labels on what you buy, especially if you have an allergy." },
  { title: "If eating feels hard", text: "Beat, the UK's eating disorder charity, has a helpline you can talk to. Safe mode in Settings hides weight and numbers." },
];

function Tick({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  const c = useColors();
  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked }} accessibilityLabel={label}
      onPress={() => { if (!checked) Haptics.selectionAsync().catch(() => {}); onChange(!checked); }}
      style={{ flexDirection: "row", alignItems: "center", gap: space[3], padding: space[4], borderRadius: radius.md, backgroundColor: checked ? c.sage : c.surfaceRaised }}>
      <View style={{ width: 28, height: 28, borderRadius: radius.sm, alignItems: "center", justifyContent: "center", backgroundColor: checked ? c.onPastel : "transparent", borderWidth: checked ? 0 : 2, borderColor: c.inkMuted }}>
        {checked ? <Icon name="check" size={18} color={c.sage} /> : null}
      </View>
      <AppText weight="700" color={checked ? "onPastel" : "ink"} style={{ flex: 1 }}>{label}</AppText>
    </Pressable>
  );
}

/** Health and safety, shown once before anything else and again whenever the wording changes. Readable later from Settings. */
export default function Disclaimer() {
  const s = useApp();
  const review = useLocalSearchParams<{ review?: string }>().review === "1" && !!s.disclaimer;
  const [understood, setUnderstood] = useState(false), [adult, setAdult] = useState(false);
  const [error, setError] = useState("");

  function accept() {
    if (!understood || !adult) { setError("Tick both boxes to carry on."); return; }
    set((st) => { st.disclaimer = { acceptedAt: new Date().toISOString(), version: DISCLAIMER_VERSION }; });
    router.replace(s.onboarded ? "/" : "/onboarding");
  }

  return (
    <Screen contentContainerStyle={{ gap: space[5], paddingBottom: 48 }}>
      {review ? <Header fallback="/settings" /> : null}
      <View style={{ gap: space[2] }}>
        <AppText variant="title" accessibilityRole="header">Before you start</AppText>
        <AppText variant="bodyLg" color="inkMuted">A few things to know about how Landing works and when to talk to a professional.</AppText>
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
          <Tick label="I understand Landing gives general guidance, not medical advice, and I'll check with my GP if I'm unsure" checked={understood} onChange={(v) => { setError(""); setUnderstood(v); }} />
          <Tick label="I'm 18 or over" checked={adult} onChange={(v) => { setError(""); setAdult(v); }} />
          {error ? <AppText variant="caption" color="roseInk">{error}</AppText> : null}
          <Button label="Continue" block onPress={accept} />
        </View>
      )}
    </Screen>
  );
}
