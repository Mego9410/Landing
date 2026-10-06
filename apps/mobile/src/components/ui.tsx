// Shared building blocks for the screens, matching the prototype's layout classes (apps/prototype/app.css):
// header, list rows, choice chips, radio options, a toggle, a meter, pill tags and banners.
import { router } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, Switch, View, type ViewStyle } from "react-native";
import { radius, space, useColors, type Colors } from "@/theme";
import { AppText } from "./AppText";
import { Icon, type IconName } from "./Icon";

type Tone = "apricot" | "sage" | "lilac" | "sky" | "butter" | "rose" | "sunk";
const bgFor = (c: Colors, t: Tone) => (t === "sunk" ? c.surfaceSunk : c[t]);

/** A round icon button. */
export function IconButton({ icon, label, onPress, flat }: { icon: IconName; label: string; onPress: () => void; flat?: boolean }) {
  const c = useColors();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} hitSlop={6}
      style={({ pressed }) => ({ width: 44, height: 44, borderRadius: radius.full, alignItems: "center", justifyContent: "center", backgroundColor: flat ? "transparent" : c.surfaceRaised, opacity: pressed ? 0.7 : 1,
        ...(flat ? null : { shadowColor: "#6b4a30", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1 }) })}>
      <Icon name={icon} color={c.ink} />
    </Pressable>
  );
}

/** Back button with an optional middle and right. Falls back to a route when there's nothing to go back to. */
export function Header({ middle, right, fallback = "/", close }: { middle?: ReactNode; right?: ReactNode; fallback?: string; close?: boolean }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 44, gap: space[3] }}>
      <IconButton icon={close ? "close" : "back"} label={close ? "Close" : "Back"} flat={!close} onPress={() => (router.canGoBack() ? router.back() : router.replace(fallback as never))} />
      <View style={{ flex: 1, alignItems: "center" }}>{middle}</View>
      <View style={{ minWidth: 44, alignItems: "flex-end" }}>{right}</View>
    </View>
  );
}

/** A white, rounded group of rows with hairlines between them. */
export function List({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  const c = useColors();
  return <View style={[{ backgroundColor: c.surfaceRaised, borderRadius: radius.lg, overflow: "hidden", shadowColor: "#6b4a30", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 1 }, style]}>{children}</View>;
}

export function Row({ title, sub, label, value, right, onPress, first, chevron = true, titleColor }: {
  title: string; sub?: string; label?: string; value?: string; right?: ReactNode; onPress?: () => void; first?: boolean; chevron?: boolean; titleColor?: keyof Colors;
}) {
  const c = useColors();
  const inner = (
    <View style={{ flexDirection: "row", alignItems: "center", gap: space[3], minHeight: 56, paddingVertical: space[3], paddingHorizontal: space[4], borderTopWidth: first ? 0 : 1, borderTopColor: c.line }}>
      <View style={{ flex: 1, gap: 2 }}>
        {label ? <AppText variant="label" color="inkMuted">{label}</AppText> : null}
        <AppText weight={sub ? "800" : "700"} color={titleColor}>{title}</AppText>
        {sub ? <AppText variant="caption" color="inkMuted">{sub}</AppText> : null}
      </View>
      {value ? <AppText variant="caption" color="inkMuted">{value}</AppText> : null}
      {right}
      {onPress && chevron ? <Icon name="chevron" size={18} color={c.inkMuted} /> : null}
    </View>
  );
  return onPress ? <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => ({ backgroundColor: pressed ? c.surfaceSunk : "transparent" })}>{inner}</Pressable> : inner;
}

/** Choice chips: single (radio) or multi (toggle buttons). */
export function Choices<T extends string | number>({ options, value, onChange, label }: {
  options: { id: T; label: string }[]; value: T | T[]; onChange: (v: T | T[]) => void; label: string;
}) {
  const c = useColors();
  const multi = Array.isArray(value);
  return (
    <View accessibilityRole={multi ? undefined : "radiogroup"} accessibilityLabel={label} style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
      {options.map((o) => {
        const on = multi ? (value as T[]).includes(o.id) : value === o.id;
        return (
          <Pressable key={String(o.id)} accessibilityRole={multi ? "checkbox" : "radio"} accessibilityState={multi ? { checked: on } : { selected: on }}
            onPress={() => {
              if (!multi) return onChange(o.id);
              const v = value as T[];
              onChange(on ? v.filter((x) => x !== o.id) : [...v, o.id]);
            }}
            style={{ minHeight: 40, paddingHorizontal: space[4], borderRadius: radius.full, justifyContent: "center", backgroundColor: on ? c.apricot : c.surfaceRaised, borderWidth: on ? 0 : 1.5, borderColor: c.line }}>
            <AppText weight="700" color={on ? "onPastel" : "ink"} style={{ fontSize: 14 }}>{o.label}</AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

/** Radio cards with a title and a line of detail. */
export function Options<T extends string>({ options, value, onChange, label }: { options: { id: T; title: string; detail?: string }[]; value: T; onChange: (v: T) => void; label: string }) {
  const c = useColors();
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={{ gap: space[2] }}>
      {options.map((o) => {
        const on = value === o.id;
        return (
          <Pressable key={o.id} accessibilityRole="radio" accessibilityState={{ selected: on }} onPress={() => onChange(o.id)}
            style={{ flexDirection: "row", alignItems: "center", gap: space[3], padding: space[4], borderRadius: radius.md, backgroundColor: on ? c.apricot : c.surfaceRaised }}>
            <View style={{ width: 24, height: 24, borderRadius: radius.full, borderWidth: on ? 7 : 2, borderColor: on ? c.onPastel : c.inkMuted, backgroundColor: c.surfaceRaised }} />
            <View style={{ flex: 1, gap: 2 }}>
              <AppText weight="800" color={on ? "onPastel" : "ink"}>{o.title}</AppText>
              {o.detail ? <AppText variant="caption" color={on ? "onPastel" : "inkMuted"}>{o.detail}</AppText> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  const c = useColors();
  return <Switch accessibilityLabel={label} value={value} onValueChange={onChange} trackColor={{ false: c.surfaceSunk, true: c.sageInk }} thumbColor="#FFFFFF" />;
}

export function ToggleRow({ title, sub, value, onChange }: { title: string; sub?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
      <View style={{ flex: 1, gap: 2 }}>
        <AppText weight="700">{title}</AppText>
        {sub ? <AppText variant="caption" color="inkMuted">{sub}</AppText> : null}
      </View>
      <Toggle value={value} onChange={onChange} label={title} />
    </View>
  );
}

export function Meter({ value, max, tone = "sageInk", track, label }: { value: number; max: number; tone?: keyof Colors; track?: keyof Colors; label: string }) {
  const c = useColors();
  return (
    <View accessibilityRole="progressbar" accessibilityLabel={label} accessibilityValue={{ min: 0, max, now: value }} style={{ height: 12, borderRadius: radius.full, backgroundColor: c[track ?? "surfaceSunk"], overflow: "hidden" }}>
      <View style={{ width: `${Math.min(100, (value / Math.max(1, max)) * 100)}%`, height: "100%", borderRadius: radius.full, backgroundColor: c[tone] }} />
    </View>
  );
}

export function Pill({ label, tone = "sunk" }: { label: string; tone?: Tone }) {
  const c = useColors();
  return (
    <View style={{ height: 28, paddingHorizontal: 10, borderRadius: radius.full, backgroundColor: bgFor(c, tone), justifyContent: "center", alignSelf: "flex-start" }}>
      <AppText variant="caption" weight="800" color={tone === "sunk" ? "ink" : "onPastel"}>{label}</AppText>
    </View>
  );
}

export function Banner({ children, tone = "sunk", icon }: { children: ReactNode; tone?: Tone; icon?: IconName }) {
  const c = useColors();
  return (
    <View accessibilityRole="text" style={{ flexDirection: "row", alignItems: "center", gap: space[2], padding: space[3], borderRadius: radius.md, backgroundColor: bgFor(c, tone) }}>
      {icon ? <Icon name={icon} size={18} color={tone === "sunk" ? c.ink : c.onPastel} /> : null}
      <AppText variant="caption" color={tone === "sunk" ? "ink" : "onPastel"} style={{ flex: 1 }}>{children}</AppText>
    </View>
  );
}

/** A small round icon on a pastel disc, for rows and cards. */
export function Disc({ icon, tone = "apricot", size = 52 }: { icon: IconName; tone?: Tone; size?: number }) {
  const c = useColors();
  return (
    <View style={{ width: size, height: size, borderRadius: radius.full, backgroundColor: bgFor(c, tone), alignItems: "center", justifyContent: "center" }}>
      <Icon name={icon} size={size * 0.46} color={c.onPastel} />
    </View>
  );
}

/** A tappable card laid out as a row: something on the left, text, a chevron. */
export function RowCard({ onPress, tone = "raised", children, accessibilityLabel }: { onPress: () => void; tone?: Tone | "raised"; children: ReactNode; accessibilityLabel?: string }) {
  const c = useColors();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress}
      style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 14, padding: space[4], borderRadius: radius.lg, opacity: pressed ? 0.85 : 1,
        backgroundColor: tone === "raised" ? c.surfaceRaised : bgFor(c, tone),
        ...(tone === "raised" ? { shadowColor: "#6b4a30", shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 } : null) })}>
      {children}
      <Icon name="chevron" size={20} color={tone === "raised" ? c.inkMuted : c.onPastel} />
    </Pressable>
  );
}

export function Section({ title, children, right }: { title: string; children: ReactNode; right?: ReactNode }) {
  return (
    <View style={{ gap: space[2] }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <AppText variant="label" color="inkMuted">{title}</AppText>
        {right}
      </View>
      {children}
    </View>
  );
}

/** − 2 portions + */
export function Stepper({ value, min = 1, max = 8, onChange, unit }: { value: number; min?: number; max?: number; onChange: (v: number) => void; unit: [string, string] }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }} accessibilityRole="adjustable" accessibilityValue={{ now: value, min, max }}>
      <IconButton icon="minus" label={`Fewer ${unit[1]}`} onPress={() => onChange(Math.max(min, value - 1))} />
      <AppText weight="800" style={{ minWidth: 76, textAlign: "center" }}>{value} {value === 1 ? unit[0] : unit[1]}</AppText>
      <IconButton icon="plus" label={`More ${unit[1]}`} onPress={() => onChange(Math.min(max, value + 1))} />
    </View>
  );
}

export function DraftNote() {
  return <Banner tone="butter" icon="doc">Recipes are drafts until our dietitian has checked them. Nutrition is approximate.</Banner>;
}

/** The person's initial; opens Settings. */
export function Avatar({ name }: { name: string }) {
  const c = useColors();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Settings" onPress={() => router.push("/settings")}
      style={{ width: 44, height: 44, borderRadius: radius.full, backgroundColor: c.lilac, alignItems: "center", justifyContent: "center" }}>
      <AppText variant="heading" color="onPastel" weight="600">{name.charAt(0)}</AppText>
    </Pressable>
  );
}
