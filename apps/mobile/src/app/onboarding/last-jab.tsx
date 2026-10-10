import { router } from "expo-router";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Chip, Chips, Lede, OnbCard, OnbScreen, Title } from "@/components/Onboarding";
import { phaseOf, PHASES } from "@/data/content";
import { addDays, daysBetween, today } from "@/data/dates";
import { stillToStop } from "@/state/onboarding";
import { set, setWeek, useApp, weekOf } from "@/state/store";
import { space, useColors } from "@/theme";

const AHEAD = [{ days: 14, label: "In the next 2 weeks" }, { days: 30, label: "In about a month" }, { days: 75, label: "In 2 to 3 months" }, { days: 31, label: "Not sure yet" }];
const AGO = [{ week: 1, label: "This week" }, { week: 3, label: "2 to 3 weeks ago" }, { week: 6, label: "About 6 weeks ago" }, { week: 12, label: "About 3 months ago" }, { week: 27, label: "6 months or more" }];

/** 5 · When the last jab is (or was), so the 12 months start in the right place. A rough guess is fine. */
export default function LastJab() {
  const s = useApp(), c = useColors();
  const ahead = stillToStop(s.story.where);
  const daysAway = daysBetween(today(), s.ob.lastInjection);
  const week = weekOf(s), phase = phaseOf(week);
  const pickedAhead = ahead ? AHEAD.find((a) => a.days === daysAway) : undefined;
  const pickedAgo = !ahead && daysAway <= 0 ? AGO.find((a) => a.week === week) : undefined;
  const chosen = ahead ? !!pickedAhead : !!pickedAgo;
  return (
    <OnbScreen route="last-jab" footer={<Button label="Continue" variant="brand" block disabled={!chosen} onPress={() => router.push("/onboarding/why")} />}>
      <Title>{ahead ? "When are you planning your last jab?" : "When was your last jab?"}</Title>
      <Lede>So we start you at the right point in the 12 months. A rough guess is fine.</Lede>
      <View style={{ marginTop: space[3] }}>
        <Chips>
          {ahead
            ? AHEAD.map((a) => <Chip key={a.label} label={a.label} on={pickedAhead?.label === a.label} onPress={() => set((st) => { st.ob.lastInjection = addDays(today(), a.days); })} />)
            : AGO.map((a) => <Chip key={a.label} label={a.label} on={pickedAgo?.label === a.label} onPress={() => set((st) => setWeek(st, a.week))} />)}
        </Chips>
      </View>
      <OnbCard style={{ marginTop: space[5], gap: space[3] }}>
        <AppText variant="label" color="inkMuted">YOUR 12 MONTHS</AppText>
        <View style={{ flexDirection: "row", gap: 6, height: 56 }} accessible accessibilityLabel={`Your 12 months: ${PHASES.map((p) => p.name).join(", ")}. You start in ${phase.name}.`}>
          {PHASES.map((p) => <View key={p.key} style={{ flex: p.to - p.from + 1, borderRadius: 10, backgroundColor: p.key === phase.key ? c.apricot : c.surfaceSunk }} />)}
        </View>
        <View style={{ flexDirection: "row", gap: 6 }} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
          {PHASES.map((p) => <AppText key={p.key} weight="800" color={p.key === phase.key ? "ink" : "inkMuted"} style={{ flex: p.to - p.from + 1, fontSize: 13 }}>{p.name}</AppText>)}
        </View>
        <AppText weight="700" color="apricotInk" style={{ fontSize: 14, lineHeight: 20 }}>
          {ahead ? "You’ll start at week 1 of Land, so the habits are in place before your last jab." : `You’ll start in week ${week} of 52, in ${phase.name}.`}
        </AppText>
      </OnbCard>
    </OnbScreen>
  );
}
