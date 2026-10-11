"use client";
import { useState } from "react";
import styles from "../tools.module.css";

// Mifflin-St Jeor resting energy (Mifflin et al., 1990) × a standard activity factor, shown as a ±10% range because
// any equation can be that far out for one person. Maintenance only: it never suggests a deficit.
const ACTIVITY = [
  { id: "low", label: "Mostly sitting", sub: "Desk job, little walking", f: 1.2 },
  { id: "light", label: "Lightly active", sub: "Some walking most days", f: 1.375 },
  { id: "moderate", label: "Active", sub: "On your feet a lot, or exercise 3–5 days", f: 1.55 },
  { id: "high", label: "Very active", sub: "Physical job, or hard exercise most days", f: 1.725 },
] as const;
type Units = "metric" | "imperial";
const round10 = (n: number) => Math.round(n / 10) * 10;
const num = (s: string) => (s.trim() === "" ? NaN : Number(s));

export function MaintenanceCalc() {
  const [units, setUnits] = useState<Units>("metric");
  const [sex, setSex] = useState<"female" | "male">("female");
  const [age, setAge] = useState("");
  const [cm, setCm] = useState(""), [ft, setFt] = useState(""), [inch, setInch] = useState("");
  const [kg, setKg] = useState(""), [st, setSt] = useState(""), [lb, setLb] = useState("");
  const [activity, setActivity] = useState<(typeof ACTIVITY)[number]["id"]>("light");
  const [shown, setShown] = useState(false);

  const heightCm = units === "metric" ? num(cm) : (num(ft) * 12 + (num(inch) || 0)) * 2.54;
  const weightKg = units === "metric" ? num(kg) : (num(st) * 14 + (num(lb) || 0)) * 0.453592;
  const years = num(age);
  const problem =
    !Number.isFinite(years) ? "Add your age." : years < 18 ? "This calculator is for adults aged 18 and over." : years > 100 ? "Check your age." :
    !Number.isFinite(heightCm) ? "Add your height." : heightCm < 120 || heightCm > 230 ? "Check your height." :
    !Number.isFinite(weightKg) ? "Add your weight." : weightKg < 35 || weightKg > 300 ? "Check your weight." : null;

  const rest = 10 * weightKg + 6.25 * heightCm - 5 * years + (sex === "male" ? 5 : -161);
  const f = ACTIVITY.find((a) => a.id === activity)!.f;
  const mid = round10(rest * f), lo = round10(rest * f * 0.9), hi = round10(rest * f * 1.1);
  const bmi = weightKg / (heightCm / 100) ** 2;

  return (
    <form className={styles.form} onSubmit={(e) => { e.preventDefault(); setShown(true); }} noValidate>
      <fieldset className={styles.seg}>
        <legend>Units</legend>
        <label><input type="radio" name="units" checked={units === "metric"} onChange={() => setUnits("metric")} /> kg and cm</label>
        <label><input type="radio" name="units" checked={units === "imperial"} onChange={() => setUnits("imperial")} /> stones and feet</label>
      </fieldset>
      <fieldset className={styles.seg}>
        <legend>Sex (the equation uses it)</legend>
        <label><input type="radio" name="sex" checked={sex === "female"} onChange={() => setSex("female")} /> Female</label>
        <label><input type="radio" name="sex" checked={sex === "male"} onChange={() => setSex("male")} /> Male</label>
      </fieldset>
      <div className={styles.row}>
        <label className={styles.field}><span>Age</span><input id="mc-age" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} placeholder="52" /><small>years</small></label>
        {units === "metric" ? (
          <>
            <label className={styles.field}><span>Height</span><input id="mc-cm" inputMode="decimal" value={cm} onChange={(e) => setCm(e.target.value)} placeholder="165" /><small>cm</small></label>
            <label className={styles.field}><span>Weight now</span><input id="mc-kg" inputMode="decimal" value={kg} onChange={(e) => setKg(e.target.value)} placeholder="78" /><small>kg</small></label>
          </>
        ) : (
          <>
            <label className={styles.field}><span>Height</span><span className={styles.pair}><input id="mc-ft" inputMode="numeric" value={ft} onChange={(e) => setFt(e.target.value)} placeholder="5" aria-label="Feet" /><small>ft</small><input id="mc-in" inputMode="numeric" value={inch} onChange={(e) => setInch(e.target.value)} placeholder="5" aria-label="Inches" /><small>in</small></span></label>
            <label className={styles.field}><span>Weight now</span><span className={styles.pair}><input id="mc-st" inputMode="numeric" value={st} onChange={(e) => setSt(e.target.value)} placeholder="12" aria-label="Stones" /><small>st</small><input id="mc-lb" inputMode="decimal" value={lb} onChange={(e) => setLb(e.target.value)} placeholder="4" aria-label="Pounds" /><small>lb</small></span></label>
          </>
        )}
      </div>
      <fieldset className={styles.choices}>
        <legend>How active is a normal week?</legend>
        {ACTIVITY.map((a) => (
          <label key={a.id} className={styles.choice} data-on={activity === a.id || undefined}>
            <input type="radio" name="activity" checked={activity === a.id} onChange={() => setActivity(a.id)} />
            <strong>{a.label}</strong><span>{a.sub}</span>
          </label>
        ))}
      </fieldset>
      <button className={styles.button}>Work it out</button>
      <div aria-live="polite">
        {shown && problem ? <p className={styles.error}>{problem}</p> : null}
        {shown && !problem ? (
          <div className={styles.result}>
            <p className={styles.resultLabel}>To keep your weight about where it is now</p>
            <p className={styles.big}>{mid.toLocaleString("en-GB")} <span>calories a day</span></p>
            <p>Somewhere between <strong>{lo.toLocaleString("en-GB")}</strong> and <strong>{hi.toLocaleString("en-GB")}</strong> is likely. Your body at rest uses about {round10(rest).toLocaleString("en-GB")}; the rest is daily movement.</p>
            <p>Try building meals around <strong>25 to 30 g of protein each</strong>: it keeps you fuller and helps protect muscle.</p>
            {bmi < 18.5 ? (
              <p className={styles.care}>Your numbers suggest a weight below the healthy range. Please talk to your GP before aiming to hold this weight. If eating feels hard or out of control, Beat&apos;s helpline is there for you: beateatingdisorders.org.uk.</p>
            ) : null}
          </div>
        ) : null}
      </div>
    </form>
  );
}
