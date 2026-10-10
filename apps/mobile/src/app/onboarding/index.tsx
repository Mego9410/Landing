import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, G, Path, Rect } from "react-native-svg";
import { AppText } from "@/components/AppText";
import { Button, useBrand } from "@/components/Button";
import { Mark } from "@/components/Mark";
import { readable } from "@/components/Screen";
import { accountsAvailable } from "@/state/account";
import { track } from "@/state/events";
import { welcomeVariant } from "@/state/onboarding";
import { demoState, replace, set, useApp } from "@/state/store";
import { toast } from "@/state/toast";
import { radius, space, useColors } from "@/theme";

const BODY = "M50 24 C66 24 74 44 74 59 C74 72 63 80 50 80 C37 80 26 72 26 59 C26 44 34 24 50 24 Z";

/** The first screen, in three versions to compare (A: wobble then steady, B: hello I'm Steadie, C: proud and nervous),
 *  one per install. Holding the picture (or the mark) for three seconds opens the demo, for previews and App Review. */
export default function Welcome() {
  const s = useApp();
  const [variant, setVariant] = useState<"A" | "B" | "C" | null>(s.story.welcome);
  useEffect(() => { if (!variant) welcomeVariant().then(setVariant, () => setVariant("A")); }, [variant]);
  const demo = () => { replace({ ...demoState(), disclaimer: s.disclaimer }); toast("Demo mode: Hannah, six weeks in."); router.replace("/"); };
  const start = () => {
    set((st) => { st.story.welcome = variant; });
    track("onboarding_started", { welcome: variant ?? "A" });
    router.push("/onboarding/name");
  };
  const signIn = accountsAvailable() ? () => router.push({ pathname: "/onboarding/account", params: { existing: "1" } }) : null;
  if (!variant) return null;
  if (variant === "B") return <WelcomeB start={start} signIn={signIn} demo={demo} />;
  if (variant === "C") return <WelcomeC start={start} signIn={signIn} demo={demo} />;
  return <WelcomeA start={start} signIn={signIn} demo={demo} />;
}

type Props = { start: () => void; signIn: (() => void) | null; demo: () => void };

function Footer({ start, signIn, label, variant }: Pick<Props, "start" | "signIn"> & { label: string; variant: "brand" | "ink" }) {
  return (
    <View style={{ gap: space[2], marginTop: "auto", paddingTop: space[4] }}>
      <Button label={label} variant={variant} block onPress={start} />
      {signIn ? <Button label="I already have an account" variant="quiet" onPress={signIn} style={{ alignSelf: "center" }} /> : null}
    </View>
  );
}

/** A: the mark on an apricot field with two faint "wobbles" behind it, then the headline on the oat ground. */
function WelcomeA({ start, signIn, demo }: Props) {
  const c = useColors(), brand = useBrand(), insets = useSafeAreaInsets(), { width: W } = useWindowDimensions();
  const top = insets.top + 100;
  return (
    <View style={{ flex: 1, backgroundColor: c.surface }}>
      <Pressable accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" delayLongPress={3000} onLongPress={demo}
        style={{ height: top + 300, backgroundColor: brand, overflow: "hidden" }}>
        <AppText style={{ position: "absolute", left: 24, top: insets.top + 12, fontFamily: "Nunito_800ExtraBold", fontSize: 26, letterSpacing: -0.9, color: "#FBF1E4" }}>steadie</AppText>
        <View style={{ position: "absolute", left: W / 2 - 100, top, width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(251,241,228,0.12)" }} />
        <Svg style={{ position: "absolute", left: W / 2 - 148, top: top - 14 }} width={296} height={267} viewBox="0 10 100 90">
          <G transform="rotate(-30 50 80)" opacity={0.16}><Path d={BODY} fill="#FBF1E4" /></G>
          <G transform="rotate(8 50 80)" opacity={0.22}><Path d={BODY} fill="#FBF1E4" /></G>
          <G transform="rotate(-12 50 80)"><Path d={BODY} fill="#FBF1E4" /><Circle cx={50} cy={64} r={7} fill={brand} /></G>
        </Svg>
        {/* The oat ground rising into the field in a soft curve. */}
        <Svg style={{ position: "absolute", left: 0, bottom: -1 }} width={W} height={70}>
          <Path d={`M0 70 L0 52 Q${W / 2} -18 ${W} 52 L${W} 70 Z`} fill={c.surface} />
        </Svg>
      </Pressable>
      <View style={[{ flex: 1, gap: 14, paddingHorizontal: space[6], paddingBottom: insets.bottom + space[6] }, readable]}>
        <AppText variant="display" accessibilityRole="header" style={{ fontSize: 40, lineHeight: 44 }}>Wobbles are normal. Let’s keep you steady.</AppText>
        <AppText variant="bodyLg" color="inkMuted">A calm 12-month plan for the year after your jab: protein, strength and small daily habits, at your pace.</AppText>
        <Footer start={start} signIn={signIn} label="Find my steady" variant="ink" />
      </View>
    </View>
  );
}

/** B: Steadie introduces itself, with a calm face. */
function WelcomeB({ start, signIn, demo }: Props) {
  const c = useColors(), brand = useBrand(), insets = useSafeAreaInsets();
  return (
    <View style={[{ flex: 1, backgroundColor: c.surface, paddingTop: insets.top + space[4], paddingHorizontal: space[6], paddingBottom: insets.bottom + space[6] }, readable]}>
      <AppText style={{ fontFamily: "Nunito_800ExtraBold", fontSize: 24, letterSpacing: -0.8, color: brand }}>steadie</AppText>
      <View style={{ flex: 1, justifyContent: "center", gap: 22 }}>
        <View style={{ alignSelf: "flex-start", maxWidth: 280, backgroundColor: c.surfaceRaised, borderRadius: 22, paddingVertical: 14, paddingHorizontal: 18, shadowColor: "#6b4a30", shadowOpacity: 0.1, shadowRadius: 20, shadowOffset: { width: 0, height: 6 }, elevation: 2 }}>
          <AppText variant="heading" accessibilityRole="header" style={{ fontSize: 22, lineHeight: 29 }}>Hi, I’m Steadie. I wobble, but I don’t fall over.</AppText>
        </View>
        <Pressable accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" delayLongPress={3000} onLongPress={demo} style={{ alignSelf: "center" }}>
          <Svg width={170} height={231} viewBox="22 18 56 76">
            <G transform="rotate(-12 50 80)">
              <Path d={BODY} fill={brand} />
              <Circle cx={50} cy={64} r={7} fill={c.surface} />
              <Path d="M41.5 46 Q44 48.6 46.5 46" fill="none" stroke="#2A2530" strokeWidth={1.6} strokeLinecap="round" />
              <Path d="M53.5 46 Q56 48.6 58.5 46" fill="none" stroke="#2A2530" strokeWidth={1.6} strokeLinecap="round" />
              <Path d="M47.5 52 Q50 54 52.5 52" fill="none" stroke="#2A2530" strokeWidth={1.6} strokeLinecap="round" />
            </G>
            <Rect x={31} y={85} width={38} height={5} rx={2.5} fill={brand} opacity={0.5} />
          </Svg>
        </Pressable>
        <AppText variant="bodyLg" style={{ textAlign: "center", fontSize: 18, lineHeight: 26, paddingHorizontal: space[2] }}>Let’s make the year after your jab feel a bit like that. Calm, kind and one day at a time.</AppText>
      </View>
      <Footer start={start} signIn={signIn} label="Nice to meet you" variant="brand" />
    </View>
  );
}

/** C: "you've done something huge", with a glimpse of the app. */
function WelcomeC({ start, signIn, demo }: Props) {
  const c = useColors(), brand = useBrand(), insets = useSafeAreaInsets();
  const row = (tone: string, title: string, sub: string) => (
    <View style={{ backgroundColor: c.surfaceRaised, borderRadius: radius.md, padding: space[3], flexDirection: "row", gap: 10, alignItems: "center" }}>
      <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: tone }} />
      <View style={{ flex: 1 }}><AppText weight="800" style={{ fontSize: 13 }}>{title}</AppText><AppText variant="caption" color="inkMuted" style={{ fontSize: 11 }}>{sub}</AppText></View>
    </View>
  );
  return (
    <View style={[{ flex: 1, backgroundColor: c.surface, paddingTop: insets.top + space[3], paddingHorizontal: space[6], paddingBottom: insets.bottom + space[6], gap: 14 }, readable]}>
      <AppText style={{ fontFamily: "Nunito_800ExtraBold", fontSize: 22, letterSpacing: -0.8, color: brand }}>steadie</AppText>
      <AppText variant="title" accessibilityRole="header" style={{ fontSize: 30, lineHeight: 36 }}>You’ve done something huge. It’s normal to feel nervous about what comes next.</AppText>
      <AppText color="inkMuted" style={{ fontSize: 16, lineHeight: 23 }}>Steadie is your plan for the year after the jab. Meals, strength and a two-minute morning check-in, built around you.</AppText>
      <Pressable accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" delayLongPress={3000} onLongPress={demo} style={{ flex: 1, minHeight: 220, marginTop: 4, overflow: "hidden" }}>
        <View style={{ position: "absolute", right: 18, top: 0 }}><Mark height={64} hole={c.surface} ground={false} /></View>
        <View style={{ position: "absolute", left: 30, right: 30, top: 46, bottom: -40, backgroundColor: c.ink, borderRadius: 40, padding: 10 }}>
          <View style={{ flex: 1, backgroundColor: c.surface, borderRadius: 31, padding: 14, paddingTop: 22, gap: 10, overflow: "hidden" }}>
            <AppText variant="heading" style={{ fontSize: 19 }}>Morning, Sam</AppText>
            <View style={{ backgroundColor: c.sage, borderRadius: radius.md, padding: space[3], gap: 4 }}>
              <AppText weight="800" color="onPastel" style={{ fontSize: 11, letterSpacing: 0.9 }}>MORNING CHECK-IN</AppText>
              <AppText weight="800" color="onPastel" style={{ fontSize: 14 }}>How did yesterday go?</AppText>
            </View>
            {row(c.butter, "Greek yoghurt, berries, oats", "Breakfast · 30 g protein")}
            {row(c.lilac, "Strength, session 1", "20 minutes · just a chair")}
          </View>
        </View>
      </Pressable>
      <Footer start={start} signIn={signIn} label="Show me how it works" variant="brand" />
    </View>
  );
}
