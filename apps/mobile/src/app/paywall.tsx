import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Switch, View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { Mark } from "@/components/Mark";
import { OnbCard, OnbScreen } from "@/components/Onboarding";
import { addDays, fmt, today } from "@/data/dates";
import { track } from "@/state/events";
import { buy, plans, plansProblem, restore, type Plan } from "@/state/subscription";
import { set, useApp } from "@/state/store";
import { toast } from "@/state/toast";
import { radius, space, useColors } from "@/theme";

/** "7 days" (or "1 week") to 7. */
const trialDays = (trial: string | null) => { const n = parseInt(trial ?? "", 10) || 7; return /week/i.test(trial ?? "") ? n * 7 : n; };
/** "About £5.83 a month", from the yearly price in the person's own currency. */
function perMonth(p: Plan) {
  const pr = p.pkg.product;
  try { return `About ${new Intl.NumberFormat("en-GB", { style: "currency", currency: pr.currencyCode }).format(pr.price / 12)} a month`; } catch { return p.weekly ?? p.billing; }
}

/** 23 · The plans, after onboarding (`?from=onboarding`) or whenever the plan needs a subscription. A trial timeline with
 *  real dates, the two plans side by side, the trial reminder (on by default), honest renewal wording, restore and the
 *  legal links. Calm on purpose: no countdowns and no pressure. Only shown when billing is on. */
export default function Paywall() {
  const s = useApp(), c = useColors();
  const fromOnboarding = useLocalSearchParams<{ from?: string }>().from === "onboarding";
  const [options, setOptions] = useState<Plan[] | null>(null);
  const [pick, setPick] = useState(0);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState<{ text: string; detail: string } | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const lapsed = !!s.subscription?.ended && !s.subscription.active; // had the plan before, so "welcome back"
  const chosen = options?.[pick];
  const name = s.name.trim();
  const remind = s.settings.trialReminder !== false;

  const fetchPlans = () => plans().then(setOptions).catch((e) => setFailed(plansProblem(e)));
  const load = () => { setFailed(null); setOptions(null); fetchPlans(); };
  useEffect(() => { fetchPlans(); track("paywall_viewed", { lapsed, from: fromOnboarding ? "onboarding" : "app" }); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!s.subscription?.active) return;
    if (fromOnboarding) router.replace("/onboarding/thanks");
    else router.replace("/");
  }, [s.subscription?.active, fromOnboarding]);

  async function subscribe() {
    const plan = chosen;
    if (!plan) return;
    setBusy(true);
    try { if ((await buy(plan)) && !fromOnboarding) toast(plan.trial ? "Your free trial has started. Welcome to Steadie." : "You’re all set. Welcome to Steadie."); }
    catch { toast("That didn’t go through. You haven’t been charged. Try again in a moment."); }
    finally { setBusy(false); }
  }
  async function onRestore() {
    setBusy(true);
    try { toast((await restore()) ? "Your subscription is back." : "We couldn’t find a subscription for this Apple ID."); }
    catch { toast("Couldn’t restore just now. Try again in a moment."); }
    finally { setBusy(false); }
  }

  const days = trialDays(chosen?.trial ?? null), t = today();
  const steps = [
    { when: "Today", what: "Your full plan unlocks: meals, strength and morning check-ins.", tone: "#E07A52", icon: "check" as const },
    { when: `Day ${days - 2} · ${fmt.short(addDays(t, days - 2))}`, what: remind ? `We’ll remind you that your trial ends in 2 days.` : "Your trial ends in 2 days. (You’ve turned the reminder off.)", tone: c.butter, icon: "bell" as const },
    { when: `Day ${days} · ${fmt.short(addDays(t, days))}`, what: "Your subscription starts, unless you cancel before then.", tone: c.surfaceSunk, icon: "star" as const },
  ];

  return (
    <OnbScreen footer={<>
      <Button label={busy ? "One moment…" : chosen?.trial ? `Start my ${days} free days` : "Subscribe"} variant="ink" block disabled={busy || !options?.length} onPress={subscribe} />
      <AppText variant="caption" color="inkMuted" style={{ textAlign: "center", fontSize: 12, lineHeight: 17 }}>
        {chosen?.trial
          ? `${chosen.trial} free, then ${chosen.price} ${chosen.per}. Renews automatically until you cancel in Settings › your name › Subscriptions, at least 24 hours before the trial ends or it renews.`
          : "Renews automatically until you cancel in Settings › your name › Subscriptions, at least 24 hours before it renews."}
      </AppText>
      <View style={{ flexDirection: "row", justifyContent: "center", flexWrap: "wrap" }}>
        <Button label="Restore" variant="quiet" onPress={onRestore} />
        <Button label="Terms" variant="quiet" onPress={() => router.push({ pathname: "/legal/[doc]", params: { doc: "terms" } })} />
        <Button label="Privacy" variant="quiet" onPress={() => router.push({ pathname: "/legal/[doc]", params: { doc: "privacy" } })} />
      </View>
      {fromOnboarding ? null : <Button label="Settings: sign out, export or delete your data" variant="quiet" onPress={() => router.push("/settings")} style={{ alignSelf: "center" }} />}
    </>}>
      <View style={{ flexDirection: "row", gap: space[3], alignItems: "flex-end" }}>
        <Mark height={60} hole={c.surface} />
        <AppText variant="title" accessibilityRole="header" style={{ flex: 1, fontSize: 27, lineHeight: 32 }}>
          {lapsed ? "Welcome back" : fromOnboarding ? (name ? `${name}, your first week is ready` : "Your first week is ready") : "Keep what you’ve worked for"}
        </AppText>
      </View>
      <AppText color="inkMuted" style={{ fontSize: 16, lineHeight: 23 }}>
        {lapsed ? "Your subscription has ended. Everything you logged is still here." : chosen?.trial ? `Start with ${days} days free. We’ll remind you before it ends.` : "Your plan, check-ins and meals, all in one place."}
      </AppText>

      {chosen?.trial ? (
        <OnbCard style={{ paddingBottom: 6 }}>
          {steps.map((st, i) => (
            <View key={st.when} style={{ flexDirection: "row", gap: space[3] }}>
              <View style={{ alignItems: "center", width: 30 }}>
                <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: st.tone, alignItems: "center", justifyContent: "center" }}><Icon name={st.icon} size={15} color={c.onPastel} /></View>
                {i < steps.length - 1 ? <View style={{ flex: 1, width: 3, minHeight: 14, backgroundColor: c.surfaceSunk }} /> : null}
              </View>
              <View style={{ flex: 1, gap: 2, paddingBottom: space[3] }}>
                <AppText weight="800" style={{ fontSize: 15 }}>{st.when}</AppText>
                <AppText variant="caption" color="inkMuted" style={{ fontSize: 13 }}>{st.what}</AppText>
              </View>
            </View>
          ))}
        </OnbCard>
      ) : null}

      {failed ? (
        <OnbCard style={{ gap: 6 }}>
          {/* The store's technical message is for testing: shown in development builds, or on any build after holding
              the heading for two seconds. Customers only see the calm line. */}
          <Pressable onLongPress={() => setShowDetail((v) => !v)} delayLongPress={2000} accessibilityRole="header">
            <AppText weight="800">Plans aren’t loading just now</AppText>
          </Pressable>
          <AppText color="inkMuted">Check your connection and try again.</AppText>
          {(__DEV__ || showDetail) && failed.detail ? <AppText variant="caption" color="inkMuted">{failed.text} {failed.detail}</AppText> : null}
          <Button label="Try again" variant="secondary" onPress={load} />
        </OnbCard>
      ) : !options ? (
        <ActivityIndicator color={c.ink} />
      ) : (
        <View accessibilityRole="radiogroup" accessibilityLabel="Plans" style={{ flexDirection: "row", gap: 10 }}>
          {options.map((o, i) => {
            const on = i === pick, yearly = o.pkg.packageType === "ANNUAL";
            return (
              <Pressable key={o.pkg.identifier} accessibilityRole="radio" accessibilityState={{ selected: on }} onPress={() => setPick(i)}
                accessibilityLabel={`${o.title}, ${o.price} ${o.per}${o.trial ? `, ${o.trial} free` : ""}`}
                style={{ flex: 1, gap: 3, padding: 14, borderRadius: 20, backgroundColor: on ? c.apricot : c.surfaceRaised, borderWidth: on ? 2 : 1.5, borderColor: on ? c.apricotInk : c.line }}>
                <AppText weight="800" color={on ? "onPastel" : "apricotInk"} style={{ fontSize: 13 }}>{yearly ? "Matches your 12 months" : "Flexible"}</AppText>
                <AppText weight="800" color={on ? "onPastel" : "ink"} style={{ fontSize: 18 }}>{yearly ? "Yearly" : "Monthly"}</AppText>
                <AppText weight="800" color={on ? "onPastel" : "ink"} style={{ fontSize: 16 }}>{o.price} {o.per}</AppText>
                <AppText variant="caption" weight="700" color={on ? "onPastel" : "inkMuted"} style={{ fontSize: 13 }}>{yearly ? perMonth(o) : "Cancel any month"}</AppText>
              </Pressable>
            );
          })}
        </View>
      )}

      {chosen?.trial ? (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: space[3], paddingHorizontal: 2, borderRadius: radius.md }}>
          <AppText weight="700" style={{ flex: 1, fontSize: 15, lineHeight: 20 }}>Remind me 2 days before my trial ends</AppText>
          <Switch accessibilityLabel="Remind me 2 days before my trial ends" value={remind} onValueChange={(v) => set((st) => { st.settings.trialReminder = v; })} trackColor={{ false: c.surfaceSunk, true: c.sageInk }} thumbColor="#FFFFFF" />
        </View>
      ) : null}
    </OnbScreen>
  );
}
