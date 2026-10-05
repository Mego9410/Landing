import { Pressable, View, type PressableProps } from "react-native";
import { radius, space, useColors } from "@/theme";
import { AppText } from "./AppText";
import { Icon, type IconName } from "./Icon";

type Props = PressableProps & { label: string; variant?: "primary" | "secondary" | "quiet"; icon?: IconName; block?: boolean };

/** Pill-shaped button. Primary (apricot) at most once per screen. */
export function Button({ label, variant = "primary", icon, block, style, ...rest }: Props) {
  const c = useColors();
  const bg = variant === "primary" ? c.apricot : variant === "secondary" ? c.surfaceRaised : "transparent";
  const fg = variant === "primary" ? c.onPastel : variant === "quiet" ? c.apricotInk : c.ink;
  return (
    <Pressable accessibilityRole="button" {...rest} style={(state) => [{ opacity: state.pressed ? 0.85 : 1, transform: [{ scale: state.pressed ? 0.98 : 1 }] }, typeof style === "function" ? style(state) : style]}>
      <View
        style={{
          height: 52, paddingHorizontal: space[6], borderRadius: radius.full, backgroundColor: bg, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: space[2],
          alignSelf: block ? "stretch" : "flex-start", borderWidth: variant === "secondary" ? 1.5 : 0, borderColor: c.line,
        }}>
        {icon ? <Icon name={icon} size={20} color={fg} strokeWidth={2.2} /> : null}
        <AppText variant="body" weight="800" style={{ color: fg, fontSize: 16 }}>{label}</AppText>
      </View>
    </Pressable>
  );
}
