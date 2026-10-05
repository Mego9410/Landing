import { ScrollView, type ScrollViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { space, useColors } from "@/theme";

/** A scrolling screen on the oat surface, clear of the status bar and the floating tab bar. */
export function Screen({ children, contentContainerStyle, ...rest }: ScrollViewProps) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      {...rest}
      style={{ flex: 1, backgroundColor: c.surface }}
      contentContainerStyle={[{ paddingTop: insets.top + space[4], paddingHorizontal: 20, paddingBottom: 128, gap: space[6] }, contentContainerStyle]}>
      {children}
    </ScrollView>
  );
}
