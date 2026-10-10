import { Pressable, useColorScheme, View, type PressableProps } from "react-native";
import { radius, space, useColors } from "@/theme";
import { AppText } from "./AppText";
import { Icon, type IconName } from "./Icon";

type Props = PressableProps & { label: string; variant?: "primary" | "secondary" | "quiet" | "danger" | "brand" | "ink"; icon?: IconName; block?: boolean };

/** The strong brand apricot (onboarding's main buttons), with dark text: AA in both themes (4.7:1 light, 8.2:1 dark). */
export function useBrand() {
  return useColorScheme() === "dark" ? "#F2A27A" : "#E07A52";
}

/** Pill-shaped button. Primary (apricot) at most once per screen; danger (rose) only to confirm deleting something. */
export function Button({ label, variant = "primary", icon, block, style, disabled, ...rest }: Props) {
  const c = useColors(), brand = useBrand();
  const bg = variant === "primary" ? c.apricot : variant === "danger" ? c.rose : variant === "brand" ? brand : variant === "ink" ? c.ink : variant === "secondary" ? c.surfaceRaised : "transparent";
  const fg = variant === "primary" || variant === "danger" || variant === "brand" ? c.onPastel : variant === "ink" ? c.surface : variant === "quiet" ? c.apricotInk : c.ink;
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled: !!disabled }} disabled={disabled} {...rest} style={(state) => [{ opacity: disabled ? 0.5 : state.pressed ? 0.85 : 1, transform: [{ scale: state.pressed ? 0.98 : 1 }] }, typeof style === "function" ? style(state) : style]}>
      <View
        style={{
          minHeight: 52, paddingVertical: space[3], paddingHorizontal: space[6], borderRadius: radius.full, backgroundColor: bg, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: space[2],
          alignSelf: block ? "stretch" : "flex-start", borderWidth: variant === "secondary" ? 1.5 : 0, borderColor: c.line,
        }}>
        {icon ? <Icon name={icon} size={20} color={fg} strokeWidth={2.2} /> : null}
        <AppText variant="body" weight="800" style={{ color: fg, fontSize: 16, textAlign: "center", flexShrink: 1 }}>{label}</AppText>
      </View>
    </Pressable>
  );
}
