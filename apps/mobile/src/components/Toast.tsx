import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast } from "@/state/toast";
import { radius, space } from "@/theme";
import { AppText } from "./AppText";

/** The current toast, above the tab bar. Announced to screen readers as a status. */
export function Toast() {
  const text = useToast();
  const insets = useSafeAreaInsets();
  if (!text) return null;
  return (
    <View pointerEvents="none" style={{ position: "absolute", left: 20, right: 20, bottom: Math.max(insets.bottom, space[3]) + 96, alignItems: "center" }}>
      <View accessibilityLiveRegion="polite" accessibilityRole="alert" style={{ backgroundColor: "#2E2A33", borderRadius: radius.md, paddingVertical: space[3], paddingHorizontal: space[4], maxWidth: 420 }}>
        <AppText weight="700" style={{ color: "#FBF8F4" }}>{text}</AppText>
      </View>
    </View>
  );
}
