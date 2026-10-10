import * as Haptics from "expo-haptics";
import { Pressable, View } from "react-native";
import { radius, space, useColors } from "@/theme";
import { AppText } from "./AppText";
import { Icon } from "./Icon";

/** One of the week's three habits. Ticking fills the row with sage and gives a light haptic; unticking is silent.
 *  `compact` is the slimmer row for a grouped list (Today): a smaller tick, and once done the label is muted and struck
 *  through with the detail hidden. */
export function HabitCheck({ label, detail, checked, onChange, compact }: { label: string; detail?: string; checked: boolean; onChange: (checked: boolean) => void; compact?: boolean }) {
  const c = useColors();
  if (compact) {
    return (
      <Pressable accessibilityRole="checkbox" accessibilityState={{ checked }} accessibilityLabel={detail ? `${label}, ${detail}` : label}
        onPress={() => { if (!checked) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}); onChange(!checked); }}
        style={{ flexDirection: "row", alignItems: "center", gap: space[3], minHeight: 56, paddingVertical: space[2], paddingHorizontal: space[4] }}>
        <Tick done={checked} />
        <View style={{ flex: 1 }}>
          <AppText weight="700" color={checked ? "inkMuted" : "ink"} style={checked ? { textDecorationLine: "line-through" } : undefined}>{label}</AppText>
          {detail && !checked ? <AppText variant="caption" color="inkMuted" numberOfLines={1}>{detail}</AppText> : null}
        </View>
      </Pressable>
    );
  }
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

/** The round tick in a compact row: filled ink with a cream check when done, an outline when not. */
export function Tick({ done }: { done: boolean }) {
  const c = useColors();
  return (
    <View style={{ width: 30, height: 30, borderRadius: radius.full, alignItems: "center", justifyContent: "center", backgroundColor: done ? c.ink : "transparent", borderWidth: done ? 0 : 2, borderColor: c.inkMuted }}>
      {done ? <Icon name="check" size={16} color={c.surface} strokeWidth={3} /> : null}
    </View>
  );
}
