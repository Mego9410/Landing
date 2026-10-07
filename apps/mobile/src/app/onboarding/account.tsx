import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Platform, useColorScheme, View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Screen } from "@/components/Screen";
import { Banner, Field, Header } from "@/components/ui";
import { fmt } from "@/data/dates";
import { AccountError, appleAvailable, choose, sendCode, signInWithApple, verifyCode, type Outcome } from "@/state/account";
import { toast } from "@/state/toast";
import { radius, space, useColors } from "@/theme";

type Stage = "choose" | "email" | "code";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** O0b Your account: sign in so the plan is backed up and moves to a new phone. Encouraged, never required. Also opened
 *  from Settings (from=settings) and from "I already have an account" on the welcome screen (existing=1). */
export default function AccountStep() {
  const c = useColors();
  const { from, existing } = useLocalSearchParams<{ from?: string; existing?: string }>();
  const fromSettings = from === "settings";
  const [stage, setStage] = useState<Stage>("choose");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [apple, setApple] = useState(false);
  useEffect(() => { appleAvailable().then(setApple).catch(() => setApple(false)); }, []);

  const carryOn = () => (fromSettings ? router.back() : router.push("/onboarding/start"));

  async function finish(outcome: Outcome) {
    if (outcome.kind === "ask") {
      const keep = await pick(outcome.phone, outcome.backup, outcome.backupDate);
      await choose(keep);
      toast(keep === "backup" ? "Your backed-up plan is on this phone." : "This phone's plan is backed up.");
      router.replace("/");
      return;
    }
    if (outcome.kind === "restored") { toast("Welcome back. Your plan is on this phone."); router.replace("/"); return; }
    toast(outcome.kind === "uploaded" ? "Signed in. Your plan is backed up." : "Signed in. Your plan will be backed up as you go.");
    if (fromSettings) router.back(); else router.replace("/onboarding/start");
  }

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
    if (stage !== "choose") { setStage(stage === "code" ? "email" : "choose"); setError(undefined); return; }
    if (router.canGoBack()) router.back(); else router.replace("/onboarding");
  };
  const title = existing ? "Welcome back" : fromSettings ? "Back up your plan" : "Keep your plan safe";
  const lede = existing ? "Sign in with the same Apple ID or email as before, and your plan, logs and check-ins come to this phone."
    : "Sign in and Steadie backs up your plan, logs and check-ins as you go, so they come with you to a new phone.";

  return (
    <Screen contentContainerStyle={{ gap: space[5], paddingBottom: 48, flexGrow: 1 }} header={<Header onBack={back} title={stage === "code" ? "Check your email" : title} />}>
      <View style={{ height: 140, borderRadius: radius.xl, backgroundColor: c.sage, overflow: "hidden" }}>
        <View style={{ position: "absolute", left: -30, right: -30, bottom: -20, height: 70, borderRadius: 35, backgroundColor: c.sky }} />
        <View style={{ position: "absolute", right: 60, top: 28, width: 64, height: 64, borderRadius: 32, backgroundColor: c.apricot }} />
      </View>
      <View style={{ gap: space[2] }}>
        <AppText variant="title" accessibilityRole="header">{stage === "code" ? "Check your email" : title}</AppText>
        <AppText color="inkMuted">{stage === "code" ? `We've sent a six-digit code to ${email.trim()}. It lasts 10 minutes.` : lede}</AppText>
      </View>

      {error ? <Banner tone="rose">{error}</Banner> : null}

      {stage === "choose" ? (
        <View style={{ gap: space[3] }}>
          {apple ? <AppleButton onPress={withApple} disabled={busy} /> : null}
          <Button label="Continue with email" variant={apple ? "secondary" : "primary"} block disabled={busy} onPress={() => { setError(undefined); setStage("email"); }} />
          {fromSettings ? null : <Button label={existing ? "Start a new plan instead" : "Not now"} variant="quiet" onPress={carryOn} style={{ alignSelf: "center" }} />}
          <AppText variant="caption" color="inkMuted">Your backup is private to you. You can sign out or delete it any time in Settings. {existing || fromSettings ? "" : "Without an account, your plan stays on this phone only and is lost if the phone is."}</AppText>
        </View>
      ) : null}

      {stage === "email" ? (
        <View style={{ gap: space[4] }}>
          <Field label="Your email" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
            autoComplete="email" textContentType="emailAddress" returnKeyType="send" onSubmitEditing={send} autoFocus />
          <Button label={busy ? "Sending…" : "Send me a code"} block disabled={busy} onPress={send} />
          <AppText variant="caption" color="inkMuted">No password to remember: we email a code each time you sign in on a new phone.</AppText>
        </View>
      ) : null}

      {stage === "code" ? (
        <View style={{ gap: space[4] }}>
          <Field label="Six-digit code" value={code} maxLength={6} keyboardType="number-pad" autoComplete="one-time-code" textContentType="oneTimeCode" autoFocus
            onChangeText={(v) => { const d = v.replace(/\D/g, ""); setCode(d); if (d.length === 6 && !busy) verify(d); }} />
          <Button label={busy ? "Checking…" : "Sign in"} block disabled={busy} onPress={() => verify()} />
          <Button label="Send a new code" variant="quiet" disabled={busy} onPress={send} style={{ alignSelf: "center" }} />
        </View>
      ) : null}
    </Screen>
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

/** Both this phone and the backup have a plan: the person picks which to keep. */
function pick(phone: string, backup: string, backupDate: string): Promise<"backup" | "phone"> {
  const when = backupDate ? ` (last changed ${fmt.dayMonth(backupDate.slice(0, 10))})` : "";
  const message = `Your backup${when} has ${backup}. This phone has ${phone}. The one you don't keep is replaced.`;
  if (Platform.OS === "web") {
    return Promise.resolve(window.confirm(`You have two plans.\n\n${message}\n\nOK keeps your backup. Cancel keeps this phone's plan.`) ? "backup" : "phone");
  }
  return new Promise((resolve) => {
    Alert.alert("You have two plans", message, [
      { text: "Keep my backup", onPress: () => resolve("backup") },
      { text: "Keep this phone's", onPress: () => resolve("phone") },
    ], { cancelable: false });
  });
}
