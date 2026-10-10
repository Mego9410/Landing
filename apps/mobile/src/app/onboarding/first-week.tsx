import { router } from "expo-router";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { OnbScreen, Title } from "@/components/Onboarding";
import { habitsForWeek, phaseOf, PHASES } from "@/data/content";
import { today, weekdayIndex } from "@/data/dates";
import { mealAt, px, thisWeek } from "@/state/food";
import { sessionsPaused } from "@/state/health";
import { track } from "@/state/events";
import { daysPhrase, ifThenSentence, mealsPhrase, noiseMoment, WHERE_PHRASE } from "@/state/onboarding";
import { refreshReminders } from "@/state/reminders";
import { PROTEIN_TARGET } from "@/state/today";
import { get, set, useApp, weekOf } from "@/state/store";
import { radius, space, useColors } from "@/theme";

const DAY = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** 20 · Your first week: today's meals from the real plan, the strength days, their food-noise plan and what the plan
 *  was built around. "Make it mine" finishes onboarding: the plan starts today. */
export default function FirstWeek() {
  const s = useApp(), c = useColors();
  const name = s.name.trim(), t = today(), day = weekdayIndex(t), week = weekOf(s), phase = phaseOf(week);
  const plan = thisWeek(s), strength = s.settings.reminders.sessions.days;
  const meal = (slot: "breakfast" | "dinner") => {
    const m = mealAt(plan, day, slot);
    if (!m?.recipe || m.kind === "free" || m.kind === "takeaway") return null;
    const p = px(s, m.recipe);
    return { name: p.name, protein: Math.round(p.nutrition.protein) };
  };
  const meals = [{ slot: "Breakfast", m: meal("breakfast"), tone: c.butter }, { slot: "Dinner", m: meal("dinner"), tone: c.sage }].filter((x) => x.m);
  const ticks = [
    s.story.where ? `Planned around ${WHERE_PHRASE[s.story.where]}` : null,
    mealsPhrase(s).replace(/^./, (x) => x.toUpperCase()),
    sessionsPaused(s) ? "Strength once your GP is happy" : strength.length ? `Strength ${s.story.strengthAt === "gym" ? "" : "at home "}on ${daysPhrase(strength)}` : "Two short strength sessions a week",
    s.settings.safeMode ? "Weight and numbers hidden" : s.story.weightView === "trend" ? "Weight shown as a trend only" : "Your weight trend, gently",
  ].filter((x): x is string => !!x);

  function makeItMine() {
    set((st) => {
      st.onboarded = true;
      st.startedOn = today();
      st.habits = { week, ids: habitsForWeek(week), swappedFrom: null };
      st.food.joinedWeek = week; // the fibre ramp starts today
      st.food.plan = null;
      st.phaseSeen = phase.key; // no celebration for the phase they start in
    });
    refreshReminders(get()); // the check-in reminder, if turned on, starts tomorrow
    track("onboarding_completed", { week });
    router.push("/onboarding/promise");
  }

  return (
    <OnbScreen route="first-week" back={false} footer={<Button label="Make it mine" variant="brand" block onPress={makeItMine} />}>
      <Title>{name ? `${name}, here’s your first week` : "Here’s your first week"}</Title>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: space[1] }}>
        {[0, 1, 2, 3].map((i) => {
          const d = (day + i) % 7, gym = strength.includes(d) && !sessionsPaused(s);
          return (
            <View key={i} style={{ borderRadius: radius.full, paddingVertical: 5, paddingHorizontal: 11, backgroundColor: i === 0 ? c.ink : gym ? c.lilac : c.surfaceSunk }}>
              <AppText weight="800" color={i === 0 ? undefined : gym ? "onPastel" : "ink"} style={{ fontSize: 13, color: i === 0 ? c.surface : undefined }}>{i === 0 ? "Today" : DAY[d]}{gym ? " · strength" : ""}</AppText>
            </View>
          );
        })}
      </View>
      <View style={{ backgroundColor: c.apricot, borderRadius: radius.lg, padding: 14, gap: space[2], marginTop: space[1] }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: space[2] }}>
          <AppText variant="heading" color="onPastel" style={{ fontSize: 18 }}>Today</AppText>
          {s.settings.safeMode ? null : <View style={{ backgroundColor: c.surfaceRaised, borderRadius: radius.full, paddingVertical: 5, paddingHorizontal: 11 }}><AppText weight="800" style={{ fontSize: 13 }}>Protein · 0 of {PROTEIN_TARGET} g</AppText></View>}
        </View>
        {meals.map(({ slot, m, tone }) => (
          <View key={slot} style={{ flexDirection: "row", gap: 10, alignItems: "center", backgroundColor: c.surfaceRaised, borderRadius: radius.md, padding: 10, paddingHorizontal: space[3] }}>
            <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: tone }} />
            <View style={{ flex: 1 }}>
              <AppText weight="800" style={{ fontSize: 14 }}>{m!.name}</AppText>
              <AppText variant="caption" color="inkMuted">{slot}{s.settings.safeMode ? "" : ` · ${m!.protein} g protein`}</AppText>
            </View>
          </View>
        ))}
        {s.story.ifThen ? (
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center", backgroundColor: c.surfaceRaised, borderRadius: radius.md, padding: 10, paddingHorizontal: space[3] }}>
            <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: c.ink }} />
            <View style={{ flex: 1 }}>
              <AppText weight="800" style={{ fontSize: 14 }}>{(() => { const x = ifThenSentence(s.story); return `${x.when}: ${x.action}`; })()}</AppText>
              <AppText variant="caption" color="inkMuted">Your {noiseMoment(s.story).short} plan</AppText>
            </View>
          </View>
        ) : null}
      </View>
      <View style={{ gap: 7, marginTop: space[2] }}>
        {ticks.map((x) => (
          <View key={x} style={{ flexDirection: "row", gap: space[2], alignItems: "center" }}>
            <Icon name="check" size={18} color={c.sageInk} strokeWidth={2.6} />
            <AppText weight="700" style={{ flex: 1, fontSize: 15 }}>{x}</AppText>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: "row", gap: 6, marginTop: space[3] }} accessible accessibilityLabel={`You’re here: week ${week} of 52, ${phase.name}`}>
        {PHASES.map((p) => <View key={p.key} style={{ flex: p.to - p.from + 1, height: 8, borderRadius: radius.full, backgroundColor: p.key === phase.key ? "#E07A52" : c.surfaceSunk }} />)}
      </View>
      <AppText variant="caption" weight="700" color="inkMuted">You’re here: {phase.name} · week {week} of 52</AppText>
    </OnbScreen>
  );
}
