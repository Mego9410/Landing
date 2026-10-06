import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { YesNo } from "@/components/Journal";
import { Step } from "@/components/Onboarding";
import { Screen } from "@/components/Screen";
import { Choices, Field, Header, List, Tick } from "@/components/ui";
import { HEALTH_QUESTIONS, HEALTH_VERSION, NOTES, REFER } from "@/data/health";
import { kgFromStLb } from "@/data/units";
import { today } from "@/data/dates";
import { applyHealth } from "@/state/health";
import { set, useApp, type Units } from "@/state/store";
import { toast } from "@/state/toast";
import { space, useColors } from "@/theme";

/** O2 A quick health check (movement plan §4.2), with consent to keep health information on the phone and, if they
 *  like, a starting weight. Also the 12-weekly re-check from Today or Settings (`?recheck=1`). */
export default function HealthCheck() {
  const s = useApp(), c = useColors();
  const recheck = useLocalSearchParams<{ recheck?: string }>().recheck === "1";
  const [answers, setAnswers] = useState<Record<string, boolean | undefined>>(() => (recheck ? { ...s.health.answers } : {}));
  const [gpChecked, setGpChecked] = useState(s.health.gpCleared);
  const [referAgreed, setReferAgreed] = useState(!!s.health.referAgreed && s.health.referAgreed.version >= HEALTH_VERSION);
  const [consent, setConsent] = useState(!!s.consent);
  const [units, setUnits] = useState<Units>(s.settings.units);
  const [kg, setKg] = useState(""), [st, setSt] = useState(""), [lb, setLb] = useState("");
  const [lowest, setLowest] = useState(""), [lowSt, setLowSt] = useState(""), [lowLb, setLowLb] = useState("");
  const [error, setError] = useState("");

  const unanswered = HEALTH_QUESTIONS.filter((q) => answers[q.id] == null).length;
  const gp = HEALTH_QUESTIONS.some((q) => q.kind === "gp" && answers[q.id]);
  const refer = (["pregnant", "kidney"] as const).filter((id) => answers[id]);
  const notes = HEALTH_QUESTIONS.filter((q) => q.kind === "gentle" && answers[q.id]).map((q) => NOTES[q.id]).filter(Boolean);
  const safe = s.settings.safeMode || !!answers.pregnant;

  function parseWeight(): { now: number | null; low: number | null } | string {
    const read = (v: string) => (v.trim() === "" ? null : parseFloat(v.replace(",", ".")));
    let now: number | null = null;
    if (units === "kg") now = read(kg);
    else if (st.trim() !== "" || lb.trim() !== "") now = kgFromStLb(read(st) ?? 0, read(lb) ?? 0);
    let lowKg: number | null = null;
    if (units === "kg") lowKg = read(lowest);
    else if (lowSt.trim() !== "" || lowLb.trim() !== "") lowKg = kgFromStLb(read(lowSt) ?? 0, read(lowLb) ?? 0);
    if (now != null && !(now >= 30 && now <= 300)) return "That weight doesn't look right. Check the number, or leave it blank.";
    if (lowKg != null && !(lowKg >= 30 && lowKg <= 300)) return "That lowest weight doesn't look right. Check the number, or leave it blank.";
    return { now: now == null ? null : Math.round(now * 10) / 10, low: lowKg == null ? null : Math.round(lowKg * 10) / 10 };
  }

  function save() {
    if (unanswered) { setError(`Answer each question with yes or no. ${unanswered} to go.`); return; }
    if (refer.length && !referAgreed) { setError("Tick the box under the note to carry on, or close the app and come back after you've checked."); return; }
    if (!consent) { setError("Tick the box to agree to Landing keeping your health information on this phone."); return; }
    const w = safe || recheck ? { now: null, low: null } : parseWeight();
    if (typeof w === "string") { setError(w); return; }
    set((st2) => {
      applyHealth(st2, answers as Record<string, boolean>);
      if (gp) st2.health.gpCleared = gpChecked;
      if (refer.length) st2.health.referAgreed = { at: new Date().toISOString(), version: HEALTH_VERSION };
      if (!st2.consent) st2.consent = { healthDataAt: new Date().toISOString() };
      st2.settings.units = units;
      if (w.now != null) { const t = today(); st2.weights = [{ date: t, kg: w.now, source: "Logged by you" }, ...st2.weights.filter((x) => x.date !== t)]; }
      if (w.low != null) st2.ob.lowestWeight = w.low;
    });
    if (recheck) { toast("Thanks. Your plan is up to date."); router.back(); }
    else router.push("/onboarding/food");
  }

  const body = (
    <>
      <List>
        {HEALTH_QUESTIONS.map((q, i) => (
          <View key={q.id} style={i ? { borderTopWidth: 1, borderTopColor: c.line } : undefined}>
            <YesNo ask={q.ask} detail={q.detail} value={answers[q.id]} onChange={(v) => { setError(""); setAnswers((a) => ({ ...a, [q.id]: v })); }} />
          </View>
        ))}
      </List>

      {gp ? (
        <Card tone="butter" style={{ gap: space[3] }}>
          <AppText weight="800" color="onPastel">Check with your GP before strength sessions</AppText>
          <AppText color="onPastel">Your food plan and habits start straight away. Strength sessions will wait until you tell us you&apos;ve checked, from the Workouts screen or here.</AppText>
          <Tick label="I've already checked with my GP and they're happy for me to do strength exercise" checked={gpChecked} onChange={setGpChecked} />
        </Card>
      ) : null}

      {refer.map((id) => (
        <Card key={id} tone="sky" style={{ gap: space[2] }}>
          <AppText weight="800" color="onPastel">Talk to your {REFER[id].who} first</AppText>
          <AppText color="onPastel">{REFER[id].note}</AppText>
        </Card>
      ))}
      {refer.length ? (
        <Tick label={`I've read this. I'll check with my ${refer.map((id) => REFER[id].who).join(" and ")}, and I agree to the terms of use and health information.`} checked={referAgreed} onChange={(v) => { setError(""); setReferAgreed(v); }} />
      ) : null}

      {notes.length ? (
        <Card tone="sunk" style={{ gap: space[2] }}>
          <AppText weight="800">We&apos;ll adjust your sessions</AppText>
          {notes.map((n) => <AppText key={n} color="inkMuted">{n}</AppText>)}
        </Card>
      ) : null}

      {!safe && !recheck ? (
        <Card style={{ gap: space[3] }}>
          <AppText weight="800">Your weight (optional)</AppText>
          <AppText variant="caption" color="inkMuted">It starts your trend and your steady zone. You can skip this, or switch on safe mode later to hide weight altogether.</AppText>
          <Choices label="Units" value={units} onChange={(v) => setUnits(v as Units)} options={[{ id: "kg", label: "Kilograms" }, { id: "stlb", label: "Stones and pounds" }]} />
          {units === "kg" ? (
            <Field label="Today" value={kg} onChangeText={setKg} keyboardType="decimal-pad" placeholder="78.4" suffix="kg" />
          ) : (
            <View style={{ flexDirection: "row", gap: space[3] }}>
              <Field label="Today" value={st} onChangeText={setSt} keyboardType="number-pad" placeholder="12" suffix="st" />
              <Field label=" " accessibilityLabel="Pounds" value={lb} onChangeText={setLb} keyboardType="number-pad" placeholder="5" suffix="lb" />
            </View>
          )}
          {units === "kg" ? (
            <Field label="Your lowest weight on the jab" value={lowest} onChangeText={setLowest} keyboardType="decimal-pad" placeholder="76.0" suffix="kg" />
          ) : (
            <View style={{ flexDirection: "row", gap: space[3] }}>
              <Field label="Your lowest weight on the jab" value={lowSt} onChangeText={setLowSt} keyboardType="number-pad" placeholder="12" suffix="st" />
              <Field label=" " accessibilityLabel="Pounds, lowest weight" value={lowLb} onChangeText={setLowLb} keyboardType="number-pad" placeholder="0" suffix="lb" />
            </View>
          )}
          <AppText variant="caption" color="inkMuted">Your steady zone starts from your lowest weight. If you leave it blank, we&apos;ll use today&apos;s.</AppText>
        </Card>
      ) : null}

      {!s.consent ? (
        <View style={{ gap: space[2] }}>
          <Tick label="I agree to Landing keeping my health information, like my answers, weight and check-ins, on this phone to build my plan" checked={consent} onChange={(v) => { setError(""); setConsent(v); }} />
          <Button label="Read the privacy policy" variant="quiet" onPress={() => router.push({ pathname: "/legal/[doc]", params: { doc: "privacy" } })} style={{ alignSelf: "flex-start", marginLeft: -space[6] }} />
        </View>
      ) : null}
      {error ? <AppText variant="caption" color="roseInk">{error}</AppText> : null}
    </>
  );

  if (recheck) {
    return (
      <Screen contentContainerStyle={{ gap: space[5], paddingBottom: 48 }}>
        <Header close fallback="/settings" />
        <View style={{ gap: space[2] }}>
          <AppText variant="title" accessibilityRole="header">A quick health check</AppText>
          <AppText color="inkMuted">Every 12 weeks we check nothing has changed, so your plan still fits. Your answers stay on this phone.</AppText>
        </View>
        {body}
        <Button label="Save" block onPress={save} />
      </Screen>
    );
  }
  return (
    <Step n={2} title="A quick health check" lede="So your plan fits you. Your answers stay on this phone and nobody else sees them." next={save}>
      {body}
    </Step>
  );
}
