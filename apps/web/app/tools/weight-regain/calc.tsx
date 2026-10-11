"use client";
import { useState } from "react";
import styles from "../tools.module.css";

// The trial averages, applied to someone's own numbers (the same figures the guides cite):
// - STEP 1 extension (semaglutide): about two-thirds of the weight lost came back within a year of stopping.
// - SURMOUNT-4 (tirzepatide): people switched to placebo regained about 14% of their body weight over a year.
// - BMJ review of 37 studies (all weight-loss medicines): about 0.4 kg a month on average after stopping.
// Never a prediction: the page says so, and shows the hopeful end too.
type Medicine = "semaglutide" | "tirzepatide";
type Units = "kg" | "st";
const num = (s: string) => (s.trim() === "" ? NaN : Number(s));
const oneDp = (n: number) => Math.round(n * 10) / 10;

export function RegainCalc() {
  const [medicine, setMedicine] = useState<Medicine>("tirzepatide");
  const [units, setUnits] = useState<Units>("kg");
  const [lost, setLost] = useState(""), [lostSt, setLostSt] = useState(""), [lostLb, setLostLb] = useState("");
  const [now, setNow] = useState(""), [nowSt, setNowSt] = useState(""), [nowLb, setNowLb] = useState("");
  const [shown, setShown] = useState(false);

  const toKg = (st: string, lb: string) => ((num(st) || 0) * 14 + (num(lb) || 0)) * 0.453592;
  const lostKg = units === "kg" ? num(lost) : toKg(lostSt, lostLb);
  const nowKg = units === "kg" ? num(now) : toKg(nowSt, nowLb);
  const problem =
    !Number.isFinite(lostKg) || lostKg <= 0 ? "Add how much weight you lost on the medicine." : lostKg > 150 ? "Check how much you lost." :
    !Number.isFinite(nowKg) || nowKg <= 0 ? "Add your weight now." : nowKg < 35 || nowKg > 300 ? "Check your weight now." : null;

  const fmt = (kg: number) => units === "kg" ? `${oneDp(kg).toLocaleString("en-GB")} kg` : (() => { const lb = Math.round(kg / 0.453592); return `${Math.floor(lb / 14)} st ${lb % 14} lb`; })();
  const trial = medicine === "semaglutide" ? Math.min(lostKg, lostKg * (2 / 3)) : Math.min(lostKg, nowKg * 0.14);
  const review = Math.min(lostKg, 0.4 * 12);
  const quarter = lostKg / 4;
  const pct = (kg: number) => `${Math.max(4, Math.min(100, (kg / lostKg) * 100))}%`;

  const kgOrSt = (kgVal: string, setKg: (v: string) => void, stVal: string, setStv: (v: string) => void, lbVal: string, setLb: (v: string) => void, id: string, label: string, ph: [string, string, string]) => (
    <label className={styles.field}>
      <span>{label}</span>
      {units === "kg"
        ? <span className={styles.pair}><input id={`${id}-kg`} inputMode="decimal" value={kgVal} onChange={(e) => setKg(e.target.value)} placeholder={ph[0]} /><small>kg</small></span>
        : <span className={styles.pair}><input id={`${id}-st`} inputMode="numeric" value={stVal} onChange={(e) => setStv(e.target.value)} placeholder={ph[1]} aria-label={`${label}, stones`} /><small>st</small><input id={`${id}-lb`} inputMode="decimal" value={lbVal} onChange={(e) => setLb(e.target.value)} placeholder={ph[2]} aria-label={`${label}, pounds`} /><small>lb</small></span>}
    </label>
  );

  return (
    <form className={styles.form} onSubmit={(e) => { e.preventDefault(); setShown(true); }} noValidate>
      <fieldset className={styles.choices}>
        <legend>Which medicine?</legend>
        <label className={styles.choice} data-on={medicine === "tirzepatide" || undefined}>
          <input type="radio" name="medicine" checked={medicine === "tirzepatide"} onChange={() => setMedicine("tirzepatide")} />
          <strong>Tirzepatide</strong><span>Mounjaro</span>
        </label>
        <label className={styles.choice} data-on={medicine === "semaglutide" || undefined}>
          <input type="radio" name="medicine" checked={medicine === "semaglutide"} onChange={() => setMedicine("semaglutide")} />
          <strong>Semaglutide</strong><span>Wegovy or Ozempic</span>
        </label>
      </fieldset>
      <fieldset className={styles.seg}>
        <legend>Units</legend>
        <label><input type="radio" name="units" checked={units === "kg"} onChange={() => setUnits("kg")} /> kg</label>
        <label><input type="radio" name="units" checked={units === "st"} onChange={() => setUnits("st")} /> stones and pounds</label>
      </fieldset>
      <div className={styles.row}>
        {kgOrSt(lost, setLost, lostSt, setLostSt, lostLb, setLostLb, "lost", "Weight lost on it", ["15", "2", "5"])}
        {kgOrSt(now, setNow, nowSt, setNowSt, nowLb, setNowLb, "now", "Weight now", ["82", "12", "13"])}
      </div>
      <button className={styles.button}>Show me</button>
      <div aria-live="polite">
        {shown && problem ? <p className={styles.error}>{problem}</p> : null}
        {shown && !problem ? (
          <div className={styles.result}>
            <p className={styles.resultLabel}>What the research found, at your numbers, a year after stopping</p>
            <div className={styles.bars}>
              <div className={styles.bar}>
                <span>{medicine === "semaglutide" ? "STEP 1 trial average" : "SURMOUNT-4 trial average"}: about {fmt(trial)} back</span>
                <div className={styles.barTrack}><div className={styles.barFill} style={{ width: pct(trial) }} /></div>
              </div>
              <div className={styles.bar}>
                <span>Average across 37 studies: about {fmt(review)} back</span>
                <div className={styles.barTrack}><div className={styles.barFill} style={{ width: pct(review) }} /></div>
              </div>
              {medicine === "tirzepatide" ? (
                <div className={styles.bar}>
                  <span>About 1 in 6 people in SURMOUNT-4 regained less than {fmt(quarter)} (a quarter of what you lost)</span>
                  <div className={styles.barTrack}><div className={styles.barFill} data-tone="sage" style={{ width: "25%" }} /></div>
                </div>
              ) : null}
            </div>
            <p>The bars are out of the {fmt(lostKg)} you lost. These are <strong>averages from research, not a prediction for you</strong>: people vary a lot. Some people keep most of it off.</p>
            <p>What tends to help: protein at every meal, two short strength sessions a week, regular meals, plenty of walking, and a calm weekly check on your weight trend.</p>
          </div>
        ) : null}
      </div>
    </form>
  );
}
