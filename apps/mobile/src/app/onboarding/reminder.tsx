import { router } from "expo-router";
import { useState } from "react";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Step } from "@/components/Onboarding";
import { Choices } from "@/components/ui";
import { ensurePermission } from "@/state/reminders";
import { set, useApp } from "@/state/store";
import { space } from "@/theme";

const HOURS = [6, 7, 8, 9, 10, 11];
const label = (h: number) => `${h}am`;

/** The morning check-in time, and the one moment the app asks to send notifications. Saying no is fine: onboarding
 *  carries on and Settings > Reminders explains how to turn them on later. The reminder itself is scheduled once
 *  onboarding finishes (it starts the day after). */
export default function Reminder() {
  const s = useApp();
  const [hour, setHour] = useState(s.settings.reminders.checkIn.hour || 8);
  const [busy, setBusy] = useState(false);

  async function turnOn() {
    setBusy(true);
    const ok = await ensurePermission().catch(() => false);
    set((st) => { st.settings.reminders.checkIn = { on: ok, hour, minute: 0 }; });
    setBusy(false);
    router.push("/onboarding/ready");
  }

  return (
    <Step n={6} title="Your morning check-in" lede="When's a good time for your 1-minute check-in? It's a few taps on how yesterday went, and over a few weeks it shows what helps."
      next={turnOn} label={busy ? "One moment…" : "Remind me each morning"}
      after={<Button label="Not now" variant="quiet" onPress={() => router.push("/onboarding/ready")} style={{ alignSelf: "center" }} />}>
      <Choices label="Check-in time" value={hour} onChange={(v) => setHour(v as number)} options={HOURS.map((h) => ({ id: h, label: label(h) }))} />
      <Card tone="sky" style={{ gap: space[1] }}>
        <AppText weight="800" color="onPastel">We&apos;ll send one gentle nudge a day. Nothing else.</AppText>
        <AppText variant="caption" color="onPastel">Never about weight, and none on days you&apos;ve already checked in. You can change the time or turn it off in Settings.</AppText>
      </Card>
    </Step>
  );
}
