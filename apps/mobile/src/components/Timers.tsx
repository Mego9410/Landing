// Cooking timers on screen: a card per timer in cook-along, and a small tray floating over the rest of the app while any
// are running, so a timer is never out of sight. Both tick once a second.
import { router, usePathname, type Href } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { clock } from "@/data/cook";
import { addTime, cancelTimer, pauseTimer, remaining, resumeTimer, tick, useTimers, type Timer } from "@/state/timers";
import { radius, space, useColors } from "@/theme";
import { AppText } from "./AppText";
import { Icon } from "./Icon";

/** The time now, updated every second while there are timers, and marking any that have run out. */
export function useNow(active: boolean) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => { const t = Date.now(); tick(t); setNow(t); }, 1000);
    return () => clearInterval(id);
  }, [active]);
  return now;
}

function Small({ label, icon, onPress, a11y }: { label?: string; icon?: "pause" | "play" | "close" | "plus"; onPress: () => void; a11y: string }) {
  const c = useColors();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={a11y} onPress={onPress} hitSlop={4}
      style={({ pressed }) => ({ minWidth: 44, minHeight: 44, paddingHorizontal: label ? space[3] : 0, borderRadius: radius.full, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 4, backgroundColor: c.surfaceRaised, opacity: pressed ? 0.7 : 1 })}>
      {icon ? <Icon name={icon} size={18} color={c.ink} /> : null}
      {label ? <AppText weight="800" style={{ fontSize: 14 }}>{label}</AppText> : null}
    </Pressable>
  );
}

/** One timer: big countdown, a bar, pause or resume, a minute more, and stop. Finished, it says so until dismissed. */
export function TimerCard({ t, now }: { t: Timer; now: number }) {
  const c = useColors();
  const left = remaining(t, now), frac = t.total ? 1 - left / t.total : 1;
  return (
    <View accessible={false} style={{ borderRadius: radius.lg, padding: space[4], gap: space[3], backgroundColor: t.done ? c.butter : c.sage }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
        <View style={{ flex: 1 }} accessible accessibilityLiveRegion={t.done ? "assertive" : "none"} accessibilityLabel={t.done ? `${t.label} timer done` : `${t.label} timer, ${clock(left)} left${t.endsAt ? "" : ", paused"}`}>
          <AppText weight="800" color="onPastel" style={{ fontSize: 15 }}>{t.label}{t.endsAt || t.done ? "" : " · paused"}</AppText>
          <AppText variant="numeral" color="onPastel" style={{ fontSize: 40, lineHeight: 46 }} maxFontSizeMultiplier={1.3}>{t.done ? "Done" : clock(left)}</AppText>
        </View>
        {t.done ? (
          <>
            <Small label="+1 min" onPress={() => addTime(t.id, 60)} a11y={`One more minute for ${t.label}`} />
            <Small icon="close" onPress={() => cancelTimer(t.id)} a11y={`Dismiss ${t.label} timer`} />
          </>
        ) : (
          <>
            <Small label="+1" onPress={() => addTime(t.id, 60)} a11y={`Add a minute to ${t.label}`} />
            <Small icon={t.endsAt ? "pause" : "play"} onPress={() => (t.endsAt ? pauseTimer(t.id) : resumeTimer(t.id))} a11y={t.endsAt ? `Pause ${t.label}` : `Resume ${t.label}`} />
            <Small icon="close" onPress={() => cancelTimer(t.id)} a11y={`Stop ${t.label} timer`} />
          </>
        )}
      </View>
      {t.done ? null : (
        <View style={{ height: 6, borderRadius: radius.full, backgroundColor: c.surfaceRaised, overflow: "hidden" }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <View style={{ width: `${Math.round(frac * 100)}%`, height: "100%", backgroundColor: c.sageInk }} />
        </View>
      )}
    </View>
  );
}

/** Over every screen except cook-along: the timers as small pills. Tapping one goes back to that recipe's cook-along. */
export function TimerTray() {
  const c = useColors(), insets = useSafeAreaInsets(), path = usePathname();
  const list = useTimers();
  const now = useNow(list.length > 0);
  if (!list.length || path.startsWith("/meals/cook")) return null;
  return (
    <View pointerEvents="box-none" style={{ position: "absolute", left: 0, right: 0, top: insets.top + 4, alignItems: "center", gap: 6 }}>
      {list.slice(0, 3).map((t) => (
        <Pressable key={t.id} accessibilityRole="button" accessibilityLabel={t.done ? `${t.label} timer done. Open cook-along` : `${t.label}, ${clock(remaining(t, now))} left. Open cook-along`}
          onPress={() => router.push(`/meals/cook?id=${encodeURIComponent(t.recipeId)}&step=${t.step}` as Href)}
          style={{ flexDirection: "row", alignItems: "center", gap: space[2], minHeight: 40, paddingHorizontal: 14, borderRadius: radius.full, backgroundColor: t.done ? c.butter : c.ink,
            shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4 }}>
          <Icon name="bell" size={16} color={t.done ? c.onPastel : c.surface} />
          <AppText weight="800" style={{ fontSize: 14, color: t.done ? c.onPastel : c.surface }} maxFontSizeMultiplier={1.3}>{t.label} · {t.done ? "done" : clock(remaining(t, now))}</AppText>
        </Pressable>
      ))}
    </View>
  );
}
