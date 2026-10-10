// The cold-start intro: the roly-poly mark rocks and settles, moves into the lockup, "steadie" rises in and the weight
// dot drops onto the ı, then the whole thing fades into the app. The letters are the logo's own outlines (wordmark.ts),
// so they sit exactly as in the brand lockup. Frame 0 matches the native splash exactly
// (expo-splash-screen draws the 0–100 logo box at 120pt across 84.4 units, centred on unit (50, 56)).
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useRef, useState } from "react";
import { AccessibilityInfo, type LayoutChangeEvent, Pressable, StyleSheet, useColorScheme, useWindowDimensions } from "react-native";
import Animated, { cancelAnimation, Easing, runOnJS, type SharedValue, useAnimatedProps, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Circle, G, Path, Rect } from "react-native-svg";
import { LETTERS, LOCKUP } from "./wordmark";

const ROCK = [[0, -12], [110, -21], [270, 6], [410, -16], [530, -9], [640, -12]];
// The dot takes half a second to fall and settle, so it floats down rather than dropping like a stone.
const T = { moveA: 560, moveB: 1000, lettersA: 860, stagger: 45, letterDur: 280, dotA: 1250, dotB: 1750, holdEnd: 1950, exitEnd: 2200 };
const F = 50;                       // wordmark size, pt
const K = F / 100;                  // pt per lockup unit (the lockup svg is drawn at wordmark size 100)
const U0 = 120 / 84.4;              // pt per logo unit in the native splash
const U1 = (LOCKUP.height / LOCKUP.mark.viewBox[3]) * K;  // pt per logo unit in the lockup
const S0 = 100 * U0;                // the mark's svg box at splash size
// Where logo unit (50, 56), the point the splash centres, sits in the lockup.
const MARK_CX = LOCKUP.mark.x + (50 - LOCKUP.mark.viewBox[0]) * (LOCKUP.mark.width / LOCKUP.mark.viewBox[2]);
const MARK_CY = (56 - LOCKUP.mark.viewBox[1]) * (LOCKUP.height / LOCKUP.mark.viewBox[3]);
const PAD = 2;                      // lockup units around each letter, so antialiased edges aren't clipped
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
// Falls with a gentle sine ease, touches down at 60%, rises a little and settles.
function drop(x: number) { "worklet"; if (x < 0.6) return 1 - Math.cos((x / 0.6) * (Math.PI / 2)); return 1 - 0.07 * Math.sin(Math.PI * ((x - 0.6) / 0.4)); }
function rock(t: number) {
  "worklet";
  if (t <= ROCK[0][0]) return ROCK[0][1];
  for (let i = 1; i < ROCK.length; i++) {
    if (t <= ROCK[i][0]) return ROCK[i - 1][1] + (ROCK[i][1] - ROCK[i - 1][1]) * sine((t - ROCK[i - 1][0]) / (ROCK[i][0] - ROCK[i - 1][0]));
  }
  return ROCK[ROCK.length - 1][1];
}

function Letter({ i, t, color, left, top }: { i: number; t: SharedValue<number>; color: string; left: number; top: number }) {
  const { x0, x1, d } = LETTERS[i];
  const style = useAnimatedStyle(() => {
    const a = cubicOut(seg(t.value, T.lettersA + i * T.stagger, T.lettersA + i * T.stagger + T.letterDur));
    return { opacity: a, transform: [{ translateY: (1 - a) * 0.22 * F }] };
  });
  const w = x1 - x0 + 2 * PAD;
  return (
    <Animated.View style={[{ position: "absolute", left: left + (x0 - PAD) * K, top, width: w * K, height: LOCKUP.height * K }, style]}>
      <Svg width={w * K} height={LOCKUP.height * K} viewBox={`${x0 - PAD} 0 ${w} ${LOCKUP.height}`}>
        <Path d={d} fill={color} />
      </Svg>
    </Animated.View>
  );
}

/** Plays once per cold start. Hides the native splash itself, then calls onDone after fading out. */
export function IntroSplash({ ready, onDone }: { ready: boolean; onDone: () => void }) {
  const win = useWindowDimensions();
  // The overlay's own size once laid out (on web the window size can read as zero on the first render).
  const [box, setBox] = useState<{ width: number; height: number } | null>(null);
  const W = box?.width || win.width, H = box?.height || win.height;
  const c = PALETTE[useColorScheme() === "dark" ? "dark" : "light"];
  const t = useSharedValue(0);
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
  const onFirstLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setBox((b) => (b && b.width === width && b.height === height ? b : { width, height }));
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

  // The finished lockup, centred across the screen, with the mark's splash centre on the screen's middle line.
  const left = W / 2 - (LOCKUP.width * K) / 2;
  const top = H / 2 - MARK_CY * K;
  const markDx = left + MARK_CX * K - W / 2;                         // the mark's final shift from the screen centre
  const { cx, cy, r } = LOCKUP.dot;

  const overlayStyle = useAnimatedStyle(() => ({ opacity: 1 - cubicInOut(seg(t.value, T.holdEnd, T.exitEnd)) }));
  const liftStyle = useAnimatedStyle(() => {
    const e = cubicInOut(seg(t.value, T.holdEnd, T.exitEnd));
    return { transform: [{ translateY: -6 * e }, { scale: 1 + 0.03 * e }] };
  });
  const markStyle = useAnimatedStyle(() => {
    const mv = cubicInOut(seg(t.value, T.moveA, T.moveB));
    return { transform: [{ translateX: markDx * mv }, { scale: (U0 + (U1 - U0) * mv) / U0 }] };
  });
  const bodyProps = useAnimatedProps(() => ({ rotation: rock(t.value), originX: 50, originY: 80 }));
  const dotStyle = useAnimatedStyle(() => {
    const p = drop(seg(t.value, T.dotA, T.dotB));
    return { opacity: Math.min(1, seg(t.value, T.dotA, T.dotA + 120)), transform: [{ translateY: (p - 1) * 0.9 * F }] };
  });

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
          {LETTERS.map((_, i) => <Letter key={i} i={i} t={t} color={c.word} left={left} top={top} />)}
          <Animated.View style={[{ position: "absolute", left: left + (cx - r) * K, top: top + (cy - r) * K, width: 2 * r * K, height: 2 * r * K, borderRadius: r * K, backgroundColor: c.dot }, dotStyle]} />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}
