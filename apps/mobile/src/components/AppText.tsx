import { Children, type ReactNode } from "react";
import { Text, type TextProps } from "react-native";
import type { TextStyleName } from "@landing/design-system/tokens";
import { localise, useRegion } from "@/data/region";
import { textStyle, useColors, type Colors } from "@/theme";

type Props = TextProps & { variant?: TextStyleName; weight?: string; color?: keyof Colors };

/** Text in a design-system style: display, title, heading, numeral, body-lg (bodyLg), body, label or caption. Words are
 *  shown for the person's country (data/region.ts): the UK text as written, or its US version. */
export function AppText({ variant = "body", weight, color = "ink", style, children, accessibilityLabel, ...rest }: Props) {
  const c = useColors(), r = useRegion();
  const words = r === "uk" ? children : Children.map(children, (ch: ReactNode) => (typeof ch === "string" ? localise(ch, r) : ch));
  return (
    <Text {...rest} accessibilityLabel={accessibilityLabel && r !== "uk" ? localise(accessibilityLabel, r) : accessibilityLabel}
      style={[textStyle(variant, weight), { color: c[color] }, style]}>{words}</Text>
  );
}
