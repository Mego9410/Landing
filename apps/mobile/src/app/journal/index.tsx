import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Scale, YesNo } from "@/components/Journal";
import { Screen } from "@/components/Screen";
import { Choices, Header, List } from "@/components/ui";
import { addDays, fmt, yesterday } from "@/data/dates";
import { questionById, SCALES } from "@/data/journal";
import { stepsOn } from "@/state/appleHealth";
import { saveEntry } from "@/state/journal";
import { useApp, type JournalEntry } from "@/state/store";
import { toast } from "@/state/toast";
import { space, useColors } from "@/theme";

// Yesterday, or either of the two days before, for a missed morning.
const choosable = () => [0, 1, 2].map((n) => addDays(yesterday(), -n));
const dayLabel = (d: string) => (d === yesterday() ? "Yesterday" : fmt.short(d));

function Questions({ day }: { day: string }) {
  const s = useApp(), c = useColors();
  const saved = s.journal.entries[day];
  const [entry, setEntry] = useState<JournalEntry>(() => saved ? JSON.parse(JSON.stringify(saved)) : { yes: {} });
  const [error, setError] = useState("");
  const [steps, setSteps] = useState<number | null>(null);
  // With Apple Health connected, the steps question answers itself (it can still be changed).
  useEffect(() => {
    let live = true;
    stepsOn(day).then((n) => {
      if (!live || n == null) return;
      setSteps(n);
      setEntry((e) => (e.yes.steps == null ? { ...e, yes: { ...e.yes, steps: n >= 7000 } } : e));
    }).catch(() => {});
    return () => { live = false; };
  }, [day]);
  const qs = s.journal.questions.map(questionById).filter((q) => !!q);
  const answered = qs.filter((q) => entry.yes[q.id] != null).length + SCALES.filter((q) => entry[q.id] != null).length;

  function save() {
    if (!answered) { setError("Answer at least one question, or close this and come back later."); return; }
    // Keep only the questions asked now, so a question turned off doesn't carry an old answer.
    const yes = Object.fromEntries(qs.filter((q) => entry.yes[q.id] != null).map((q) => [q.id, entry.yes[q.id]]));
    saveEntry(day, { yes, fullness: entry.fullness, energy: entry.energy });
    toast(saved ? "Updated." : "Saved. Thanks for checking in.");
    router.back();
  }

  return (
    <>
      <List>
        {qs.map((q, i) => (
          <View key={q.id} style={i ? { borderTopWidth: 1, borderTopColor: c.line } : undefined}>
            <YesNo ask={q.ask} detail={q.id === "steps" && steps != null ? `Apple Health: ${steps.toLocaleString("en-GB")} steps` : q.detail} value={entry.yes[q.id]}
              onChange={(v) => { setError(""); setEntry((e) => { const yes = { ...e.yes }; if (v == null) delete yes[q.id]; else yes[q.id] = v; return { ...e, yes }; }); }} />
          </View>
        ))}
      </List>
      <Card style={{ gap: space[5] }}>
        {SCALES.map((q) => (
          <Scale key={q.id} ask={q.ask} low={q.low} high={q.high} value={entry[q.id]} onChange={(v) => { setError(""); setEntry((e) => ({ ...e, [q.id]: v })); }} />
        ))}
      </Card>
      <View style={{ gap: space[2] }}>
        {error ? <AppText variant="caption" color="roseInk">{error}</AppText> : null}
        <Button label={saved ? "Save changes" : "Save"} block onPress={save} />
        <Button label="Choose your questions" variant="quiet" onPress={() => router.push("/journal/questions")} style={{ alignSelf: "center" }} />
      </View>
    </>
  );
}

/** Your day: a minute each morning on how yesterday went. */
export default function Journal() {
  const params = useLocalSearchParams<{ day?: string }>();
  const DAYS = choosable();
  const [day, setDay] = useState(params.day && DAYS.includes(params.day) ? params.day : yesterday());
  return (
    <Screen contentContainerStyle={{ gap: space[5], paddingBottom: 48 }}>
      <Header close fallback="/" />
      <View style={{ gap: space[2] }}>
        <AppText variant="title" accessibilityRole="header">How was {day === yesterday() ? "yesterday" : fmt.long(day)}?</AppText>
        <AppText color="inkMuted">About a minute. Over a few weeks it shows what goes with your fuller, steadier days.</AppText>
      </View>
      <Choices label="Day" value={day} onChange={(v) => setDay(v as string)} options={DAYS.map((d) => ({ id: d, label: dayLabel(d) }))} />
      <Questions key={day} day={day} />
    </Screen>
  );
}
