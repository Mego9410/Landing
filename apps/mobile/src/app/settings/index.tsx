import { router } from "expo-router";
import { Alert, Platform, View } from "react-native";
import { LABELS } from "@landing/engine";
import { castById } from "@landing/motion";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { Choices, Header, List, Row, Section, ToggleRow } from "@/components/ui";
import { phaseOf } from "@/data/content";
import { fmt, isoDate, today } from "@/data/dates";
import { demoState, freshState, replace, set, setWeek, useApp, weekOf, type Units } from "@/state/store";
import { toast } from "@/state/toast";
import { available, connect, disconnect } from "@/state/appleHealth";
import { accountsAvailable, AccountError, backUpNow, deleteAccount, signOut, useAccount } from "@/state/account";
import { deleteEverything, shareExport } from "@/state/data";
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
    if (!available()) { toast("Apple Health works in the App Store version of Landing."); return; }
    await connect().catch(() => toast("Couldn't connect to Apple Health."));
  }
  const { account, status } = useAccount();
  const showAccount = accountsAvailable() && !s.demo;
  const backedUp = status === "saving" ? "Backing up…" : status === "offline" ? "Couldn't reach Landing. It'll try again." : account?.syncedAt ? `Backed up ${when(account.syncedAt)}` : "Backs up once your plan is set up";
  const fail = (e: unknown) => toast(e instanceof AccountError ? e.message : "Something went wrong. Try again.");
  const confirmDelete = () => confirm("Delete everything?", "This clears all your answers, logs, weigh-ins and check-ins from this phone. It can't be undone.", "Delete everything",
    () => deleteEverything().then(() => router.replace("/disclaimer")));
  const confirmSignOut = () => confirm("Sign out?", "Your plan is backed up first, then cleared from this phone. Sign in again to bring it back.", "Sign out",
    () => signOut().then(() => { toast("Signed out. Your backup is safe."); router.replace("/disclaimer"); }, fail));
  const confirmDeleteAccount = () => confirm("Delete your account?", "This deletes your account and your backup from Landing's servers, and clears this phone. It can't be undone.", "Delete my account",
    () => deleteAccount().then(() => { toast("Your account and backup are deleted."); router.replace("/disclaimer"); }, fail));
  return (
    <Screen contentContainerStyle={{ gap: space[6], paddingBottom: 48 }}>
      <Header fallback="/" />
      <AppText variant="title" accessibilityRole="header">Settings</AppText>
      <Section title="YOUR PLAN">
        <List>
          <Row first title={s.name || "Your plan"} sub={`Week ${week} · ${phaseOf(week).name}`} />
          <Row title="Food preferences" value={LABELS.diet[s.food.diet]} onPress={() => router.push("/meals/preferences")} />
          <Row title="Exercise demos" value={s.demos.who === "mix" ? "Mix it up" : castById(s.demos.who).name} onPress={() => router.push("/settings/demos")} />
        </List>
      </Section>
      <Section title="SUPPORT">
        <View style={{ gap: space[3] }}>
          <List>
            <Row first title="Health and safety" sub={s.disclaimer ? `You accepted this on ${fmt.dayMonth(s.disclaimer.acceptedAt.slice(0, 10))}` : undefined} onPress={() => router.push({ pathname: "/disclaimer", params: { review: "1" } })} />
            <Row title="Your health check" sub={s.health.checkedAt ? `Last done ${fmt.dayMonth(s.health.checkedAt)}` : "Not done yet"} onPress={() => router.push({ pathname: "/onboarding/health", params: { recheck: "1" } })} />
          </List>
          <ToggleRow title="Safe mode" sub="Hides weight and numbers, and keeps the focus on routines" value={s.settings.safeMode} onChange={(v) => { set((st) => { st.settings.safeMode = v; }); toast(v ? "Safe mode is on." : "Safe mode is off."); }} />
          <AppText variant="caption" color="inkMuted">If food or eating feels hard, Beat&apos;s helpline is there to talk to.</AppText>
        </View>
      </Section>
      <Section title="YOUR APP">
        <View style={{ gap: space[3] }}>
          <List>
            <Row first title="Reminders" value={on} onPress={() => router.push("/settings/reminders")} />
            <Row title="Apple Health" sub={healthSub} onPress={toggleHealth} chevron={false} right={<AppText weight="800" color="apricotInk">{s.settings.appleHealth ? "Disconnect" : available() ? "Connect" : ""}</AppText>} />
          </List>
          <AppText weight="700">Units</AppText>
          <Choices label="Units" value={s.settings.units} onChange={(v) => set((st) => { st.settings.units = v as Units; })} options={[{ id: "kg", label: "Kilograms" }, { id: "stlb", label: "Stones and pounds" }]} />
        </View>
      </Section>
      {showAccount ? <Section title="ACCOUNT">
        <View style={{ gap: space[3] }}>
          {account ? (
            <List>
              <Row first title={account.email || "Signed in"} sub={backedUp} chevron={false} />
              <Row title="Back up now" onPress={() => backUpNow().then((o) => toast(o.kind === "restored" ? "Newer changes from your other phone are here." : "Backed up."), fail)} />
              <Row title="Sign out" sub="Your backup stays. This phone is cleared." onPress={confirmSignOut} />
              <Row title="Delete my account" sub="Deletes your backup and clears this phone" titleColor="roseInk" onPress={confirmDeleteAccount} />
            </List>
          ) : (
            <>
              <AppText variant="caption" color="inkMuted">Your plan is only on this phone. Sign in to back it up, so it comes with you to a new phone.</AppText>
              <List>
                <Row first title="Sign in to back up" sub="With Apple or your email" onPress={() => router.push({ pathname: "/onboarding/account", params: { from: "settings" } })} />
              </List>
            </>
          )}
        </View>
      </Section> : null}
      <Section title="YOUR DATA">
        <View style={{ gap: space[3] }}>
          <AppText variant="caption" color="inkMuted">{account ? "Your plan is on this phone and backed up to your Landing account." : "Everything Landing keeps is on this phone. Nothing is sent to us."}</AppText>
          <List>
            <Row first title="Export my data" sub="A file of everything the app keeps" onPress={() => shareExport().catch(() => toast("Couldn't make the file. Try again."))} />
            {account ? null : <Row title="Delete everything" sub="Clears this phone and starts again" titleColor="roseInk" onPress={confirmDelete} />}
          </List>
        </View>
      </Section>
      <Section title="ABOUT">
        <List>
          <Row first title="Privacy policy" onPress={() => router.push({ pathname: "/legal/[doc]", params: { doc: "privacy" } })} />
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
      <AppText variant="caption" color="inkMuted" style={{ textAlign: "center" }}>Landing 1.0 · preview. Recipes and nutrition are drafts until our dietitian signs them off.</AppText>
    </Screen>
  );
}

/** Asks before something that can't be undone. */
function confirm(title: string, message: string, action: string, go: () => void) {
  if (Platform.OS === "web") { if (window.confirm(`${title} ${message}`)) go(); return; }
  Alert.alert(title, message, [{ text: "Cancel", style: "cancel" }, { text: action, style: "destructive", onPress: go }]);
}

/** "today at 09:14" or "3 Oct". */
function when(iso: string) {
  const d = new Date(iso), t = today();
  return isoDate(d) === t ? `today at ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}` : fmt.dayMonth(isoDate(d));
}
