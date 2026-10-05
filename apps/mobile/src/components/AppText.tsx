import { Text, type TextProps } from "react-native";
import type { TextStyleName } from "@landing/design-system/tokens";
import { textStyle, useColors, type Colors } from "@/theme";

type Props = TextProps & { variant?: TextStyleName; weight?: string; color?: keyof Colors };

/** Text in a design-system style: display, title, heading, numeral, body-lg (bodyLg), body, label or caption. */
export function AppText({ variant = "body", weight, color = "ink", style, ...rest }: Props) {
  const c = useColors();
  return <Text {...rest} style={[textStyle(variant, weight), { color: c[color] }, style]} />;
}
