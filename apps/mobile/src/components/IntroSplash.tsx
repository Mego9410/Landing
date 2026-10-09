// The cold-start intro: the roly-poly mark rocks and settles, moves into the lockup, "steadie" rises in and the weight
// dot drops onto the i, then the whole thing fades into the app. Frame 0 matches the native splash exactly
// (expo-splash-screen draws the 0–100 logo box at 120pt across 84.4 units, centred on unit (50, 56)).
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useRef, useState } from "react";
import { AccessibilityInfo, type LayoutChangeEvent, Pressable, StyleSheet, useColorScheme, useWindowDimensions, View } from "react-native";
import Animated, { cancelAnimation, Easing, runOnJS, type SharedValue, useAnimatedProps, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Circle, G, Path, Rect } from "react-native-svg";

const ROCK = [[0, -12], [110, -21], [270, 6], [410, -16], [530, -9], [640, -12]];
const T = { moveA: 560, moveB: 1000, lettersA: 860, stagger: 45, letterDur: 280, dotA: 1300, dotB: 1600, holdEnd: 1950, exitEnd: 2200 };
const WORD = ["s", "t", "e", "a", "d", "ı", "e"];
const DOTLESS_I = 5;
const F = 50;                       // wordmark size, pt
const U0 = 120 / 84.4;              // pt per logo unit in the native splash
const U1 = (1.15 * F) / 76;         // pt per logo unit in the lockup (the bare mark is 76 units tall)
const S0 = 100 * U0;                // the mark's svg box at splash size
const GAP = 0.26 * F;
const MARK_W1 = 56 * U1;            // bare mark width in the lockup
const WORD_DY = 0;                  // tune on device: nudge the wordmark up/down to sit on the mark's optical centre
const DOT_DY = 0;                   // tune on device: the dot's resting height above the ı stem
const BODY = "M50 24 C66 24 74 44 74 59 C74 72 63 80 50 80 C37 80 26 72 26 59 C26 44 34 24 50 24 Z";

const PALETTE = {
  light: { bg: "#DE6F44", mark: "#FBF1E4", word: "#FBF1E4", dot: "#FBF1E4" },
  dark: { bg: "#1C1B22", mark: "#F2A27A", word: "#F5EFE6", dot: "#F2A27A" },
};

const AnimatedG = Animated.createAnimatedComponent(G);

function seg(t: number, a: number, b: number) { "worklet"; return Math.min(1, Math.max(0, (t - a) / (b - a))); }
function sine(x: number) { "worklet"; return -(Math.cos(Math.PI * x) - 1) / 2; }
function cubicInOut(x: number) { "worklet"; return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
function cubicOut(x: number) { "worklet"; return 1 - Math.pow(1 - x, 3); }
function drop(x: number) { "worklet"; if (x < 0.72) { const u = x / 0.72; return u * u; } return 1 - 0.12 * Math.sin(Math.PI * ((x - 0.72) / 0.28)); }
function rock(t: number) {
  "worklet";
  if (t <= ROCK[0][0]) return ROCK[0][1];
  for (let i = 1; i < ROCK.length; i++) {
    if (t <= ROCK[i][0]) return ROCK[i - 1][1] + (ROCK[i][1] - ROCK[i - 1][1]) * sine((t - ROCK[i - 1][0]) / (ROCK[i][0] - ROCK[i - 1][0]));
  }
  return ROCK[ROCK.length - 1][1];
}

function Letter({ ch, i, t, color, onLayout }: { ch: string; i: number; t: SharedValue<number>; color: string; onLayout?: (e: LayoutChangeEvent) => void }) {
  const style = useAnimatedStyle(() => {
    const a = cubicOut(seg(t.value, T.lettersA + i * T.stagger, T.lettersA + i * T.stagger + T.letterDur));
    return { opacity: a, transform: [{ translateY: (1 - a) * 0.22 * F }] };
  });
  return <Animated.Text onLayout={onLayout} style={[styles.letter, { color }, style]}>{ch}</Animated.Text>;
}

/** Plays once per cold start. Hides the native splash itself, then calls onDone after fading out. */
export function IntroSplash({ ready, onDone }: { ready: boolean; onDone: () => void }) {
  const { width: W, height: H } = useWindowDimensions();
  const c = PALETTE[useColorScheme() === "dark" ? "dark" : "light"];
  const t = useSharedValue(0);
  const wordW = useSharedValue(3.3 * F);
  const [wordWidth, setWordWidth] = useState(3.3 * F);
  const [dotX, setDotX] = useState(0);
  const [held, setHeld] = useState(false);
  const started = useRef(false);
  const exiting = useRef(false);

  const finish = useCallback(() => onDone(), [onDone]);
  const exit = useCallback((duration = T.exitEnd - T.holdEnd) => {
    if (exiting.current) return;
    exiting.current = true;
    cancelAnimation(t);
    t.set(withTiming(T.exitEnd, { duration, easing: Easing.linear }, (done) => { if (done) runOnJS(finish)(); }));
  }, [t, finish]);

  // Start on the first layout, once the overlay has drawn the frame that matches the native splash.
  const onFirstLayout = useCallback(() => {
    if (started.current) return;
    started.current = true;
    requestAnimationFrame(() => {
      SplashScreen.hideAsync().catch(() => {});
      AccessibilityInfo.isReduceMotionEnabled().catch(() => false).then((reduce) => {
        if (reduce) t.set(T.dotB);
        t.set(withTiming(T.holdEnd, { duration: reduce ? 350 : T.holdEnd, easing: Easing.linear }, (done) => { if (done) runOnJS(setHeld)(true); }));
      });
    });
  }, [t]);

  useEffect(() => { if (held && ready) exit(); }, [held, ready, exit]);

  const total1 = MARK_W1 + GAP + wordWidth;
  const wordLeft = W / 2 - total1 / 2 + MARK_W1 + GAP;
  const markBottom = H / 2 + (90 - 56) * U1;                        // ground line bottom in the lockup
  const wordTop = markBottom - 0.06 * 76 * U1 - 0.02 * F - 0.8 * F + WORD_DY;

  const overlayStyle = useAnimatedStyle(() => ({ opacity: 1 - cubicInOut(seg(t.value, T.holdEnd, T.exitEnd)) }));
  const liftStyle = useAnimatedStyle(() => {
    const e = cubicInOut(seg(t.value, T.holdEnd, T.exitEnd));
    return { transform: [{ translateY: -6 * e }, { scale: 1 + 0.03 * e }] };
  });
  const markStyle = useAnimatedStyle(() => {
    const mv = cubicInOut(seg(t.value, T.moveA, T.moveB));
    const markCx1 = -(MARK_W1 + GAP + wordW.value) / 2 + MARK_W1 / 2;  // final mark centre, relative to the screen centre
    return { transform: [{ translateX: markCx1 * mv }, { scale: (U0 + (U1 - U0) * mv) / U0 }] };
  });
  const bodyProps = useAnimatedProps(() => ({ rotation: rock(t.value), originX: 50, originY: 80 }));
  const dotStyle = useAnimatedStyle(() => {
    const p = drop(seg(t.value, T.dotA, T.dotB));
    return { opacity: Math.min(1, p * 4), transform: [{ translateY: (p - 1) * 0.9 * F }] };
  });

  const onWordLayout = (e: LayoutChangeEvent) => { const w = e.nativeEvent.layout.width; setWordWidth(w); wordW.set(w); };
  const onILayout = (e: LayoutChangeEvent) => { const { x, width } = e.nativeEvent.layout; setDotX(x + width / 2); };

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: c.bg }, overlayStyle]} onLayout={onFirstLayout}
      accessible accessibilityLabel="Steadie" accessibilityRole="image">
      <Pressable style={StyleSheet.absoluteFill} onPress={() => (ready ? exit(200) : setHeld(true))} accessibilityLabel="Skip intro">
        <Animated.View style={[StyleSheet.absoluteFill, liftStyle]}>
          <Animated.View style={[{ position: "absolute", left: W / 2 - S0 / 2, top: H / 2 - S0 / 2, width: S0, height: S0 }, markStyle]}>
            {/* viewBox starts at y=6 so the box's centre is logo unit (50, 56), as in the native splash */}
            <Svg width={S0} height={S0} viewBox="0 6 100 100">
              <Rect x={31} y={85} width={38} height={5} rx={2.5} fill={c.mark} opacity={0.5} />
              <AnimatedG animatedProps={bodyProps}>
                <Path d={BODY} fill={c.mark} />
                <Circle cx={50} cy={64} r={7} fill={c.bg} />
              </AnimatedG>
            </Svg>
          </Animated.View>
          <View style={{ position: "absolute", left: wordLeft, top: wordTop, flexDirection: "row" }} onLayout={onWordLayout}>
            {WORD.map((ch, i) => <Letter key={i} ch={ch} i={i} t={t} color={c.word} onLayout={i === DOTLESS_I ? onILayout : undefined} />)}
            <Animated.View style={[styles.dot, { left: dotX - 0.08 * F, top: 0.1 * F + DOT_DY, backgroundColor: c.dot }, dotStyle]} />
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  letter: { fontFamily: "Nunito_800ExtraBold", fontSize: F, lineHeight: F * 1.0, letterSpacing: -0.035 * F, includeFontPadding: false },
  dot: { position: "absolute", width: 0.16 * F, height: 0.16 * F, borderRadius: 0.08 * F },
});
