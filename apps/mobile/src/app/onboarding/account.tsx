import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useColorScheme, View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { Lede, OnbScreen, Title } from "@/components/Onboarding";
import { Banner, Field, IconButton, ToggleRow } from "@/components/ui";
import { fmt } from "@/data/dates";
import { AccountError, appleAvailable, choose, sendCode, setGuideEmails, setWeeklyRecap, signInWithApple, verifyCode, type Outcome } from "@/state/account";
import { toast } from "@/state/toast";
import { space, useColors } from "@/theme";

type Stage = "choose" | "email" | "code" | "pick";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 25 · Keep your plan safe: sign in so the plan is backed up and moves to a new phone. Encouraged, never required. The
 *  last step of onboarding (from=onboarding), and also opened from Settings (from=settings) and from "I already have an
 *  account" on the welcome screen (existing=1). */
export default function AccountStep() {
  const c = useColors();
  const { from, existing } = useLocalSearchParams<{ from?: string; existing?: string }>();
  const fromSettings = from === "settings", atEnd = from === "onboarding";
  const [stage, setStage] = useState<Stage>("choose");
  const [twoPlans, setTwoPlans] = useState<Extract<Outcome, { kind: "ask" }> | null>(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [apple, setApple] = useState(false);
  // Guide emails are opt-in: off unless they turn this on. Saved once they've signed in.
  const [emails, setEmails] = useState(false);
  const [recap, setRecap] = useState(false);
  useEffect(() => { appleAvailable().then(setApple).catch(() => setApple(false)); }, []);

  // Not now: back to Settings, on to Today at the end of onboarding, or (from the welcome screen) start a new plan.
  const carryOn = () => (fromSettings ? router.back() : atEnd ? router.replace("/") : router.replace("/onboarding/name"));

  async function finish(outcome: Outcome) {
    if (emails) setGuideEmails(true).catch(() => toast("Signed in, but we couldn't turn on guide emails. You can do it in Settings."));
    if (recap) setWeeklyRecap(true).catch(() => toast("Signed in, but we couldn't turn on the weekly recap. You can do it in Settings."));
    if (outcome.kind === "ask") { setTwoPlans(outcome); setStage("pick"); return; }
    if (outcome.kind === "restored") { toast("Welcome back. Your plan is on this phone."); router.replace("/"); return; }
    toast(outcome.kind === "uploaded" ? "Signed in. Your plan is backed up." : "Signed in. Your plan will be backed up as you go.");
    if (fromSettings) router.back(); else if (atEnd) router.replace("/"); else router.replace("/onboarding/name");
  }

  /** Both this phone and the backup have a plan: keep the one they pick. */
  const keep = (which: "backup" | "phone") => run(async () => {
    await choose(which);
    toast(which === "backup" ? "Your backed-up plan is on this phone." : "This phone's plan is backed up.");
    router.replace("/");
  });

  async function run(job: () => Promise<void>) {
    setBusy(true); setError(undefined);
    try { await job(); } catch (e) { setError(e instanceof AccountError ? e.message : "Something went wrong. Try again."); } finally { setBusy(false); }
  }
  const withApple = () => run(async () => { const o = await signInWithApple(); if (o) await finish(o); });
  const send = () => run(async () => {
    if (!EMAIL.test(email.trim())) throw new AccountError("That doesn't look like an email address.");
    await sendCode(email);
    setCode(""); setStage("code");
  });
  const verify = (value = code) => run(async () => {
    if (!/^\d{6}$/.test(value.trim())) throw new AccountError("The code is the six numbers in the email.");
    await finish(await verifyCode(email, value));
  });

  const back = () => {
    if (stage === "pick") return; // signed in already: they need to pick one
    if (stage !== "choose") { setStage(stage === "code" ? "email" : "choose"); setError(undefined); return; }
    if (router.canGoBack()) router.back(); else router.replace("/onboarding");
  };
  const showBack = stage !== "pick" && (stage !== "choose" || !atEnd);
  const title = existing ? "Welcome back" : fromSettings ? "Back up your plan" : "Keep your plan safe";
  const lede = existing ? "Sign in with the same Apple ID or email as before, and your plan, logs and check-ins come to this phone."
    : "Sign in and Steadie backs up your plan, logs and check-ins as you go, so they come with you to a new phone.";

  return (
    <OnbScreen footer={stage === "choose" && !fromSettings ? <Button label={existing ? "Start a new plan instead" : "Maybe later"} variant="quiet" onPress={carryOn} style={{ alignSelf: "center" }} /> : undefined}>
      {showBack ? <View style={{ alignSelf: "flex-start", marginBottom: space[2] }}><IconButton icon="back" label="Back" onPress={back} /></View> : null}
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: 72, height: 72, borderRadius: 24, backgroundColor: c.sage, alignItems: "center", justifyContent: "center", marginTop: space[2] }}>
        <Icon name="lock" size={30} color={c.onPastel} />
      </View>
      <View style={{ marginTop: space[3] }}><Title>{stage === "code" ? "Check your email" : title}</Title></View>
      <Lede>{stage === "code" ? `We’ve sent a six-digit code to ${email.trim()}. It lasts 10 minutes.` : lede}</Lede>

      {error ? <Banner tone="rose">{error}</Banner> : null}

      {stage === "choose" ? (
        <View style={{ gap: space[3] }}>
          {apple ? <AppleButton onPress={withApple} disabled={busy} /> : null}
          <Button label="Continue with email" variant={apple ? "secondary" : "brand"} block disabled={busy} onPress={() => { setError(undefined); setStage("email"); }} />
          <View style={{ gap: space[2], marginTop: space[2] }}>
            <View style={{ backgroundColor: c.surfaceRaised, borderRadius: 18, padding: 14, paddingHorizontal: space[4] }}>
              <ToggleRow title="Email me new guides" sub="Two short guides a week and a Sunday digest. Unsubscribe any time." value={emails} onChange={setEmails} />
            </View>
            <View style={{ backgroundColor: c.surfaceRaised, borderRadius: 18, padding: 14, paddingHorizontal: space[4] }}>
              <ToggleRow title="Email me a weekly recap" sub="Sunday evening: your week and a tip. No weight in safe mode." value={recap} onChange={setRecap} />
            </View>
          </View>
          <AppText variant="caption" color="inkMuted" style={{ fontSize: 14, lineHeight: 20 }}>Encrypted and kept in London. Never sold, never used for ads. {existing || fromSettings ? "" : "Without an account, your plan stays on this phone only and is lost if the phone is."}</AppText>
        </View>
      ) : null}

      {stage === "pick" && twoPlans ? (
        <View style={{ gap: space[3] }}>
          <AppText weight="800" accessibilityRole="header">You have two plans</AppText>
          <AppText color="inkMuted">Your backup{twoPlans.backupDate ? ` (last changed ${fmt.dayMonth(twoPlans.backupDate.slice(0, 10))})` : ""} has {twoPlans.backup}. This phone has {twoPlans.phone}. The one you don&apos;t keep is replaced.</AppText>
          <Button label={busy ? "One moment…" : "Keep my backup"} variant="brand" block disabled={busy} onPress={() => keep("backup")} />
          <Button label="Keep this phone's plan" variant="secondary" block disabled={busy} onPress={() => keep("phone")} />
        </View>
      ) : null}

      {stage === "email" ? (
        <View style={{ gap: space[4] }}>
          <Field label="Your email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
            autoComplete="email" textContentType="emailAddress" returnKeyType="send" onSubmitEditing={send} autoFocus />
          <Button label={busy ? "Sending…" : "Send me a code"} variant="brand" block disabled={busy} onPress={send} />
          <AppText variant="caption" color="inkMuted">No password to remember: we email a code each time you sign in on a new phone.</AppText>
        </View>
      ) : null}

      {stage === "code" ? (
        <View style={{ gap: space[4] }}>
          <Field label="Six-digit code" value={code} maxLength={6} keyboardType="number-pad" autoComplete="one-time-code" textContentType="oneTimeCode" autoFocus
            onChangeText={(v) => { const d = v.replace(/\D/g, ""); setCode(d); if (d.length === 6 && !busy) verify(d); }} />
          <Button label={busy ? "Checking…" : "Sign in"} variant="brand" block disabled={busy} onPress={() => verify()} />
          <Button label="Send a new code" variant="quiet" disabled={busy} onPress={send} style={{ alignSelf: "center" }} />
        </View>
      ) : null}
    </OnbScreen>
  );
}

/** Apple's own button, as its guidelines ask. Loaded only where Sign in with Apple works. */
function AppleButton({ onPress, disabled }: { onPress: () => void; disabled: boolean }) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Apple = require("expo-apple-authentication") as typeof import("expo-apple-authentication");
  const dark = useColorScheme() === "dark";
  return (
    <View pointerEvents={disabled ? "none" : "auto"} style={{ opacity: disabled ? 0.6 : 1 }}>
      <Apple.AppleAuthenticationButton onPress={onPress} cornerRadius={26} style={{ height: 52 }}
        buttonType={Apple.AppleAuthenticationButtonType.CONTINUE}
        buttonStyle={dark ? Apple.AppleAuthenticationButtonStyle.WHITE : Apple.AppleAuthenticationButtonStyle.BLACK} />
    </View>
  );
}

