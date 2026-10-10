import { router } from "expo-router";
import { useEffect, useState } from "react";
import { AccessibilityInfo, View } from "react-native";
import Animated, { useAnimatedProps, useSharedValue, withSequence, withTiming, Easing } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, G, Path, Rect } from "react-native-svg";
import { AppText } from "@/components/AppText";
import { Icon } from "@/components/Icon";
import { proteinTargetsOff, sessionsPaused } from "@/state/health";
import { daysPhrase, mealsPhrase, noiseMoment, WHERE_PHRASE } from "@/state/onboarding";
import { useApp } from "@/state/store";
import { space, useColors } from "@/theme";

const BODY = "M50 24 C66 24 74 44 74 59 C74 72 63 80 50 80 C37 80 26 72 26 59 C26 44 34 24 50 24 Z";
const AnimatedG = Animated.createAnimatedComponent(G);
const INK = "#2A2530", CREAM = "#FBF1E4";

/** 19 · Building your plan: the mark rocks and settles while each choice is ticked off, then the first week. No back
 *  button: it moves on by itself in about four seconds. */
export default function Building() {
  const s = useApp(), c = useColors(), insets = useSafeAreaInsets();
  const name = s.name.trim();
  const steps = [
    s.story.where ? `Planning around ${WHERE_PHRASE[s.story.where]}` : "Planning around your last jab",
    `Choosing ${mealsPhrase(s)}`,
    s.settings.safeMode || proteinTargetsOff(s) ? "Setting gentle protein habits" : "Setting your daily protein goal",
    sessionsPaused(s) ? "Keeping strength ready for when your GP is happy" : s.settings.reminders.sessions.days.length ? `Booking strength for ${daysPhrase(s.settings.reminders.sessions.days)}` : "Lining up two short strength sessions",
    ...(s.story.ifThen ? [`Adding your ${noiseMoment(s.story).short} plan`] : []),
  ];
  const [done, setDone] = useState(0);
  const tilt = useSharedValue(-12);
  const props = useAnimatedProps(() => ({ rotation: tilt.value, originX: 50, originY: 80 }));

  useEffect(() => {
    let live = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    AccessibilityInfo.isReduceMotionEnabled().catch(() => false).then((reduce) => {
      if (!live) return;
      if (!reduce) tilt.set(withSequence(...[-24, 2, -20, -6, -16, -12].map((v) => withTiming(v, { duration: 380, easing: Easing.inOut(Easing.sin) }))));
      const gap = reduce ? 250 : 650;
      steps.forEach((_, i) => timers.push(setTimeout(() => live && setDone(i + 1), gap * (i + 1))));
      timers.push(setTimeout(() => live && router.replace("/onboarding/first-week"), gap * steps.length + 900));
    });
    return () => { live = false; timers.forEach(clearTimeout); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View style={{ flex: 1, backgroundColor: INK, paddingTop: insets.top, paddingHorizontal: space[6], paddingBottom: insets.bottom + space[4] }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 26 }}>
        <Svg width={120} height={163} viewBox="22 18 56 76" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <AnimatedG animatedProps={props}><Path d={BODY} fill="#F2A27A" /><Circle cx={50} cy={64} r={7} fill={INK} /></AnimatedG>
          <Rect x={31} y={85} width={38} height={5} rx={2.5} fill="#F2A27A" opacity={0.5} />
        </Svg>
        <AppText variant="title" accessibilityRole="header" style={{ color: CREAM, textAlign: "center", fontSize: 30, lineHeight: 36 }}>{name ? `Building your plan, ${name}` : "Building your plan"}</AppText>
      </View>
      <View accessibilityLiveRegion="polite" style={{ gap: 14, backgroundColor: c.surface, borderRadius: 26, padding: space[5], paddingVertical: 22 }}>
        {steps.map((t, i) => {
          const ok = i < done, now = i === done;
          return (
            <View key={t} style={{ flexDirection: "row", gap: space[3], alignItems: "center", opacity: ok || now ? 1 : 0.45 }}>
              <View style={{ width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: ok ? c.ink : "transparent", borderWidth: ok ? 0 : 2, borderColor: c.inkMuted }}>
                {ok ? <Icon name="check" size={15} color={c.surface} strokeWidth={3} /> : null}
              </View>
              <AppText weight="700" color={ok ? "ink" : "inkMuted"} style={{ flex: 1, fontSize: 16, lineHeight: 22 }}>{t}</AppText>
            </View>
          );
        })}
      </View>
    </View>
  );
}
