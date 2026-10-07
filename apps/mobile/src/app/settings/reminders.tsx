import { Linking, View } from "react-native";
import { useState } from "react";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { Choices, Header, ToggleRow } from "@/components/ui";
import { DAYS } from "@landing/engine";
import { sessionsPaused } from "@/state/health";
import { applyReminders, ensurePermission, type Reminders as R } from "@/state/reminders";
import { get, set, useApp } from "@/state/store";
import { toast } from "@/state/toast";
import { space } from "@/theme";

const TIMES = [7, 8, 9, 12, 17, 18, 19, 20];
const label = (h: number) => (h === 12 ? "Midday" : h < 12 ? `${h}am` : `${h - 12}pm`);

/** S2 Reminders: the morning check-in, session days and a Sunday nudge to plan meals. */
export default function Reminders() {
  const s = useApp(), r = s.settings.reminders;
  const [denied, setDenied] = useState(false);

  async function change(fn: (r: R) => void, turningOn: boolean) {
    if (turningOn && !(await ensurePermission())) { setDenied(true); return; }
    set((st) => fn(st.settings.reminders));
    await applyReminders(get()).catch(() => toast("Reminders couldn't be set on this phone."));
  }

  return (
    <Screen header={<Header fallback="/settings" title="Reminders" />} contentContainerStyle={{ gap: space[5], paddingBottom: 48 }}>
      <View style={{ gap: space[2] }}>
        <AppText variant="title" accessibilityRole="header">Reminders</AppText>
        <AppText color="inkMuted">A gentle nudge at a time that suits you. They never mention weight, and you can turn them off whenever you like.</AppText>
      </View>
      {denied ? (
        <Card tone="butter" style={{ gap: space[2] }}>
          <AppText weight="800" color="onPastel">Notifications are off for Landing</AppText>
          <AppText color="onPastel">To get reminders, allow notifications for Landing in your phone&apos;s Settings.</AppText>
          <Button label="Open Settings" variant="secondary" onPress={() => Linking.openSettings()} />
        </Card>
      ) : null}

      <Card style={{ gap: space[3] }}>
        <ToggleRow title="Morning check-in" sub="A minute on how yesterday went" value={r.checkIn.on} onChange={(v) => change((x) => { x.checkIn.on = v; }, v)} />
        {r.checkIn.on ? <Choices label="Check-in time" value={r.checkIn.hour} onChange={(v) => change((x) => { x.checkIn.hour = v as number; }, false)} options={TIMES.filter((h) => h <= 12).map((h) => ({ id: h, label: label(h) }))} /> : null}
      </Card>

      <Card style={{ gap: space[3] }}>
        <ToggleRow title="Strength sessions" sub={sessionsPaused(s) ? "Waiting until you've checked with your GP" : "On the days you choose"} value={r.sessions.on} onChange={(v) => change((x) => { x.sessions.on = v; }, v)} />
        {r.sessions.on ? (
          <>
            <Choices label="Session days" value={r.sessions.days} onChange={(v) => change((x) => { x.sessions.days = (v as number[]).sort(); }, false)} options={DAYS.map((d, i) => ({ id: i, label: d.slice(0, 3) }))} />
            <Choices label="Session time" value={r.sessions.hour} onChange={(v) => change((x) => { x.sessions.hour = v as number; }, false)} options={TIMES.map((h) => ({ id: h, label: label(h) }))} />
          </>
        ) : null}
      </Card>

      <Card style={{ gap: space[3] }}>
        <ToggleRow title="Plan next week's meals" sub="Sunday at 5pm" value={r.planning.on} onChange={(v) => change((x) => { x.planning.on = v; }, v)} />
      </Card>
    </Screen>
  );
}
