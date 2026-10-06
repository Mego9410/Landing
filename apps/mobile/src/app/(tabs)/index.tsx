import { Redirect, router } from "expo-router";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Chip } from "@/components/Chip";
import { HabitCheck } from "@/components/HabitCheck";
import { Icon } from "@/components/Icon";
import { Screen } from "@/components/Screen";
import { Avatar, Disc, Meter, RowCard } from "@/components/ui";
import { HABITS, phaseOf, PHASES, SESSIONS, TIPS } from "@/data/content";
import { fmt, TODAY, weekdayIndex } from "@/data/dates";
import { minutes, proteinText, px, thisWeek } from "@/state/food";
import { habitDetail, nextSession, toggleHabit } from "@/state/habits";
import { proteinToday, useApp, weekOf } from "@/state/store";
import { space, useColors } from "@/theme";

function Tonight() {
  const s = useApp(), c = useColors();
  const day = weekdayIndex(TODAY), m = thisWeek(s).days[day].dinner;
  if (m.kind === "takeaway" || !m.recipe) {
    return (
      <RowCard tone="sunk" onPress={() => router.push("/meals")}>
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="label" color="inkMuted">TONIGHT</AppText>
          <AppText weight="800" style={{ fontSize: 16 }}>{m.kind === "takeaway" ? "Takeaway night" : "A free night"}</AppText>
          <AppText variant="caption" color="inkMuted">{m.kind === "takeaway" ? "A night off cooking, planned in" : "Eat out, use the freezer or pick a recipe"}</AppText>
        </View>
      </RowCard>
    );
  }
  const x = px(s, m.recipe);
  return (
    <RowCard onPress={() => router.push({ pathname: "/meals/recipe", params: { id: m.recipe!, which: "this", day: String(day), slot: "dinner" } })}>
      <Disc icon="meal" tone="apricot" />
      <View style={{ flex: 1, gap: 2 }}>
        <AppText variant="label" color="inkMuted">{m.kind === "leftover" ? "TONIGHT · LEFTOVERS" : "TONIGHT"}</AppText>
        <AppText weight="800" style={{ fontSize: 16, color: c.ink }}>{x.name}</AppText>
        <AppText variant="caption" color="inkMuted">{m.kind === "leftover" ? "Cooked earlier this week" : `${minutes(x.recipe)} · ${proteinText(s, x.nutrition.protein)}`}</AppText>
      </View>
    </RowCard>
  );
}

export default function Today() {
  const s = useApp(), c = useColors();
  if (!s.onboarded) return <Redirect href="/onboarding" />;
  const week = weekOf(s), phase = phaseOf(week), next = PHASES[PHASES.indexOf(phase) + 1];
  const protein = proteinToday(s), target = 100, safe = s.settings.safeMode;
  const tip = s.settings.evening ? TIPS.evening : TIPS.day;
  const ses = nextSession(s);
  return (
    <Screen>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: space[3] }}>
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="caption" color="inkMuted">{fmt.long(TODAY)}</AppText>
          <AppText variant="title" accessibilityRole="header">{s.settings.evening ? "Good evening" : "Good afternoon"}, {s.name}</AppText>
        </View>
        <Avatar name={s.name} />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
        <Chip label={`Week ${week} · ${phase.name}`} tone={phase.tone} />
        {next ? <AppText variant="caption" color="inkMuted">{next.from - week} {next.from - week === 1 ? "week" : "weeks"} until {next.name}</AppText> : null}
      </View>

      <Card tone="apricot" hero style={{ gap: 14 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <AppText variant="label" color="onPastel">PROTEIN TODAY</AppText>
          {safe ? null : <AppText variant="caption" color="onPastel">Target {target} g</AppText>}
        </View>
        {safe ? (
          <AppText variant="bodyLg" color="onPastel">{Object.keys(s.protein).length} {Object.keys(s.protein).length === 1 ? "meal" : "meals"} with protein so far</AppText>
        ) : (
          <>
            <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}>
              <AppText variant="numeral" color="onPastel" style={{ fontSize: 32, lineHeight: 36 }}>{protein} g</AppText>
              <AppText color="onPastel">{protein >= target ? "reached today" : "so far"}</AppText>
            </View>
            <Meter value={protein} max={target} tone="onPastel" track="surfaceRaised" label="Protein today" />
          </>
        )}
        <Button label="Quick log" icon="plus" variant="secondary" block onPress={() => router.push("/quick-log")} />
      </Card>

      <View style={{ gap: space[3] }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <AppText variant="heading" accessibilityRole="header">This week&apos;s habits</AppText>
          <Button label="Swap one" variant="quiet" onPress={() => router.push("/swap-habit")} style={{ marginRight: -space[4] }} />
        </View>
        {s.habits.ids.map((id) => (
          <HabitCheck key={id} label={HABITS[id].label} detail={habitDetail(s, id)} checked={!!s.habits.today[id]} onChange={(v) => toggleHabit(id, v)} />
        ))}
      </View>

      {ses ? (
        <RowCard onPress={() => router.push({ pathname: "/workouts/[id]", params: { id: ses } })}>
          <Disc icon="workout" tone="sage" />
          <View style={{ flex: 1, gap: 2 }}>
            <AppText variant="label" color="inkMuted">TODAY&apos;S SESSION</AppText>
            <AppText weight="800" style={{ fontSize: 16 }}>{SESSIONS[ses].name} · at home</AppText>
            <AppText variant="caption" color="inkMuted">{SESSIONS[ses].minutes} minutes · {SESSIONS[ses].moves.length} exercises</AppText>
          </View>
        </RowCard>
      ) : (
        <RowCard tone="sage" onPress={() => router.push("/workouts")}>
          <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: c.onPastel, alignItems: "center", justifyContent: "center" }}><Icon name="check" color={c.sage} /></View>
          <View style={{ flex: 1, gap: 2 }}>
            <AppText variant="label" color="onPastel">THIS WEEK&apos;S SESSIONS</AppText>
            <AppText weight="800" color="onPastel" style={{ fontSize: 16 }}>Both done</AppText>
            <AppText variant="caption" color="onPastel">Next ones arrive on Monday</AppText>
          </View>
        </RowCard>
      )}

      <Tonight />

      <Card tone="lilac" style={{ gap: 6 }}>
        <AppText variant="label" color="onPastel">{tip.label}</AppText>
        <AppText variant="bodyLg" color="onPastel">{tip.text}</AppText>
        <Button label="Ask the coach for more ideas" variant="quiet" onPress={() => router.push("/coach")} style={{ marginLeft: -space[6] }} />
      </Card>
    </Screen>
  );
}
