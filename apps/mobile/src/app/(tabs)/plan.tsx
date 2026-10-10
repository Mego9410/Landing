import { router } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { progress } from "@landing/engine";
import { AppText } from "@/components/AppText";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { FreeNightCard, MealRow, TakeawayCard } from "@/components/meals";
import { Avatar, Disc, List, RowCard } from "@/components/ui";
import { PHASES } from "@/data/content";
import { fmt, today, weekDates, weekdayIndex } from "@/data/dates";
import { sessionFor } from "@/data/sessions";
import { dayName, minutes, px, thisWeek } from "@/state/food";
import { nextSession, sessionTarget } from "@/state/habits";
import { sessionsPaused } from "@/state/health";
import { lessonNow, lessonRead } from "@/state/plans";
import { dayLog, gettingReady, jabWeek, sessionsInWeek, stageLabel, useApp, type AppState } from "@/state/store";
import { radius, space, useColors, useLargeText } from "@/theme";

const SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** What a day holds, for its dots and its spoken label: the dinner, and any strength session done that day. Sessions
 *  aren't booked to days, so only done ones show. */
function dayMarks(s: AppState, date: string, i: number) {
  const dinner = thisWeek(s).days[i].dinner.kind, session = !!dayLog(s, date).sessions?.length;
  return { dinner, session };
}

/** Mon to Sun of this week as seven buttons, with a dot for the dinner and one for a session done. */
function DayStrip({ day, onPick }: { day: number; onPick: (i: number) => void }) {
  const s = useApp(), c = useColors(), dates = weekDates(today()), now = weekdayIndex(today());
  const dot = { cook: c.apricot, leftover: c.butter, takeaway: c.line, free: c.line } as const;
  const said = { cook: "dinner to cook", leftover: "leftovers", takeaway: "takeaway night", free: "a free night" } as const;
  return (
    <View style={{ gap: space[2] }}>
      <View accessibilityRole="tablist" style={{ flexDirection: "row", gap: 4 }}>
        {dates.map((date, i) => {
          const on = i === day, m = dayMarks(s, date, i);
          return (
            <Pressable key={date} accessibilityRole="tab" accessibilityState={{ selected: on }}
              accessibilityLabel={`${fmt.long(date)}${i === now ? ", today" : ""}, ${said[m.dinner]}${m.session ? ", strength session done" : ""}`}
              onPress={() => onPick(i)}
              style={{ flex: 1, alignItems: "center", gap: 2, paddingVertical: space[2], borderRadius: 16, backgroundColor: on ? c.ink : "transparent" }}>
              <AppText weight="800" maxFontSizeMultiplier={1.4} style={{ fontSize: 12, color: on ? c.surfaceSunk : c.inkMuted }}>{SHORT[i]}</AppText>
              <AppText weight="800" maxFontSizeMultiplier={1.4} style={{ fontSize: 17, color: on ? c.surface : c.ink }}>{date.slice(8).replace(/^0/, "")}</AppText>
              <View style={{ flexDirection: "row", gap: 3, height: 6 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: dot[m.dinner] }} />
                {m.session ? <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.sageInk }} /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", columnGap: space[3], rowGap: 4 }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {[{ col: c.apricot, label: "Dinner to cook" }, { col: c.sageInk, label: "Strength session" }, { col: c.butter, label: "Leftovers" }].map((k) => (
          <View key={k.label} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: k.col }} />
            <AppText color="inkMuted" style={{ fontSize: 12 }}>{k.label}</AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

const SLOT_WORD = { breakfast: "breakfast", lunch: "lunch", dinner: "dinner", snack: "snack" } as const;

/** The selected day's dinner, big: a cook night with cook-along and the recipe, leftovers, a takeaway or a free night. */
function DinnerCard({ day }: { day: number }) {
  const s = useApp(), c = useColors(), large = useLargeText();
  const week = thisWeek(s), meal = week.days[day].dinner, isToday = day === weekdayIndex(today());
  if (meal.kind === "takeaway") return <TakeawayCard />;
  if (meal.kind === "free" || !meal.recipe) return <FreeNightCard day={day} />;
  const x = px(s, meal.recipe), leftover = meal.kind === "leftover";
  const recipe = () => router.push({ pathname: "/meals/recipe", params: { id: meal.recipe!, which: "this", day: String(day), slot: "dinner", index: "0" } });
  const choose = () => router.push({ pathname: "/meals/pick", params: { which: "this", day: String(day), slot: "dinner", index: "0" } });
  // Where this cook night's extra portions go, if anywhere.
  const later = week.days.flatMap((d) => [d.breakfast, d.lunch, d.dinner, ...d.snacks].map((m) => ({ m, d: d.day })))
    .find(({ m }) => m.kind === "leftover" && m.from === day && m.recipe === meal.recipe);
  const when = later ? (later.d === day + 1 ? "tomorrow's" : `${dayName(later.d)}'s`) : "";
  const label = leftover ? "LEFTOVERS" : isToday ? "TONIGHT'S DINNER" : `${dayName(day).toUpperCase()}'S DINNER`;
  const caption = leftover ? `From ${dayName(meal.from!)}'s ${x.name.toLowerCase()}`
    : `Serves ${s.food.household}${later ? ` · a portion for ${when} ${SLOT_WORD[later.m.slot]}` : ""}`;
  return (
    <Card tone={leftover ? "butter" : "apricot"} style={{ borderRadius: 26, padding: 18, gap: space[3] }}>
      <View style={{ flexDirection: large ? "column" : "row", justifyContent: "space-between", alignItems: large ? "flex-start" : "center", gap: space[2] }}>
        <AppText variant="label" color={leftover ? "onPastel" : "apricotInk"}>{label}</AppText>
        {leftover ? null : (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 4, paddingHorizontal: space[2], borderRadius: radius.full, backgroundColor: c.surfaceRaised }}>
            <Icon name="timer" size={14} color={c.ink} />
            <AppText variant="caption" weight="800">{minutes(x.recipe).replace(", ", " · ")}</AppText>
          </View>
        )}
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
        <View style={{ width: 58, height: 58, borderRadius: radius.md, alignItems: "center", justifyContent: "center", backgroundColor: c.surfaceRaised }}>
          <Icon name="meal" size={28} color={c.apricotInk} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <AppText weight="800" color={x.ok ? "onPastel" : "roseInk"} style={{ fontSize: 19, lineHeight: 24 }}>{x.name}</AppText>
          <AppText variant="caption" color="onPastel">{x.ok ? caption : "Doesn't suit your preferences now."}</AppText>
        </View>
      </View>
      {!x.ok ? <Button label="Choose another" variant="secondary" block onPress={choose} /> : (
        <View style={{ flexDirection: large ? "column" : "row", gap: space[2] }}>
          {leftover ? null : <View style={{ flex: large ? undefined : 1.6 }}><Button label="Cook along" icon="play" variant="ink" block onPress={() => router.push({ pathname: "/meals/cook", params: { id: meal.recipe!, portions: String(meal.cook ?? s.food.household) } })} /></View>}
          <View style={{ flex: large ? undefined : 1 }}><Button label="Recipe" variant="secondary" block onPress={recipe} /></View>
        </View>
      )}
    </Card>
  );
}

/** Strength for the day: the next session, or that the week's are done, or that they're waiting on the GP. */
function StrengthCard({ day }: { day: number }) {
  const s = useApp(), next = nextSession(s), isToday = day === weekdayIndex(today());
  // A new week starts again with A.
  const after = "A" as const;
  const t = sessionsPaused(s) ? { title: "Sessions are waiting for a word with your GP", sub: "Your food plan and habits carry on as normal.", go: () => router.push("/workouts") }
    : next ? { title: `${sessionFor(s, next).name} is up next`, sub: `${sessionFor(s, next).minutes} minutes · ${sessionFor(s, next).moves.length} moves`, go: () => router.push({ pathname: "/workouts/[id]", params: { id: next } }) }
    : { title: isToday ? "No session today" : "All sessions done", sub: `${sessionTarget(s) === 2 ? "Both" : "All"} done this week. ${sessionFor(s, after).name} is next, on Monday.`, go: () => router.push("/workouts") };
  return (
    <RowCard onPress={t.go} accessibilityLabel={`${t.title}. ${t.sub}`}>
      <Disc icon="workout" tone="sage" size={50} />
      <View style={{ flex: 1, gap: 2 }}>
        <AppText weight="800" style={{ fontSize: 16 }}>{t.title}</AppText>
        <AppText variant="caption" color="inkMuted">{t.sub}</AppText>
      </View>
    </RowCard>
  );
}

/** PL1 Your plan: this week day by day (dinner, meals, strength), with shortcuts and the week's lesson. */
export default function Plan() {
  const s = useApp(), c = useColors();
  const [day, setDay] = useState(() => weekdayIndex(today()));
  // For the phase strips: 0 while getting ready (nothing done yet); past 52 in year two (all done).
  const week = gettingReady(s) ? 0 : jabWeek(s), pick = lessonNow(s), lesson = pick.lesson;
  const meals = thisWeek(s), cooks = meals.days.filter((d) => d.dinner.kind === "cook").length;
  const nx = s.food.next, pr = nx ? progress(nx.week) : null;
  const next = nextSession(s), done = sessionsInWeek(s).length, target = sessionTarget(s);
  const strength = sessionsPaused(s) ? { line: "Waiting for a word with your GP", detail: "Your food and habits carry on" }
    : next ? { line: `${sessionFor(s, next).name} next`, detail: `${done} of ${target} done this week · ${sessionFor(s, next).minutes} min` }
    : { line: target === 2 ? "Both sessions done" : `All ${target} sessions done`, detail: "Next ones arrive on Monday" };
  return (
    <Screen contentContainerStyle={{ gap: space[5] }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ gap: 2 }}>
          <AppText variant="caption" color="inkMuted">{stageLabel(s)}</AppText>
          <AppText variant="title" accessibilityRole="header">Your plan</AppText>
        </View>
        <Avatar name={s.name} />
      </View>
      <DayStrip day={day} onPick={setDay} />
      <DinnerCard day={day} />
      <List>
        <MealRow first meal={meals.days[day].breakfast} slot="breakfast" day={day} which="this" />
        <MealRow meal={meals.days[day].lunch} slot="lunch" day={day} which="this" />
        {meals.days[day].snacks.map((m, i) => <MealRow key={i} index={i} meal={m} slot="snack" day={day} which="this" />)}
      </List>
      <StrengthCard day={day} />

      <Pressable accessibilityRole="button" onPress={() => router.push("/week")}>
        <Card tone="apricot" hero style={{ gap: 6 }}>
          <AppText variant="label" color="onPastel">THIS WEEK</AppText>
          <AppText variant="heading" color="onPastel" style={{ fontSize: 22 }}>{lesson.week}</AppText>
          <AppText color="onPastel">{lessonRead(s, pick.key) ? "Lesson read · three habits and two sessions" : "Lesson, three habits and two sessions"}</AppText>
        </Card>
      </Pressable>

      <RowCard tone="sky" onPress={() => router.push("/meals")}>
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="label" color="onPastel">MEALS THIS WEEK</AppText>
          <AppText variant="heading" color="onPastel">{cooks} dinners, leftovers and a takeaway</AppText>
          <AppText variant="caption" color="onPastel">Recipes, swaps and your shopping list</AppText>
        </View>
      </RowCard>
      <RowCard onPress={() => router.push("/meals/next")}>
        <Disc icon="basket" tone="butter" />
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="label" color="inkMuted">NEXT WEEK</AppText>
          <AppText weight="800" style={{ fontSize: 16 }}>{pr ? `${pr.chosen} of ${pr.total} meals picked` : "Pick your meals for next week"}</AppText>
          <AppText variant="caption" color="inkMuted">{pr ? "Your shopping list adds it all up" : "Then get one shopping list for the lot"}</AppText>
        </View>
      </RowCard>

      <RowCard onPress={() => router.push("/workouts")}>
        <Disc icon="workout" tone="sage" />
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="label" color="inkMuted">STRENGTH PLAN</AppText>
          <AppText weight="800" style={{ fontSize: 16 }}>{strength.line}</AppText>
          <AppText variant="caption" color="inkMuted">{strength.detail}</AppText>
        </View>
      </RowCard>

      {PHASES.map((p) => {
        const weeks = Array.from({ length: p.to - p.from + 1 }, (_, i) => p.from + i);
        return (
          <Card key={p.key} style={{ gap: 12 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c[`${p.tone}Ink` as const] }} />
                <AppText variant="heading">{p.name}</AppText>
              </View>
              <AppText variant="caption" color="inkMuted">Weeks {p.from}–{p.to}</AppText>
            </View>
            <AppText color="inkMuted">{p.focus}</AppText>
            {/* One summary for VoiceOver rather than a stop per week. */}
            <View accessible accessibilityLabel={week < p.from ? `${p.name}: ${weeks.length} weeks, coming up` : week > p.to ? `${p.name}: all ${weeks.length} weeks done` : `${p.name}: week ${week - p.from + 1} of ${weeks.length}, ${week - p.from} done`}
              style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {weeks.map((w) => (
                <View key={w}
                  style={{ width: 26, height: 26, borderRadius: radius.full, backgroundColor: w < week ? c.sageInk : w === week ? c.apricot : c.surfaceSunk, borderWidth: w === week ? 2 : w > week ? 1.5 : 0, borderColor: w === week ? c.apricotInk : c.line }} />
              ))}
            </View>
          </Card>
        );
      })}
    </Screen>
  );
}
