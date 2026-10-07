import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Icon } from "@/components/Icon";
import { Screen } from "@/components/Screen";
import { buy, plans, restore, type Plan } from "@/state/subscription";
import { useApp } from "@/state/store";
import { toast } from "@/state/toast";
import { radius, space, useColors } from "@/theme";

const INCLUDED = [
  "Your 12-month plan: a lesson and three small habits each week",
  "Two short strength sessions a week at home, with easier versions",
  "Easy meals planned for your week, and one shopping list",
  "Your morning check-in and what shapes your days",
  "Your trend, steady score and a summary for your prescriber",
];

/** The subscription screen: what's included, the plans with honest trial wording, restore, and the legal links.
 *  Calm on purpose: no countdowns and no pressure. Only shown when billing is on (see state/subscription.ts). */
export default function Paywall() {
  const s = useApp(), c = useColors();
  const [options, setOptions] = useState<Plan[] | null>(null);
  const [pick, setPick] = useState(0);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const lapsed = !!s.subscription && !s.subscription.active;

  useEffect(() => { plans().then(setOptions).catch(() => setFailed(true)); }, []);
  useEffect(() => { if (s.subscription?.active) router.replace("/"); }, [s.subscription?.active]);

  async function subscribe() {
    const plan = options?.[pick];
    if (!plan) return;
    setBusy(true);
    try { if (await buy(plan)) toast("You're all set. Welcome to Steadie."); }
    catch { toast("That didn't go through. You haven't been charged. Try again in a moment."); }
    finally { setBusy(false); }
  }
  async function onRestore() {
    setBusy(true);
    try { toast((await restore()) ? "Your subscription is back." : "We couldn't find a subscription for this Apple ID."); }
    catch { toast("Couldn't restore just now. Try again in a moment."); }
    finally { setBusy(false); }
  }

  return (
    <Screen contentContainerStyle={{ gap: space[5], paddingBottom: 48 }}>
      <View style={{ gap: space[2], marginTop: space[4] }}>
        <AppText variant="display" accessibilityRole="header" style={{ fontSize: 34, lineHeight: 38 }}>{lapsed ? "Welcome back" : "Keep what you've worked for"}</AppText>
        <AppText variant="bodyLg" color="inkMuted">{lapsed ? "Your subscription has ended. Everything you logged is still here." : "Your plan is ready. Here's what's included."}</AppText>
      </View>
      <Card style={{ gap: space[3] }}>
        {INCLUDED.map((t) => (
          <View key={t} style={{ flexDirection: "row", gap: space[3], alignItems: "flex-start" }}>
            <View style={{ width: 24, height: 24, borderRadius: radius.full, backgroundColor: c.sage, alignItems: "center", justifyContent: "center", marginTop: 1 }}><Icon name="check" size={14} color={c.onPastel} /></View>
            <AppText style={{ flex: 1 }}>{t}</AppText>
          </View>
        ))}
      </Card>

      {failed ? (
        <Card tone="sunk" style={{ gap: 6 }}>
          <AppText weight="800">Plans aren&apos;t loading</AppText>
          <AppText color="inkMuted">Check your connection and try again.</AppText>
          <Button label="Try again" variant="secondary" onPress={() => { setFailed(false); plans().then(setOptions).catch(() => setFailed(true)); }} />
        </Card>
      ) : !options ? (
        <ActivityIndicator color={c.ink} />
      ) : (
        <View accessibilityRole="radiogroup" accessibilityLabel="Plans" style={{ gap: space[2] }}>
          {options.map((o, i) => {
            const on = i === pick;
            return (
              <Pressable key={o.pkg.identifier} accessibilityRole="radio" accessibilityState={{ selected: on }} onPress={() => setPick(i)}
                style={{ flexDirection: "row", alignItems: "center", gap: space[3], padding: space[4], borderRadius: radius.md, backgroundColor: on ? c.apricot : c.surfaceRaised, borderWidth: on ? 0 : 1.5, borderColor: c.line }}>
                <View style={{ width: 24, height: 24, borderRadius: radius.full, borderWidth: on ? 7 : 2, borderColor: on ? c.onPastel : c.inkMuted, backgroundColor: c.surfaceRaised }} />
                <View style={{ flex: 1, gap: 2 }}>
                  <AppText weight="800" color={on ? "onPastel" : "ink"}>{o.title} · {o.price} {o.per}</AppText>
                  {o.trial && !lapsed ? <AppText variant="caption" color={on ? "onPastel" : "inkMuted"}>{o.trial}</AppText> : null}
                </View>
                {o.saving ? <AppText variant="caption" weight="800" color={on ? "onPastel" : "sageInk"}>{o.saving}</AppText> : null}
              </Pressable>
            );
          })}
        </View>
      )}

      <View style={{ gap: space[2] }}>
        <Button label={busy ? "One moment…" : options?.[pick]?.trial && !lapsed ? "Start my free trial" : "Subscribe"} block disabled={busy || !options?.length} onPress={subscribe} />
        <AppText variant="caption" color="inkMuted" style={{ textAlign: "center" }}>
          Renews automatically until you cancel. Cancel any time in your Apple account settings, at least a day before it renews.
        </AppText>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap" }}>
        <Button label="Restore purchases" variant="quiet" onPress={onRestore} />
        <Button label="Terms" variant="quiet" onPress={() => router.push({ pathname: "/legal/[doc]", params: { doc: "terms" } })} />
        <Button label="Privacy" variant="quiet" onPress={() => router.push({ pathname: "/legal/[doc]", params: { doc: "privacy" } })} />
      </View>
      {lapsed ? <Button label="Settings, export or delete your data" variant="secondary" block onPress={() => router.push("/settings")} /> : null}
    </Screen>
  );
}
