import { View } from "react-native";
import { radius, space, useColors } from "@/theme";
import { AppText } from "./AppText";

/** A small rounded label. Phase tones are fixed: Land sky, Settle sage, Steady lilac. */
export function Chip({ label, tone = "sky" }: { label: string; tone?: "sky" | "sage" | "lilac" | "apricot" | "butter" }) {
  const c = useColors();
  return (
    <View style={{ backgroundColor: c[tone], borderRadius: radius.full, minHeight: 32, paddingVertical: 4, paddingHorizontal: space[3], justifyContent: "center", alignSelf: "flex-start" }}>
      <AppText variant="label" color="onPastel">{label}</AppText>
    </View>
  );
}
