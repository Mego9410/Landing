import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button, useBrand } from "@/components/Button";
import { Chip, Chips, Lede, OnbScreen, Title } from "@/components/Onboarding";
import { Mark } from "@/components/Mark";
import { track } from "@/state/events";
import { ensurePermission } from "@/state/reminders";
import { set, useApp } from "@/state/store";
import { radius, space, useColors } from "@/theme";

const TIMES = [[7, 0], [7, 30], [8, 0]] as const;
const LATER = [[8, 30], [9, 0], [10, 0]] as const;
const label = (h: number, m: number) => `${h}:${String(m).padStart(2, "0")}`;

/** 18 · Want a gentle nudge each morning? The one moment the app asks to send notifications: granted, the check-in
 *  reminder is on at that time; not now, or refused, onboarding carries on and Settings explains how to turn it on. */
export default function Nudge() {
  const s = useApp(), c = useColors(), brand = useBrand();
  const r = s.settings.reminders.checkIn;
  const [time, setTime] = useState<[number, number]>([r.hour === 8 && r.minute === 0 ? 7 : r.hour, r.hour === 8 && r.minute === 0 ? 30 : r.minute]);
  const [later, setLater] = useState(LATER.some(([h, m]) => h === time[0] && m === time[1]));
  const [busy, setBusy] = useState(false);
  const name = s.name.trim();
  async function remind() {
    setBusy(true);
    const ok = await ensurePermission().catch(() => false);
    track(ok ? "notification_permission_granted" : "notification_permission_denied", { where: "onboarding" });
    set((st) => { st.settings.reminders.checkIn = { on: ok, hour: time[0], minute: time[1] }; });
    setBusy(false);
    router.push("/onboarding/building");
  }
  const chip = ([h, m]: readonly [number, number]) => <Chip key={label(h, m)} label={label(h, m)} on={time[0] === h && time[1] === m} onPress={() => setTime([h, m])} />;
  return (
    <OnbScreen route="nudge" ground="sky" accent="skyInk" footer={<>
      <Button label={busy ? "One moment…" : `Remind me at ${label(...time)}`} variant="ink" block disabled={busy} onPress={remind} />
      <Button label="Not now" variant="quiet" onPress={() => router.push("/onboarding/building")} style={{ alignSelf: "center" }} />
    </>}>
      <View accessible accessibilityLabel={`Example reminder: Morning${name ? `, ${name}` : ""}. Two minutes to check in?`}
        style={{ backgroundColor: c.surfaceRaised, borderRadius: 22, padding: space[3], paddingHorizontal: 14, flexDirection: "row", gap: space[3], alignItems: "center", shadowColor: "#285E7E", shadowOpacity: 0.15, shadowRadius: 24, shadowOffset: { width: 0, height: 8 }, elevation: 2 }}>
        <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: brand, alignItems: "center", justifyContent: "center" }}><Mark height={28} color="#FBF1E4" hole={brand} ground={false} /></View>
        <View style={{ flex: 1, gap: 1 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <AppText weight="800" color="inkMuted" style={{ fontSize: 13 }}>STEADIE</AppText>
            <AppText weight="700" color="inkMuted" style={{ fontSize: 13 }}>{label(...time)}</AppText>
          </View>
          <AppText weight="800" style={{ fontSize: 15 }}>Morning{name ? `, ${name}` : ""}. Two minutes to check in?</AppText>
        </View>
      </View>
      <View style={{ alignItems: "center", marginTop: space[6] }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><Mark height={110} hole={c.sky} /></View>
      <View style={{ marginTop: space[4], gap: space[2] }}>
        <Title center color="onPastel">Want a gentle nudge each morning?</Title>
        <Lede center color="onPastel">One a day. Never about weight, and none on days you’ve already checked in.</Lede>
      </View>
      <View style={{ marginTop: space[3], gap: space[2], borderRadius: radius.md }}>
        <Chips center>
          {TIMES.map(chip)}
          {later ? LATER.map(chip) : <Chip label="Later" on={false} onPress={() => setLater(true)} />}
        </Chips>
      </View>
    </OnbScreen>
  );
}
