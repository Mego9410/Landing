import { useState } from "react";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Chip } from "@/components/Chip";
import { HabitCheck } from "@/components/HabitCheck";
import { Screen } from "@/components/Screen";
import { radius, space, useColors } from "@/theme";

// Today (design T1), ported from the prototype with its dummy data. Swap the data for real state when the API exists.
const HABITS = [
  { id: "protein", label: "Protein at breakfast", detail: "25 g or more · 4 of 5 days" },
  { id: "strength", label: "Two strength sessions", detail: "1 of 2 done" },
  { id: "pause", label: "Pause before seconds", detail: "Wait 10 minutes, then decide" },
];

export default function Today() {
  const c = useColors();
  const [done, setDone] = useState<Record<string, boolean>>({ protein: true });
  const protein = 64, target = 100;
  return (
    <Screen>
      <View style={{ gap: 2 }}>
        <AppText variant="caption" color="inkMuted">Monday 5 October</AppText>
        <AppText variant="title" accessibilityRole="header">Good afternoon, Hannah</AppText>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
        <Chip label="Week 6 · Land" tone="sky" />
        <AppText variant="caption" color="inkMuted">2 weeks until Settle</AppText>
      </View>

      <Card tone="apricot" hero style={{ gap: 14 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <AppText variant="label" color="onPastel">PROTEIN TODAY</AppText>
          <AppText variant="caption" color="onPastel">Target {target} g</AppText>
        </View>
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}>
          <AppText variant="numeral" color="onPastel" style={{ fontSize: 32, lineHeight: 36 }}>{protein} g</AppText>
          <AppText color="onPastel">so far</AppText>
        </View>
        <View style={{ height: 12, borderRadius: radius.full, backgroundColor: c.surfaceRaised, overflow: "hidden" }} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: target, now: protein }}>
          <View style={{ width: `${(protein / target) * 100}%`, height: "100%", borderRadius: radius.full, backgroundColor: c.onPastel }} />
        </View>
        <Button label="Quick log" icon="plus" variant="secondary" block />
      </Card>

      <View style={{ gap: space[3] }}>
        <AppText variant="heading" accessibilityRole="header">This week&apos;s habits</AppText>
        {HABITS.map((h) => (
          <HabitCheck key={h.id} label={h.label} detail={h.detail} checked={!!done[h.id]} onChange={(v) => setDone({ ...done, [h.id]: v })} />
        ))}
      </View>

      <Card tone="lilac" style={{ gap: 6 }}>
        <AppText variant="label" color="onPastel">TIP FOR TODAY</AppText>
        <AppText variant="bodyLg" color="onPastel">Hunger often comes back mid-afternoon in the first weeks. Greek yoghurt with berries at 3pm takes the edge off.</AppText>
      </Card>
    </Screen>
  );
}
