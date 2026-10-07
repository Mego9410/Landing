import { router } from "expo-router";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { Header, List, Pill, Row, Section } from "@/components/ui";
import { addDays, fmt, yesterday } from "@/data/dates";
import { MIN_DAYS } from "@/data/journal";
import { clear, describe, figures, insights, loggedOf, METRIC_LABEL, type Insight } from "@/state/journal";
import { useApp } from "@/state/store";
import { radius, space, useColors } from "@/theme";

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** The last two weeks as dots: filled for a day with a journal entry. Not a streak; a gap is just a gap. */
function Fortnight() {
  const s = useApp(), c = useColors();
  const days = Array.from({ length: 14 }, (_, i) => addDays(yesterday(), -(13 - i)));
  return (
    <View accessible accessibilityLabel={`Logged ${loggedOf(s, 14)} of the last 14 days`} style={{ flexDirection: "row", justifyContent: "space-between" }}>
      {days.map((d) => (
        <View key={d} style={{ alignItems: "center", gap: 4 }}>
          <View style={{ width: 14, height: 14, borderRadius: radius.full, backgroundColor: s.journal.entries[d] ? c.sageInk : c.surfaceSunk }} />
          <AppText variant="caption" color="inkMuted" style={{ fontSize: 10, lineHeight: 12 }}>{fmt.short(d).charAt(0)}</AppText>
        </View>
      ))}
    </View>
  );
}

/** A pattern: the clear differences each get a row; anything without one is folded into a single line. */
function InsightCard({ i }: { i: Insight }) {
  const shown = i.effects.filter(clear), quiet = i.effects.filter((e) => !clear(e)).map((e) => METRIC_LABEL[e.metric].toLowerCase());
  return (
    <Card style={{ gap: space[3] }}>
      <View style={{ gap: 2 }}>
        <AppText variant="label" color="inkMuted">DAYS WITH {i.q.short.toUpperCase()}</AppText>
        <AppText variant="heading">{i.lead ? describe(i.lead) : "No clear difference yet"}</AppText>
        <AppText variant="caption" color="inkMuted">{i.nYes} days with, {i.nNo} without</AppText>
      </View>
      <View style={{ gap: space[2] }}>
        {shown.map((e) => (
          <View key={e.metric} style={{ flexDirection: "row", alignItems: "center", gap: space[3] }}>
            <View style={{ flex: 1, gap: 2 }}>
              <AppText weight="700">{METRIC_LABEL[e.metric]}</AppText>
              <AppText variant="caption" color="inkMuted">{figures(e)}</AppText>
            </View>
            <Pill label={describe(e, true)} tone="sky" />
          </View>
        ))}
        {quiet.length ? <AppText variant="caption" color="inkMuted">No clear difference in {quiet.join(" or ")}.</AppText> : null}
      </View>
    </Card>
  );
}

/** What shapes your days: the journal's yes/no answers set against hunger, energy and the next morning's weigh-in. */
export default function JournalInsights() {
  const s = useApp();
  const { ready, learning } = insights(s);
  return (
    <Screen header={<Header fallback="/progress" title="What shapes your days" />} contentContainerStyle={{ gap: space[5], paddingBottom: 48 }}>
      <View style={{ gap: space[2] }}>
        <AppText variant="title" accessibilityRole="header">What shapes your days</AppText>
        <AppText color="inkMuted">From your morning check-ins. These are patterns, not causes, and they get clearer the more days you log.</AppText>
      </View>
      <Card style={{ gap: space[3] }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
          <AppText weight="800">Last two weeks</AppText>
          <AppText variant="caption" color="inkMuted">{loggedOf(s, 30)} of the last 30 days logged</AppText>
        </View>
        <Fortnight />
      </Card>
      {!s.journal.entries[yesterday()] ? <Button label="Log yesterday" block onPress={() => router.push("/journal")} /> : null}
      {ready.length ? (
        <View style={{ gap: space[3] }}>{ready.map((i) => <InsightCard key={i.q.id} i={i} />)}</View>
      ) : (
        <Card tone="sunk" style={{ gap: 6 }}>
          <AppText weight="800">Your first patterns are on their way</AppText>
          <AppText color="inkMuted">Each question needs {MIN_DAYS} days with a yes and {MIN_DAYS} with a no before there&apos;s anything fair to say.</AppText>
        </Card>
      )}
      {learning.length ? (
        <Section title="STILL LEARNING">
          <List>
            {learning.map((i, k) => (
              <Row key={i.q.id} first={k === 0} title={cap(i.q.short)}
                sub={[i.nYes < MIN_DAYS ? `${MIN_DAYS - i.nYes} more ${MIN_DAYS - i.nYes === 1 ? "day" : "days"} with` : "", i.nNo < MIN_DAYS ? `${MIN_DAYS - i.nNo} more without` : ""].filter(Boolean).join(", ") || "Needs a few more days"} />
            ))}
          </List>
        </Section>
      ) : null}
      {s.settings.safeMode ? null : (
        <AppText variant="caption" color="inkMuted">Next-morning weight is the change from one morning&apos;s weigh-in to the next. Overnight changes are mostly water and salt, and settle within a day or two.</AppText>
      )}
      <Button label="Choose your questions" variant="secondary" block onPress={() => router.push("/journal/questions")} />
    </Screen>
  );
}
