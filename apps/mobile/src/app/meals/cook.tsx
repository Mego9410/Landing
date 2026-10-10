import { useKeepAwake } from "expo-keep-awake";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { INGREDIENT } from "@landing/content";
import { LABELS, plainName, quantity } from "@landing/engine";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { Mark } from "@/components/Mark";
import { readable } from "@/components/Screen";
import { TimerCard, useNow } from "@/components/Timers";
import { IconButton, Stepper } from "@/components/ui";
import { clock, ingredientsIn, timersIn, withSwaps } from "@/data/cook";
import { profileFor, px, SLOT_NAME } from "@/state/food";
import { logProtein } from "@/state/habits";
import { startTimer, useTimers } from "@/state/timers";
import { set, useApp } from "@/state/store";
import { toast } from "@/state/toast";
import { radius, space, useColors } from "@/theme";

/** Cook-along: a recipe one step at a time, big and clear, with the screen kept awake. First everything to get out
 *  (scaled to the portions), then each step with the ingredients it uses, this person's swaps written in, and a timer
 *  button wherever the step gives a time. Timers keep going if they leave this screen or the app (state/timers.ts). */
export default function Cook() {
  useKeepAwake();
  const s = useApp(), c = useColors(), insets = useSafeAreaInsets();
  const q = useLocalSearchParams<{ id: string; portions?: string; step?: string }>();
  const p = profileFor(s, "this"), x = px(s, q.id, "this"), r = x.recipe;
  const [portions, setPortions] = useState(Number(q.portions) || (r.slot === "dinner" ? p.household : 1));
  const steps = useMemo(() => r.steps.map((st) => withSwaps(st, x.swaps, plainName)), [r.steps, x.swaps]);
  const last = steps.length + 1;
  const [page, setPage] = useState(() => Math.min(last, Math.max(0, Number(q.step) || 0)));
  const [got, setGot] = useState<Record<string, boolean>>({});
  const timers = useTimers();
  const mine = timers.filter((t) => t.recipeId === r.id);
  const now = useNow(timers.length > 0);

  const lines = [...x.lines, ...(x.topUp ? [{ i: x.topUp.i, g: x.topUp.g, optional: false }] : [])];
  const ids = lines.map((l) => l.i);
  const qty = (id: string) => { const l = lines.find((x2) => x2.i === id); return l ? quantity(id, l.g * portions) : ""; };
  const go = (n: number) => { Haptics.selectionAsync().catch(() => {}); setPage(Math.max(0, Math.min(last, n))); };
  const protein = Math.round(x.nutrition.protein);

  return (
    <View style={{ flex: 1, backgroundColor: c.surface, paddingTop: insets.top }}>
      <View style={[{ flexDirection: "row", alignItems: "center", gap: space[3], paddingHorizontal: space[4], paddingVertical: space[2] }, readable]}>
        <IconButton icon="close" label="Close cook-along" onPress={() => (router.canGoBack() ? router.back() : router.replace("/meals"))} />
        <View style={{ flex: 1, gap: 6 }} accessible accessibilityLabel={page === 0 ? "Getting ready" : page === last ? "Finished" : `Step ${page} of ${steps.length}`}>
          <AppText weight="800" numberOfLines={1} style={{ fontSize: 15 }}>{x.name}</AppText>
          <View style={{ flexDirection: "row", gap: 4 }}>
            {Array.from({ length: steps.length + 1 }, (_, i) => <View key={i} style={{ flex: 1, height: 5, borderRadius: radius.full, backgroundColor: i < page || page === last ? c.sageInk : i === page ? "#E07A52" : c.surfaceSunk }} />)}
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={[{ flexGrow: 1, paddingHorizontal: space[6], paddingTop: space[4], paddingBottom: space[6], gap: space[4] }, readable]}>
        {page === 0 ? (
          <>
            <AppText variant="label" color="apricotInk">BEFORE YOU START</AppText>
            <AppText variant="title" accessibilityRole="header" style={{ fontSize: 30, lineHeight: 36 }}>Get everything out</AppText>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: space[3] }}>
              <AppText color="inkMuted" style={{ flex: 1 }}>{r.total <= 1 ? "No cooking needed." : `About ${r.total} minutes, ${r.handsOn} hands-on.`}</AppText>
              <Stepper value={portions} onChange={setPortions} unit={["portion", "portions"]} />
            </View>
            <View style={{ gap: space[2] }}>
              {lines.map((l) => {
                const on = !!got[l.i];
                return (
                  <Pressable key={l.i} accessibilityRole="checkbox" accessibilityState={{ checked: on }} accessibilityLabel={`${qty(l.i)} ${INGREDIENT[l.i].name}`}
                    onPress={() => { Haptics.selectionAsync().catch(() => {}); setGot((g) => ({ ...g, [l.i]: !on })); }}
                    style={{ flexDirection: "row", alignItems: "center", gap: space[3], minHeight: 56, paddingHorizontal: space[4], paddingVertical: space[3], borderRadius: radius.md, backgroundColor: on ? c.sage : c.surfaceRaised }}>
                    <View style={{ width: 26, height: 26, borderRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: on ? c.sageInk : "transparent", borderWidth: on ? 0 : 2, borderColor: c.inkMuted }}>
                      {on ? <Icon name="check" size={16} color={c.surface} strokeWidth={3} /> : null}
                    </View>
                    <AppText weight="700" color={on ? "onPastel" : "ink"} style={{ flex: 1, fontSize: 17 }}>{INGREDIENT[l.i].name}{l.optional ? " (if you like)" : ""}</AppText>
                    <AppText weight="800" color={on ? "onPastel" : "inkMuted"}>{qty(l.i)}</AppText>
                  </Pressable>
                );
              })}
            </View>
            {r.kit.length ? <AppText color="inkMuted">You’ll need: {r.kit.map((k) => ((LABELS.kit as Record<string, string>)[k] ?? k).toLowerCase()).join(", ")}.</AppText> : null}
            {r.kit.includes("tray") ? <AppText variant="caption" color="inkMuted">Times are for a fan oven. Put it on now if a step uses it; an air fryer is usually a few minutes quicker.</AppText> : null}
          </>
        ) : page === last ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: space[4] }}>
            <Mark height={110} hole={c.surface} />
            <AppText variant="title" accessibilityRole="header" style={{ textAlign: "center", fontSize: 30, lineHeight: 36 }}>Enjoy your {x.name.toLowerCase()}</AppText>
            <AppText color="inkMuted" style={{ textAlign: "center" }}>{r.fridgeDays ? `Leftovers keep ${r.fridgeDays} ${r.fridgeDays === 1 ? "day" : "days"} in the fridge${r.freezes ? ", or freeze" : ""}.` : "Best eaten fresh."}</AppText>
          </View>
        ) : (
          <>
            <AppText variant="label" color="apricotInk">STEP {page} OF {steps.length}</AppText>
            <AppText weight="600" accessibilityRole="header" style={{ fontSize: 24, lineHeight: 34 }}>{steps[page - 1]}</AppText>
            {(() => {
              const need = ingredientsIn(steps[page - 1], ids, plainName);
              return need.length ? (
                <View style={{ gap: space[2] }}>
                  <AppText variant="label" color="inkMuted">YOU’LL NEED</AppText>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
                    {need.map((id) => (
                      <View key={id} style={{ paddingVertical: 8, paddingHorizontal: space[3], borderRadius: radius.full, backgroundColor: c.surfaceRaised, borderWidth: 1.5, borderColor: c.line }}>
                        <AppText weight="700" style={{ fontSize: 15 }}>{plainName(id)} · {qty(id)}</AppText>
                      </View>
                    ))}
                  </View>
                </View>
              ) : null;
            })()}
            {timersIn(steps[page - 1]).map((tm, i) => {
              const running = mine.find((t) => t.step === page && t.label === tm.label);
              if (running) return <TimerCard key={i} t={running} now={now} />;
              return (
                <Pressable key={i} accessibilityRole="button" accessibilityLabel={`Start a ${clock(tm.seconds)} timer for ${tm.label}`}
                  onPress={() => startTimer({ label: tm.label, seconds: tm.seconds, recipeId: r.id, recipeName: x.name, step: page })}
                  style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: space[3], minHeight: 64, paddingHorizontal: space[4], borderRadius: radius.lg, backgroundColor: c.sage, opacity: pressed ? 0.85 : 1 })}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: c.surfaceRaised, alignItems: "center", justifyContent: "center" }}><Icon name="bell" size={20} color={c.onPastel} /></View>
                  <View style={{ flex: 1 }}>
                    <AppText weight="800" color="onPastel" style={{ fontSize: 17 }}>Start {tm.label.toLowerCase()} timer · {tm.text}</AppText>
                    {tm.upTo ? <AppText variant="caption" color="onPastel">Set for {clock(tm.seconds)}. Check then, and add a minute or two if it needs it.</AppText> : null}
                  </View>
                  <Icon name="play" size={20} color={c.onPastel} />
                </Pressable>
              );
            })}
            {mine.filter((t) => t.step !== page).length ? (
              <View style={{ gap: space[2], marginTop: space[2] }}>
                <AppText variant="label" color="inkMuted">ALSO RUNNING</AppText>
                {mine.filter((t) => t.step !== page).map((t) => <TimerCard key={t.id} t={t} now={now} />)}
              </View>
            ) : null}
          </>
        )}
      </ScrollView>

      <View style={[{ flexDirection: "row", gap: space[3], paddingHorizontal: space[6], paddingTop: space[2], paddingBottom: insets.bottom + space[4] }, readable]}>
        {page === last ? (
          <View style={{ flex: 1, gap: space[2] }}>
            {s.settings.safeMode ? null : (
              <Button label={`Log ${protein} g protein for ${SLOT_NAME[r.slot].toLowerCase()}`} variant="brand" block onPress={() => {
                set((st) => logProtein(st, SLOT_NAME[r.slot], protein));
                toast("Logged. Nice cooking.");
                if (router.canGoBack()) router.back(); else router.replace("/meals");
              }} />
            )}
            <Button label="Done" variant={s.settings.safeMode ? "brand" : "quiet"} block onPress={() => (router.canGoBack() ? router.back() : router.replace("/meals"))} />
          </View>
        ) : (
          <>
            {page > 0 ? <View style={{ flex: 1 }}><Button label="Back" variant="secondary" block onPress={() => go(page - 1)} /></View> : null}
            <View style={{ flex: 2 }}><Button label={page === 0 ? "Start cooking" : page === steps.length ? "Finish" : "Next step"} variant="brand" block onPress={() => go(page + 1)} /></View>
          </>
        )}
      </View>
    </View>
  );
}
