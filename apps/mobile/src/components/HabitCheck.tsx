import * as Haptics from "expo-haptics";
import { Pressable, View } from "react-native";
import { radius, space, useColors } from "@/theme";
import { AppText } from "./AppText";
import { Icon } from "./Icon";

/** One of the week's three habits. Ticking fills the row with sage and gives a light haptic; unticking is silent. */
export function HabitCheck({ label, detail, checked, onChange }: { label: string; detail?: string; checked: boolean; onChange: (checked: boolean) => void }) {
  const c = useColors();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={detail ? `${label}, ${detail}` : label}
      onPress={() => {
        if (!checked) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onChange(!checked);
      }}
      style={{
        flexDirection: "row", alignItems: "center", gap: space[3], paddingVertical: space[3], paddingHorizontal: space[4], borderRadius: radius.md,
        backgroundColor: checked ? c.sage : c.surfaceRaised,
      }}>
      <View style={{ width: 32, height: 32, borderRadius: radius.full, alignItems: "center", justifyContent: "center", backgroundColor: checked ? c.onPastel : "transparent", borderWidth: checked ? 0 : 2, borderColor: c.inkMuted }}>
        {checked ? <Icon name="check" size={18} color={c.sage} /> : null}
      </View>
      <View style={{ flex: 1 }}>
        <AppText weight="700" color={checked ? "onPastel" : "ink"}>{label}</AppText>
        {detail ? <AppText variant="caption" color={checked ? "onPastel" : "inkMuted"}>{detail}</AppText> : null}
      </View>
    </Pressable>
  );
}
