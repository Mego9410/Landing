import { router } from "expo-router";
import { Pressable, View } from "react-native";
import * as Haptics from "expo-haptics";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Icon, type IconName } from "@/components/Icon";
import { Lede, OnbScreen, Title, toggle } from "@/components/Onboarding";
import { set, useApp } from "@/state/store";
import { space, useColors } from "@/theme";

const MATTERS: { id: string; label: string; icon: IconName; tone: "apricot" | "butter" | "sage" | "sky" | "lilac" | "rose" }[] = [
  { id: "energy", label: "My energy", icon: "bolt", tone: "butter" },
  { id: "calm-food", label: "Feeling calm around food", icon: "smile", tone: "sage" },
  { id: "confidence", label: "My confidence", icon: "star", tone: "butter" },
  { id: "family", label: "Keeping up with my family", icon: "heart", tone: "rose" },
  { id: "health", label: "My health checks", icon: "check", tone: "sage" },
  { id: "clothes", label: "Clothes that feel comfortable", icon: "shirt", tone: "sky" },
];

/** 9 · What would you most like to hold on to? Up to three. */
export default function Matters() {
  const s = useApp(), c = useColors(), picked = s.story.matters;
  return (
    <OnbScreen route="matters" footer={<Button label="Continue" variant="brand" block onPress={() => router.push("/onboarding/consent")} />}>
      <Title>What would you most like to hold on to?</Title>
      <Lede>Pick up to three.</Lede>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 8 }}>
        {MATTERS.map((m) => {
          const on = picked.includes(m.id), full = !on && picked.length >= 3;
          return (
            <Pressable key={m.id} accessibilityRole="checkbox" accessibilityState={{ checked: on, disabled: full }} accessibilityLabel={m.label}
              onPress={() => { if (full) return; Haptics.selectionAsync().catch(() => {}); set((st) => { st.story.matters = toggle(picked, m.id, 3); }); }}
              style={({ pressed }) => ({ flexBasis: "47%", flexGrow: 1, minHeight: 108, gap: 10, padding: 14, borderRadius: 20, backgroundColor: on ? c.apricot : c.surfaceRaised, borderWidth: 1.5, borderColor: on ? c.apricot : c.line, opacity: full ? 0.55 : pressed ? 0.85 : 1 })}>
              <View style={{ width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: on ? c.surfaceRaised : c[m.tone] }}><Icon name={m.icon} size={19} color={c.onPastel} /></View>
              <AppText weight="800" color={on ? "onPastel" : "ink"} style={{ fontSize: 16, lineHeight: 21 }}>{m.label}</AppText>
            </Pressable>
          );
        })}
      </View>
      <AppText variant="caption" color="inkMuted" style={{ marginTop: space[1] }}>{picked.length} of 3 picked</AppText>
    </OnbScreen>
  );
}
