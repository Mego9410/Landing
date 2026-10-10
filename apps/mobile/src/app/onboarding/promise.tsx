import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, Pressable, View } from "react-native";
import Animated, { cancelAnimation, Easing, runOnJS, useAnimatedProps, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import Svg, { Circle, G, Path, Rect } from "react-native-svg";
import { AppText } from "@/components/AppText";
import { Button, useBrand } from "@/components/Button";
import { OnbScreen } from "@/components/Onboarding";
import { set, useApp } from "@/state/store";
import { space, useColors } from "@/theme";

const BODY = "M50 24 C66 24 74 44 74 59 C74 72 63 80 50 80 C37 80 26 72 26 59 C26 44 34 24 50 24 Z";
const AnimatedG = Animated.createAnimatedComponent(G);
const HOLD_MS = 1600;

/** 21 · A steady promise: hold Steadie and it stops wobbling as you hold; let go early and it wobbles again. VoiceOver
 *  users can activate it in one go. Optional: Skip carries on. */
export default function Promise() {
  const s = useApp(), c = useColors(), brand = useBrand();
  const name = s.name.trim();
  const hold = useSharedValue(0), wobble = useSharedValue(0);
  const [made, setMade] = useState(!!s.story.promisedAt);
  const reduce = useRef(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().catch(() => false).then((r) => {
      reduce.current = r;
      if (!r && !made) wobble.set(withRepeat(withSequence(withTiming(1, { duration: 420, easing: Easing.inOut(Easing.sin) }), withTiming(-1, { duration: 420, easing: Easing.inOut(Easing.sin) })), -1, true));
    });
    return () => cancelAnimation(wobble);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const tilt = useAnimatedProps(() => ({ rotation: -12 + wobble.value * 12 * (1 - hold.value), originX: 50, originY: 80 }));
  const ring = useAnimatedStyle(() => ({ transform: [{ scale: 0.55 + 0.45 * hold.value }], opacity: 0.35 + 0.5 * hold.value }));

  function done() {
    setMade(true);
    cancelAnimation(wobble);
    wobble.set(withTiming(0, { duration: 200 }));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    set((st) => { st.story.promisedAt = new Date().toISOString(); });
    setTimeout(() => router.push("/onboarding/first-checkin"), 900);
  }
  const start = () => { if (made) return; Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}); hold.set(withTiming(1, { duration: HOLD_MS * (1 - hold.get()), easing: Easing.linear }, (fin) => { if (fin) runOnJS(done)(); })); };
  const stop = () => { if (!made) hold.set(withTiming(0, { duration: 300 })); };

  return (
    <OnbScreen route="promise" ground="surface" style={{ alignItems: "stretch" }} footer={made ? null : <Button label="Skip" variant="quiet" onPress={() => router.push("/onboarding/first-checkin")} style={{ alignSelf: "center" }} />}>
      <AppText variant="label" color="inkMuted" style={{ textAlign: "center", marginTop: space[2] }}>A STEADY PROMISE</AppText>
      <AppText variant="heading" accessibilityRole="header" style={{ textAlign: "center", fontSize: 27, lineHeight: 35, marginTop: space[2], fontFamily: "Fredoka_500Medium" }}>
        I{name ? `, ${name},` : ""} will take the year after the jab one steady day at a time.
      </AppText>
      <Pressable onPressIn={start} onPressOut={stop} accessibilityRole="button" accessibilityLabel={made ? "Promise made" : "Hold Steadie to make your promise"}
        accessibilityActions={[{ name: "activate" }]} onAccessibilityAction={() => { if (!made) done(); }}
        style={{ alignSelf: "center", width: 240, height: 240, marginTop: space[8], alignItems: "center", justifyContent: "center" }}>
        <View style={{ position: "absolute", inset: 0, borderRadius: 120, backgroundColor: c.apricot, opacity: 0.45 }} />
        <Animated.View style={[{ position: "absolute", inset: 0, borderRadius: 120, backgroundColor: c.apricot }, ring]} />
        <Svg width={120} height={163} viewBox="22 18 56 76">
          <AnimatedG animatedProps={tilt}><Path d={BODY} fill={brand} /><Circle cx={50} cy={64} r={7} fill={c.apricot} /></AnimatedG>
          <Rect x={31} y={85} width={38} height={5} rx={2.5} fill={brand} opacity={0.5} />
        </Svg>
      </Pressable>
      <AppText weight="800" style={{ textAlign: "center", fontSize: 17, marginTop: space[5] }} accessibilityLiveRegion="polite">{made ? "Promise made. Steady it is." : "Hold Steadie to make it yours"}</AppText>
      {made ? null : <AppText variant="caption" color="inkMuted" style={{ textAlign: "center" }}>It stops wobbling as you hold</AppText>}
    </OnbScreen>
  );
}
