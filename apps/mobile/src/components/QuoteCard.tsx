import { useEffect } from "react";
import { useColorScheme, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import { quoteFor } from "@/data/quotes";
import { today } from "@/data/dates";
import { radius, useColors, useLargeText } from "@/theme";
import { AppText } from "./AppText";
import { Card } from "./Card";
import { Mark } from "./Mark";

// The day the mark last wobbled, so it greets each day once rather than every visit to Today.
let wobbledOn = "";

/** Today's thought: one line a day, with the mark tucked into the corner (cropped by the card's edge). With Reduce
 *  Motion off, the mark rocks and settles the first time Today shows each day. */
export function QuoteCard() {
  const c = useColors(), large = useLargeText(), reduce = useReducedMotion(), dark = useColorScheme() === "dark";
  const day = today(), quote = quoteFor(day), height = large ? 72 : 96;
  const tilt = useSharedValue(0);
  useEffect(() => {
    if (reduce || wobbledOn === day) return;
    wobbledOn = day;
    const e = Easing.inOut(Easing.sin);
    tilt.set(withSequence(withTiming(-8, { duration: 220, easing: e }), withTiming(6, { duration: 260, easing: e }), withTiming(-3, { duration: 220, easing: e }), withTiming(0, { duration: 260, easing: e })));
  }, [day, reduce, tilt]);
  const rock = useAnimatedStyle(() => ({ transform: [{ rotate: `${tilt.get()}deg` }] }));
  return (
    <Card tone="apricot" accessible accessibilityLabel={`Today's thought: ${quote}`}
      style={{ borderRadius: radius.xl, padding: 24, paddingRight: large ? 24 : 64, overflow: "hidden", gap: 10 }}>
      {/* The dark theme's apricot ink is made for dark surfaces, so on the pastel card it uses the card's own ink. */}
      <AppText variant="label" color={dark ? "onPastel" : "apricotInk"}>TODAY&apos;S THOUGHT</AppText>
      <AppText variant="display" color="onPastel" style={{ fontSize: 24, lineHeight: 32, letterSpacing: 0 }}>{quote}</AppText>
      {/* At large text sizes the quote runs full width, so leave room below it for the (smaller, less cropped) mark. */}
      {large ? <View style={{ height: 36 }} /> : null}
      <Animated.View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" pointerEvents="none"
        style={[{ position: "absolute", right: large ? -4 : -10, bottom: large ? -6 : -14, transformOrigin: ["50%", "90%", 0] }, rock]}>
        <Mark height={height} hole={c.apricot} color="#DE6F44" room={4} />
      </Animated.View>
    </Card>
  );
}
