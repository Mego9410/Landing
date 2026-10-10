// The onboarding screens' building blocks, from the onboarding design (warm-morning look: oat ground, white cards,
// apricot for choices, the roly-poly mark as narrator): the screen frame with its act label and progress bar, options
// that answer back, chips, Steadie's speech bubble and tick boxes.
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, ScrollView, View, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { stepOf } from "@/state/onboarding";
import { radius, space, useColors, type Colors } from "@/theme";
import { AppText } from "./AppText";
import { Icon } from "./Icon";
import { Mark } from "./Mark";
import { readable } from "./Screen";

const tap = () => Haptics.selectionAsync().catch(() => {});

/** A whole onboarding screen. `route` (a FLOW route) shows the back button, act and progress bar; `ground` and `accent`
 *  recolour a screen with its own background (the lilac biology screen, the sky nudge screen). The footer sits at the
 *  bottom, or below the content when that's taller than the screen. */
export function OnbScreen({ route, ground, accent, children, footer, onBack, back = true, style }: {
  route?: string; ground?: keyof Colors; accent?: keyof Colors; children: ReactNode; footer?: ReactNode; onBack?: () => void; back?: boolean; style?: ViewStyle;
}) {
  const c = useColors(), insets = useSafeAreaInsets();
  const step = route ? stepOf(route) : null;
  const ink = accent ? c[accent] : c.apricotInk;
  return (
    <View style={{ flex: 1, backgroundColor: ground ? c[ground] : c.surface }}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[{ flexGrow: 1, paddingTop: insets.top + space[4], paddingHorizontal: space[6], paddingBottom: insets.bottom + space[6] }, readable, style]}>
        {step ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14, marginBottom: space[6] }}>
            {back ? (
              <Pressable accessibilityRole="button" accessibilityLabel="Back" hitSlop={6} onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace("/onboarding")))}
                style={({ pressed }) => ({ width: 44, height: 44, borderRadius: radius.full, backgroundColor: c.surfaceRaised, alignItems: "center", justifyContent: "center", opacity: pressed ? 0.7 : 1,
                  shadowColor: "#6b4a30", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1 })}>
                <Icon name="back" size={20} color={c.ink} strokeWidth={2.4} />
              </Pressable>
            ) : null}
            <View style={{ flex: 1, gap: 6 }} accessible accessibilityRole="progressbar" accessibilityLabel={`${step.act}, ${Math.round(step.progress * 100)}% of the way`}>
              <AppText variant="label" style={{ color: ink }} maxFontSizeMultiplier={1.4}>{step.act.toUpperCase()}</AppText>
              <View style={{ height: 6, borderRadius: radius.full, backgroundColor: accent ? c.surfaceRaised : c.surfaceSunk, overflow: "hidden" }}>
                <View style={{ width: `${Math.round(step.progress * 100)}%`, height: "100%", borderRadius: radius.full, backgroundColor: accent ? c[accent] : c.apricotInk }} />
              </View>
            </View>
          </View>
        ) : null}
        <View style={{ gap: space[3] }}>{children}</View>
        {footer ? <View style={{ marginTop: "auto", paddingTop: space[6], gap: space[3] }}>{footer}</View> : null}
      </ScrollView>
    </View>
  );
}

export function Title({ children, center, color }: { children: ReactNode; center?: boolean; color?: keyof Colors }) {
  return <AppText variant="title" accessibilityRole="header" color={color} style={{ fontSize: 30, lineHeight: 36, textAlign: center ? "center" : "left" }}>{children}</AppText>;
}

export function Lede({ children, center, color = "inkMuted" }: { children: ReactNode; center?: boolean; color?: keyof Colors }) {
  return <AppText variant="bodyLg" color={color} style={{ textAlign: center ? "center" : "left" }}>{children}</AppText>;
}

/** A small mark on a line of its own: Steadie answering back. */
function Reply({ text }: { text: string }) {
  const c = useColors();
  return (
    <View style={{ flexDirection: "row", gap: space[2], alignItems: "flex-start" }}>
      <View style={{ marginTop: 2 }}><Mark height={20} color={c.apricotInk} hole={c.apricot} ground={false} /></View>
      <AppText variant="caption" weight="700" color="onPastel" style={{ flex: 1, fontSize: 14, lineHeight: 20 }}>{text}</AppText>
    </View>
  );
}

/** A full-width option. Chosen, it turns apricot and, with a `reply`, Steadie says something back. */
export function Opt({ label, on, onPress, reply, multi, muted, children }: { label: string; on: boolean; onPress: () => void; reply?: string; multi?: boolean; muted?: boolean; children?: ReactNode }) {
  const c = useColors();
  return (
    <Pressable accessibilityRole={multi ? "checkbox" : "radio"} accessibilityState={multi ? { checked: on } : { selected: on }} accessibilityLabel={label} accessibilityHint={on && reply ? reply : undefined}
      onPress={() => { tap(); onPress(); }}
      style={({ pressed }) => ({ gap: 6, padding: space[4], paddingHorizontal: 18, borderRadius: 18, minHeight: 56, justifyContent: "center", backgroundColor: on ? c.apricot : c.surfaceRaised, borderWidth: 1.5, borderColor: on ? c.apricot : c.line, opacity: pressed ? 0.85 : 1 })}>
      <AppText weight="700" color={on ? "onPastel" : muted ? "inkMuted" : "ink"} style={{ fontSize: 17 }}>{label}</AppText>
      {children}
      {on && reply ? <Reply text={reply} /> : null}
    </Pressable>
  );
}

/** A pill choice. */
export function Chip({ label, on, onPress, multi, style }: { label: string; on: boolean; onPress: () => void; multi?: boolean; style?: ViewStyle }) {
  const c = useColors();
  return (
    <Pressable accessibilityRole={multi ? "checkbox" : "radio"} accessibilityState={multi ? { checked: on } : { selected: on }} onPress={() => { tap(); onPress(); }}
      style={({ pressed }) => [{ minHeight: 44, paddingVertical: 10, paddingHorizontal: space[4], borderRadius: radius.full, alignItems: "center", justifyContent: "center", backgroundColor: on ? c.apricot : c.surfaceRaised, borderWidth: 1.5, borderColor: on ? c.apricot : c.line, opacity: pressed ? 0.85 : 1 }, style]}>
      <AppText weight="700" color={on ? "onPastel" : "ink"} style={{ fontSize: 16 }}>{label}</AppText>
    </Pressable>
  );
}

export function Chips({ children, center }: { children: ReactNode; center?: boolean }) {
  return <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2], justifyContent: center ? "center" : "flex-start" }}>{children}</View>;
}

/** Steadie, small, with something to say in a white bubble. */
export function Bubble({ children, size = 60 }: { children: ReactNode; size?: number }) {
  const c = useColors();
  return (
    <View style={{ flexDirection: "row", gap: space[3], alignItems: "flex-end" }} accessible accessibilityLabel={typeof children === "string" ? `Steadie says: ${children}` : undefined}>
      <Mark height={size} hole={c.surface} />
      <View style={{ flex: 1, marginBottom: space[6], backgroundColor: c.surfaceRaised, borderRadius: 22, paddingVertical: 14, paddingHorizontal: 18,
        shadowColor: "#6b4a30", shadowOpacity: 0.1, shadowRadius: 20, shadowOffset: { width: 0, height: 6 }, elevation: 2 }}>
        <AppText weight="700" style={{ fontSize: 16, lineHeight: 23 }}>{children}</AppText>
      </View>
    </View>
  );
}

/** A tick box row, dark when ticked. */
export function TickOpt({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  const c = useColors();
  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked }} accessibilityLabel={label} onPress={() => { tap(); onChange(!checked); }}
      style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: space[3], padding: space[4], paddingHorizontal: 18, borderRadius: 18, minHeight: 56, backgroundColor: checked ? c.apricot : c.surfaceRaised, borderWidth: 1.5, borderColor: checked ? c.apricot : c.line, opacity: pressed ? 0.85 : 1 })}>
      <View style={{ width: 26, height: 26, borderRadius: 9, borderWidth: 2, borderColor: checked ? c.ink : c.inkMuted, backgroundColor: checked ? c.ink : "transparent", alignItems: "center", justifyContent: "center" }}>
        {checked ? <Icon name="check" size={15} color={c.surface} strokeWidth={3.2} /> : null}
      </View>
      <AppText weight="700" color={checked ? "onPastel" : "ink"} style={{ flex: 1, fontSize: 16, lineHeight: 22 }}>{label}</AppText>
    </Pressable>
  );
}

/** A white rounded card. */
export function OnbCard({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  const c = useColors();
  return <View style={[{ backgroundColor: c.surfaceRaised, borderRadius: radius.lg, padding: 18, shadowColor: "#6b4a30", shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 1 }, style]}>{children}</View>;
}

/** Adds or removes `id` from a list, keeping at most `max`. */
export const toggle = (list: string[], id: string, max = Infinity) => (list.includes(id) ? list.filter((x) => x !== id) : list.length >= max ? list : [...list, id]);
