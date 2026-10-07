import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { Header, Section, ToggleRow } from "@/components/ui";
import { GROUPS, SCALES, YES_NO } from "@/data/journal";
import { setQuestions } from "@/state/journal";
import { useApp } from "@/state/store";
import { toast } from "@/state/toast";
import { space } from "@/theme";

/** Choose the journal's yes/no questions. The two scales are always asked, as they're what the answers are compared with. */
export default function JournalQuestions() {
  const s = useApp();
  const on = s.journal.questions;
  function toggle(id: string, v: boolean) {
    if (!v && on.length === 1) { toast("Keep at least one question."); return; }
    // Keep the order of the list, whatever order they're switched on in.
    setQuestions(YES_NO.map((q) => q.id).filter((x) => (x === id ? v : on.includes(x))));
  }
  return (
    <Screen header={<Header fallback="/journal/insights" title="Your questions" />} contentContainerStyle={{ gap: space[6], paddingBottom: 48 }}>
      <View style={{ gap: space[2] }}>
        <AppText variant="title" accessibilityRole="header">Your questions</AppText>
        <AppText color="inkMuted">Pick the things you&apos;d like to understand. Fewer questions keep it quick; around six works well.</AppText>
      </View>
      {GROUPS.map((g) => (
        <Section key={g} title={g.toUpperCase()}>
          <Card style={{ gap: space[4] }}>
            {YES_NO.filter((q) => q.group === g).map((q) => (
              <ToggleRow key={q.id} title={q.ask} sub={q.detail} value={on.includes(q.id)} onChange={(v) => toggle(q.id, v)} />
            ))}
          </Card>
        </Section>
      ))}
      <Section title="ALWAYS ASKED">
        <Card tone="sunk" style={{ gap: space[2] }}>
          {SCALES.map((q) => <AppText key={q.id} weight="700">{q.ask}</AppText>)}
          <AppText variant="caption" color="inkMuted">{s.settings.safeMode ? "Hunger and energy are" : "Hunger, energy and your next-morning weigh-in are"} what each answer is compared with.</AppText>
        </Card>
      </Section>
    </Screen>
  );
}
