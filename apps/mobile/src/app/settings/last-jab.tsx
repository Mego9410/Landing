import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { Choices, Header } from "@/components/ui";
import { phaseOf } from "@/data/content";
import { addDays, fmt, today } from "@/data/dates";
import { gettingReady, jabWeek, set, setLastJab, useApp, weeksToLastJab } from "@/state/store";
import { toast } from "@/state/toast";
import { space } from "@/theme";

// Days before (negative: after) today. A rough answer is fine.
const DONE = [{ id: 0, label: "Today" }, { id: 1, label: "Yesterday" }, { id: 3, label: "A few days ago" }, { id: 7, label: "About a week ago" },
  { id: 17, label: "2 to 3 weeks ago" }, { id: 42, label: "About 6 weeks ago" }, { id: 84, label: "About 3 months ago" }, { id: 182, label: "6 months or more" }];
const AHEAD = [{ id: -14, label: "In about 2 weeks" }, { id: -30, label: "In about a month" }, { id: -75, label: "In 2 to 3 months" }];

/** Your last jab: say it's happened (which starts week 1), or correct the date. Opened from Settings. */
export default function LastJab() {
  const s = useApp(), ready = gettingReady(s), toGo = weeksToLastJab(s);
  const [pick, setPick] = useState<number | null>(null);
  const date = pick == null ? null : addDays(today(), -pick);
  // What the new date would mean, worked out on a copy.
  const preview = date ? { ...s, ob: { ...s.ob, lastInjection: date } } : null;
  const result = !preview ? null : gettingReady(preview)
    ? `You'll keep getting ready, with week 1 starting after your last jab around ${fmt.dayMonth(date!)}.`
    : jabWeek(preview) > 52 ? `You'll be in year two, week ${jabWeek(preview) - 52}.`
    : `You'll be in week ${jabWeek(preview)} of 52, in ${phaseOf(jabWeek(preview)).name}.`;
  return (
    <Screen header={<Header fallback="/settings" title="Your last jab" />} contentContainerStyle={{ gap: space[5], paddingBottom: 48 }}>
      <View style={{ gap: 6 }}>
        <AppText variant="title" accessibilityRole="header">{ready ? "Have you had your last jab?" : "Your last jab"}</AppText>
        <AppText color="inkMuted">
          {ready ? `It's planned for around ${fmt.dayMonth(s.ob.lastInjection)}, in about ${toGo} ${toGo === 1 ? "week" : "weeks"}. If it's happened, or the plan has changed, tell us here.`
            : `Around ${fmt.dayMonth(s.ob.lastInjection)}. If that's not right, pick a closer guess. A rough answer is fine.`}
        </AppText>
      </View>
      <View style={{ gap: space[2] }}>
        <AppText weight="700">It&apos;s happened</AppText>
        <Choices label="When was your last jab" options={DONE} value={pick ?? NaN} onChange={(v) => setPick(v as number)} />
      </View>
      <View style={{ gap: space[2] }}>
        <AppText weight="700">Still to come</AppText>
        <Choices label="When is your last jab planned" options={AHEAD} value={pick ?? NaN} onChange={(v) => setPick(v as number)} />
      </View>
      {result ? <Card tone="sunk"><AppText>{result}</AppText></Card> : null}
      <AppText variant="caption" color="inkMuted">How and when to stop is for you and your prescriber to decide. This only moves your plan to the right week.</AppText>
      <Button label="Save" block disabled={!date} onPress={() => {
        if (!date) return;
        set((st) => setLastJab(st, date));
        toast(date <= today() ? "Thanks. Your plan now runs from your last jab." : "Updated. You'll keep getting ready until then.");
        router.back();
      }} />
    </Screen>
  );
}
