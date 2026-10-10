import { router } from "expo-router";
import { useEffect, useState } from "react";
import Constants from "expo-constants";
import * as Updates from "expo-updates";
import { Pressable, View } from "react-native";
import { LABELS } from "@landing/engine";
import { castById } from "@landing/motion";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { Choices, Header, List, Row, Section, ToggleRow } from "@/components/ui";
import { fmt, isoDate, today } from "@/data/dates";
import { renewalMessage, renewalSoon } from "@/data/reminders";
import { backupAllowed, demoState, freshState, replace, set, setWeek, stageLabel, stageOf, useApp, weekOf, type Theme, type Units } from "@/state/store";
import { toast } from "@/state/toast";
import { available, connect, disconnect } from "@/state/appleHealth";
import { AccountError, accountsAvailable, backUpNow, deleteAccount, guideEmails, resumeHealthBackup, setGuideEmails, setWeeklyRecap, signOut, signOutKeepsPlan, useAccount, weeklyRecap, withdrawHealthBackup } from "@/state/account";
import { deleteEverything, shareExport } from "@/state/data";
import { openWriteReview } from "@/state/review";
import { sendTestError, sentryOn } from "@/state/sentry";
import { billingEnabled, manageSubscription, planLocked, plans, restore } from "@/state/subscription";
import { space } from "@/theme";

/** S1 Settings, with the demo controls the prototype keeps in its test panel. */
export default function Settings() {
  const s = useApp();
  const week = weekOf(s);
  const r = s.settings.reminders;
  const count = [r.checkIn.on, r.sessions.on, r.planning.on].filter(Boolean).length;
  const on = count ? `${count} on` : "Off";
  const healthSub = s.settings.appleHealth ? "Weight and steps" : available() ? "Bring in weight and steps" : "Works in the App Store version";
  async function toggleHealth() {
    if (s.settings.appleHealth) { disconnect(); toast("Apple Health disconnected. Weigh-ins already brought in stay."); return; }
    if (!available()) { toast("Apple Health works in the App Store version of Steadie."); return; }
    await connect().catch(() => toast("Couldn't connect to Apple Health."));
  }
  const { account, status } = useAccount();
  const [asking, setAsking] = useState<Asking | null>(null);
  const sub = s.subscription;
  const until = sub?.until ? fmt.dayMonth(isoDate(new Date(sub.until))) : null;
  const subLine = !sub?.active ? "Your logs stay yours either way" : sub.trial ? (sub.willRenew ? `Free trial ends ${until}` : `Free trial ends ${until}, then stops`) : sub.willRenew ? `Renews ${until}` : `Ends ${until}`;
  const showAccount = accountsAvailable() && !s.demo;
  const locked = planLocked(s);
  const pregnant = !!s.health.answers.pregnant;
  // A week before a yearly plan renews: a calm note with the date and the way to change it.
  const renewal = renewalSoon(sub) && sub?.until ? renewalMessage(sub.until) : null;
  // A second free trial isn't on offer (one per Apple ID), so "See plans" only promises one when the App Store says so.
  const [trial, setTrial] = useState<string | null>(null);
  const subActive = !!sub?.active;
  useEffect(() => {
    if (!billingEnabled() || s.demo || subActive) return;
    let live = true;
    plans().then((p) => { if (live) setTrial(p.find((x) => x.trial)?.trial ?? null); }, () => {});
    return () => { live = false; };
  }, [s.demo, subActive]);
  const backedUp = status === "saving" ? "Backing up…" : status === "offline" ? "Couldn't reach Steadie. It'll try again." : account?.syncedAt ? `Backed up ${when(account.syncedAt)}` : "Backs up once your plan is set up";
  const fail = (e: unknown) => toast(e instanceof AccountError ? e.message : "Something went wrong. Try again.");
  // Without an account, signing out means deleting: there's no backup to come back to, so the warning says so plainly
  // and offers to back up first.
  const confirmDelete = (where: Asking["where"]) => setAsking({
    where, title: showAccount ? "Sign out and delete your data?" : "Delete everything?",
    message: `${showAccount ? "You're not signed in, so your plan isn't backed up. " : ""}This permanently deletes everything on this phone: your answers, plan, logs, weigh-ins and check-ins. It can't be undone. Any subscription carries on until you cancel it in your Apple account settings.`,
    action: "Delete everything", go: () => deleteEverything().then(() => { toast("Your data has been deleted."); router.replace("/onboarding"); }),
    other: showAccount ? { label: "Back up first", onPress: () => router.push({ pathname: "/onboarding/account", params: { from: "settings" } }) } : undefined,
  });
  // Signing out only keeps the plan when this phone backs up to the account. Without a backup (consent withdrawn, or
  // never backed up) it deletes the plan, so the warning says so as plainly as deleting does.
  const confirmSignOut = () => signOutKeepsPlan(account, s)
    ? setAsking({ where: "account", title: "Sign out?", message: "Your plan is backed up first, then cleared from this phone. Sign in again to bring it back.", action: "Sign out", safe: true,
      go: () => signOut().then(() => { toast("Signed out. Your backup is safe."); router.replace("/onboarding"); }, fail) })
    : setAsking({
      where: "account", title: "Sign out and delete your data?",
      message: `${backupAllowed(s) ? "Your plan hasn't been backed up to your account yet" : "You've withdrawn consent to back up your health information"}, so signing out permanently deletes everything on this phone: your answers, plan, logs, weigh-ins and check-ins. It can't be undone. Any subscription carries on until you cancel it in your Apple account settings.`,
      action: "Sign out and delete everything",
      go: () => signOut({ discard: true }).then(() => { toast("Signed out. Your data has been deleted."); router.replace("/onboarding"); }, fail),
      other: backupAllowed(s) ? { label: "Back up first", onPress: () => backUpNow().then((o) => toast(o.kind === "ask" ? "Your account already holds a different plan, so nothing was backed up. Nothing has changed on this phone." : "Backed up. You can sign out now."), fail) } : undefined,
    });
  const confirmDeleteAccount = () => setAsking({ where: "account", title: "Delete your account?", message: "This deletes your account and your backup from Steadie's servers, and clears this phone. It can't be undone.", action: "Delete my account",
    go: () => deleteAccount().then(() => { toast("Your account and backup are deleted."); router.replace("/onboarding"); }, fail) });
  const confirmCard = (where: Asking["where"]) => asking?.where === where ? <Confirm ask={asking} onCancel={() => setAsking(null)} /> : null;
  return (
    <Screen header={<Header fallback="/" title="Settings" />} contentContainerStyle={{ gap: space[6], paddingBottom: 48 }}>
      <AppText variant="title" accessibilityRole="header">Settings</AppText>
      <Section title="YOUR PLAN">
        <List>
          <Row first title={s.name || "Your plan"} sub={`${stageLabel(s)} · ${stageOf(s).name}`} />
          {locked ? null : <Row title={s.ob.lastInjection > today() ? "I've had my last jab" : "Your last jab"} value={fmt.dayMonth(s.ob.lastInjection)} onPress={() => router.push("/settings/last-jab")} />}
          {locked ? null : <Row title="Food preferences" value={LABELS.diet[s.food.diet]} onPress={() => router.push("/meals/preferences")} />}
          {locked ? null : <Row title="Exercise demos" value={s.demos.who === "mix" ? "Mix it up" : castById(s.demos.who).name} onPress={() => router.push("/settings/demos")} />}
        </List>
      </Section>
      <Section title="SUPPORT">
        <View style={{ gap: space[3] }}>
          <List>
            <Row first title="Health and safety" sub={s.disclaimer ? `You accepted this on ${fmt.dayMonth(s.disclaimer.acceptedAt.slice(0, 10))}` : undefined} onPress={() => router.push({ pathname: "/disclaimer", params: { review: "1" } })} />
            <Row title="Your health check" sub={s.health.checkedAt ? `Last done ${fmt.dayMonth(s.health.checkedAt)}` : "Not done yet"} onPress={() => router.push({ pathname: "/onboarding/health", params: { recheck: "1" } })} />
          </List>
          <ToggleRow title="Habit Only mode" sub={pregnant ? "Stays on while you’re pregnant or recently gave birth. Update your health check when that changes." : "Hides weight and numbers, and keeps the focus on routines"}
            value={s.settings.safeMode || pregnant} onChange={(v) => {
              if (pregnant) { if (!s.settings.safeMode) set((st) => { st.settings.safeMode = true; }); return; } // stays on; the line above says why
              set((st) => { st.settings.safeMode = v; if (v) st.story.weightView = "hide"; else if (st.story.weightView === "hide") st.story.weightView = "show"; });
              toast(v ? "Habit Only mode is on." : "Habit Only mode is off.");
            }} />
          {s.settings.safeMode || pregnant ? null : <>
            <AppText weight="700">How weight shows</AppText>
            <Choices label="How weight shows" value={s.story.weightView === "trend" ? "trend" : "show"} onChange={(v) => set((st) => { st.story.weightView = v as "show" | "trend"; })}
              options={[{ id: "show", label: "Numbers" }, { id: "trend", label: "Trend only" }]} />
          </>}
          <AppText variant="caption" color="inkMuted">If food or eating feels hard, Beat&apos;s helpline is there to talk to.</AppText>
        </View>
      </Section>
      <Section title="YOUR APP">
        <View style={{ gap: space[3] }}>
          <List>
            <Row first title="Reminders" value={on} onPress={() => router.push("/settings/reminders")} />
            <Row title="Apple Health" sub={healthSub} onPress={toggleHealth} chevron={false} right={<AppText weight="800" color="apricotInk">{s.settings.appleHealth ? "Disconnect" : available() ? "Connect" : ""}</AppText>} />
          </List>
          <AppText weight="700">Appearance</AppText>
          <Choices label="Appearance" value={s.settings.theme ?? "system"} onChange={(v) => set((st) => { st.settings.theme = v as Theme; })} options={[{ id: "system", label: "Match my phone" }, { id: "light", label: "Light" }, { id: "dark", label: "Dark" }]} />
          <AppText weight="700">Units</AppText>
          <Choices label="Units" value={s.settings.units} onChange={(v) => set((st) => { st.settings.units = v as Units; })} options={[{ id: "kg", label: "Kilograms" }, { id: "stlb", label: "Stones and pounds" }]} />
        </View>
      </Section>
      {billingEnabled() && !s.demo ? <Section title="SUBSCRIPTION">
        <List>
          <Row first title={sub?.active ? (sub.plan === "yearly" ? "Yearly plan" : sub.plan === "monthly" ? "Monthly plan" : "Your plan") : "Not subscribed"} sub={subLine} chevron={false} />
          <Row title="Manage subscription" sub="Change plan or cancel, in your Apple account" onPress={() => manageSubscription().catch(() => toast("Couldn't open your Apple subscriptions."))} />
          <Row title="Restore purchases" onPress={() => restore().then((ok) => toast(ok ? "Your subscription is back." : "We couldn't find a subscription for this Apple ID."), () => toast("Couldn't restore just now. Try again in a moment."))} />
          {sub?.active ? null : <Row title="See plans" sub={trial ? `${trial} free, then monthly or yearly` : "Monthly or yearly"} onPress={() => router.push("/paywall")} />}
        </List>
        {renewal ? (
          <Card style={{ gap: 6, marginTop: space[3] }}>
            <AppText weight="800">{renewal.title}</AppText>
            <AppText color="inkMuted">{renewal.body}</AppText>
            <Button label="Manage subscription" variant="secondary" onPress={() => manageSubscription().catch(() => toast("Couldn't open your Apple subscriptions."))} style={{ alignSelf: "flex-start" }} />
          </Card>
        ) : null}
      </Section> : null}
      {showAccount ? <Section title="ACCOUNT">
        <View style={{ gap: space[3] }}>
          {account ? (
            <List>
              <Row first title={account.email || "Signed in"} sub={backedUp} chevron={false} />
              <Row title="Back up now" onPress={() => backUpNow().then((o) => toast(o.kind === "restored" ? "Newer changes from your other phone are here." : "Backed up."), fail)} />
              <Row title="Sign out" sub={signOutKeepsPlan(account, s) ? "Your backup stays. This phone is cleared." : "Not backed up, so this deletes your plan"} onPress={confirmSignOut} />
              <Row title="Delete my account" sub="Deletes your backup and clears this phone" titleColor="roseInk" onPress={confirmDeleteAccount} />
            </List>
          ) : null}
          {confirmCard("account")}
          {account ? <GuideEmails /> : null}
          {account ? <WeeklyRecap /> : null}
          {account ? <HealthBackup /> : null}
          {account ? null : (
            <>
              <AppText variant="caption" color="inkMuted">Your plan is only on this phone. Sign in to back it up, so it comes with you to a new phone.</AppText>
              <List>
                <Row first title="Sign in to back up" sub="With Apple or your email" onPress={() => router.push({ pathname: "/onboarding/account", params: { from: "settings" } })} />
                <Row title="Sign out and delete my data" sub="You're not signed in, so this can't be undone" titleColor="roseInk" onPress={() => confirmDelete("account")} />
              </List>
            </>
          )}
        </View>
      </Section> : null}
      <Section title="YOUR DATA">
        <View style={{ gap: space[3] }}>
          <AppText variant="caption" color="inkMuted">{account ? "Your plan is on this phone and backed up to your Steadie account." : "Everything Steadie keeps is on this phone. Nothing is sent to us."}</AppText>
          <List>
            <Row first title="Export my data" sub="A file of everything the app keeps" onPress={() => shareExport().catch(() => toast("Couldn't make the file. Try again."))} />
            {account || showAccount ? null : <Row title="Delete everything" sub="Clears this phone and starts again" titleColor="roseInk" onPress={() => confirmDelete("data")} />}
          </List>
          {confirmCard("data")}
        </View>
      </Section>
      <Section title="ABOUT">
        <List>
          <Row first title="Rate Steadie" sub="Leave a rating or review on the App Store" onPress={() => openWriteReview().catch(() => toast("Couldn't open the App Store."))} />
          <Row title="Privacy policy" onPress={() => router.push({ pathname: "/legal/[doc]", params: { doc: "privacy" } })} />
          <Row title="Terms of use" onPress={() => router.push({ pathname: "/legal/[doc]", params: { doc: "terms" } })} />
        </List>
      </Section>
      {s.demo ? <Section title="DEMO">
        <View style={{ gap: space[3] }}>
          <AppText variant="caption" color="inkMuted">You&apos;re in demo mode with Hannah&apos;s dummy data. These controls only show in demo mode.</AppText>
          <AppText weight="700">Week of the plan</AppText>
          <Choices label="Week" value={week} onChange={(v) => { set((st) => { setWeek(st, v as number); st.food.plan = null; st.food.next = null; }); }}
            options={[1, 6, 9, 27].map((w) => ({ id: w, label: w === 9 ? "Week 9 (Settle)" : w === 27 ? "Week 27 (Steady)" : `Week ${w}` }))} />
          <Button label="Leave the demo and start fresh" variant="secondary" block onPress={() => { replace({ ...freshState(), disclaimer: s.disclaimer }); router.replace("/onboarding"); }} />
          <Button label="Reset to Hannah, week 6" variant="quiet" onPress={() => { replace({ ...demoState(), disclaimer: s.disclaimer }); toast("Back to Hannah in week 6."); router.dismissTo("/"); }} style={{ alignSelf: "center" }} />
        </View>
      </Section> : null}
      {/* Holding this for 3 seconds sends a test error report, to check crash reporting in a TestFlight build. */}
      <Pressable accessible={false} delayLongPress={3000} onLongPress={() => { if (sentryOn()) { sendTestError(); toast("Test error report sent."); } else toast("Crash reporting is off in this build."); }}>
        <AppText variant="caption" color="inkMuted" style={{ textAlign: "center" }}>Steadie {Constants.expoConfig?.version ?? ""}{Updates.updateId ? ` · update ${Updates.updateId.slice(0, 8)}` : ""}. Nutrition is approximate.</AppText>
      </Pressable>
    </Screen>
  );
}

interface Asking { where: "account" | "data"; title: string; message: string; action: string; go: () => unknown; safe?: boolean; other?: { label: string; onPress: () => void } }

/** Asks before something that can't be undone, in place under the row that was tapped (no pop-up). */
function Confirm({ ask, onCancel }: { ask: Asking; onCancel: () => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <Card style={{ gap: space[3] }} accessibilityLiveRegion="polite">
      <AppText weight="800" accessibilityRole="header">{ask.title}</AppText>
      <AppText color="inkMuted">{ask.message}</AppText>
      <Button label={busy ? "One moment…" : ask.action} variant={ask.safe ? "secondary" : "danger"} block disabled={busy}
        onPress={() => { setBusy(true); Promise.resolve(ask.go()).finally(() => setBusy(false)); }} />
      {ask.other ? <Button label={ask.other.label} variant="secondary" block disabled={busy} onPress={() => { onCancel(); ask.other!.onPress(); }} /> : null}
      <Button label="Cancel" variant="quiet" disabled={busy} onPress={onCancel} style={{ alignSelf: "center" }} />
    </Card>
  );
}

/** "today at 09:14" or "3 Oct". */
function when(iso: string) {
  const d = new Date(iso), t = today();
  return isoDate(d) === t ? `today at ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}` : fmt.dayMonth(isoDate(d));
}

/** Guide emails: two new guides a week and a Sunday digest, for people who are signed in. Off unless they turn it on.
 *  The choice is kept by the server (in Resend), so it's read when Settings opens. */
function GuideEmails() {
  const [state, setState] = useState<{ on: boolean; available: boolean } | null>(null);
  useEffect(() => { let live = true; guideEmails().then((v) => { if (live) setState(v); }); return () => { live = false; }; }, []);
  if (!state?.available) return null;
  const change = (on: boolean) => {
    setState({ ...state, on });
    setGuideEmails(on).then(() => toast(on ? "You'll get new guides by email." : "Guide emails are off."), (e) => {
      setState({ ...state, on: !on });
      toast(e instanceof AccountError ? e.message : "Something went wrong. Try again.");
    });
  };
  return <ToggleRow title="Guide emails" sub="Two new guides a week and a Sunday digest. Unsubscribe any time." value={state.on} onChange={change} />;
}

function WeeklyRecap() {
  const [state, setState] = useState<{ on: boolean; available: boolean } | null>(null);
  useEffect(() => { let live = true; weeklyRecap().then((v) => { if (live) setState(v); }); return () => { live = false; }; }, []);
  if (!state?.available) return null;
  const change = (on: boolean) => {
    setState({ ...state, on });
    setWeeklyRecap(on).then(() => toast(on ? "You'll get a recap each Sunday evening." : "The weekly recap is off."), (e) => {
      setState({ ...state, on: !on });
      toast(e instanceof AccountError ? e.message : "Something went wrong. Try again.");
    });
  };
  return <ToggleRow title="Weekly recap email" sub="Sunday evening: check-ins, sessions, steady score and a tip. No weight in Habit Only mode." value={state.on} onChange={change} />;
}

/** Consent to back up health information: withdraw it (deletes the backup on our servers and stops backing up; the
 *  plan stays on this phone), or give it again. Confirmed inline rather than in a pop-up. */
function HealthBackup() {
  const s = useApp();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const off = !!s.consent?.backupOffAt;
  const run = (job: () => Promise<unknown>, done: string) => {
    setBusy(true); setNote("");
    job().then(() => { setConfirming(false); setNote(done); }, (e) => setNote(e instanceof AccountError ? e.message : "Something went wrong. Try again.")).finally(() => setBusy(false));
  };
  if (off) {
    return (
      <View style={{ gap: space[2] }}>
        <AppText variant="caption" color="inkMuted">You&apos;ve withdrawn consent to back up your health information, so your plan is only on this phone.</AppText>
        <Button label={busy ? "One moment…" : "Back up my health information again"} variant="secondary" disabled={busy} onPress={() => run(resumeHealthBackup, "Thanks. Your plan is backed up again.")} />
        {note ? <AppText variant="caption" color="inkMuted">{note}</AppText> : null}
      </View>
    );
  }
  return (
    <View style={{ gap: space[2] }}>
      {!confirming ? (
        <Button label="Withdraw health consent" variant="quiet" onPress={() => { setNote(""); setConfirming(true); }} style={{ alignSelf: "flex-start" }} />
      ) : (
        <View style={{ gap: space[2] }}>
          <AppText weight="800">Withdraw consent for your backup?</AppText>
          <AppText variant="caption" color="inkMuted">This deletes your health information from our servers and stops backing it up. Your plan stays on this phone and you stay signed in. To remove it from this phone too, use Delete my account.</AppText>
          <View style={{ flexDirection: "row", gap: space[2] }}>
            <Button label={busy ? "Withdrawing…" : "Withdraw and delete backup"} disabled={busy} onPress={() => run(withdrawHealthBackup, "Done. Your backup is deleted and your plan is on this phone only.")} />
            <Button label="Keep it" variant="quiet" disabled={busy} onPress={() => setConfirming(false)} />
          </View>
        </View>
      )}
      {note ? <AppText variant="caption" color="inkMuted">{note}</AppText> : null}
    </View>
  );
}
