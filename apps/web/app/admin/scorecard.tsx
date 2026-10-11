"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Change, Kpi, KpiKey, Week } from "@/lib/growth";
import styles from "./admin.module.css";

const post = (body: object) => fetch("/api/admin/scorecard", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), credentials: "include" });
async function send(body: object): Promise<string | null> {
  const r = await post(body).catch(() => null);
  if (!r) return "Couldn't reach the site. Check your connection and try again.";
  if (r.ok) return null;
  return ((await r.json().catch(() => null)) as { error?: string } | null)?.error ?? "Couldn't save that. Try again.";
}
const asText = (v: number | null | undefined) => (v == null ? "" : String(v));

/**
 * The Monday review form: one row for a week. It opens on last week, with downloads, payers and net MRR filled in
 * from App Store Connect and RevenueCat where they're set up; picking a week that's already saved loads that row.
 */
export function WeekForm({ kpis, weeks, start, suggested }: { kpis: Kpi[]; weeks: Week[]; start: string; suggested: Partial<Record<KpiKey, number>> }) {
  const router = useRouter();
  const valuesFor = (d: string): Record<string, string> => {
    const saved = weeks.find((w) => w.week_start === d);
    return Object.fromEntries(kpis.map((k) => [k.key, saved ? asText(saved[k.key]) : d === start ? asText(suggested[k.key]) : ""]));
  };
  const [week, setWeek] = useState(start);
  const [vals, setVals] = useState(() => valuesFor(start));
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const exists = weeks.some((w) => w.week_start === week);

  async function save(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(null);
    const error = await send({ kind: "week", week_start: week, ...vals });
    setBusy(false);
    if (error) { setMsg({ ok: false, text: error }); return; }
    setMsg({ ok: true, text: exists ? "Week updated." : "Week saved." });
    router.refresh();
  }

  return (
    <form className={styles.form} onSubmit={save}>
      <label className={styles.field}>
        <span>Week starting (Monday)</span>
        <input id="sc-week" className={styles.input} type="date" value={week} required onChange={(e) => { setWeek(e.target.value); setVals(valuesFor(e.target.value)); setMsg(null); }} />
      </label>
      <div className={styles.fields}>
        {kpis.map((k) => (
          <label key={k.key} className={styles.field}>
            <span>{k.label}{k.kind === "pct" ? " (%)" : k.kind === "gbp" ? " (£)" : ""}</span>
            <input id={`sc-${k.key}`} className={styles.input} inputMode="decimal" value={vals[k.key]} onChange={(e) => setVals({ ...vals, [k.key]: e.target.value })} />
            <small>{k.source}{suggested[k.key] != null && week === start && !exists ? " · filled in for you" : ""}</small>
          </label>
        ))}
      </div>
      <div className={styles.formEnd}>
        <button className={styles.button} disabled={busy}>{busy ? "Saving…" : exists ? "Update week" : "Save week"}</button>
        {msg ? <span role="status" className={msg.ok ? styles.ok : styles.error}>{msg.text}</span> : null}
      </div>
    </form>
  );
}

/** The change log: add a change, and later note what it did. */
export function ChangeLog({ changes, today }: { changes: Change[]; today: string }) {
  const router = useRouter();
  const [day, setDay] = useState(today);
  const [change, setChange] = useState("");
  const [why, setWhy] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [result, setResult] = useState("");
  const [rowMsg, setRowMsg] = useState<string | null>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(null);
    const error = await send({ kind: "change", day, change, why });
    setBusy(false);
    if (error) { setMsg({ ok: false, text: error }); return; }
    setChange(""); setWhy(""); setMsg({ ok: true, text: "Change logged." });
    router.refresh();
  }
  async function saveResult(id: number) {
    setRowMsg(null);
    const error = await send({ kind: "result", id, result });
    if (error) { setRowMsg(error); return; }
    setEditing(null); router.refresh();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead><tr><th>Date</th><th>Change</th><th>Why (signal)</th><th>Result two weeks later</th></tr></thead>
          <tbody>
            {changes.map((c) => (
              <tr key={c.id}>
                <td style={{ whiteSpace: "nowrap" }}>{new Date(`${c.day}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })}</td>
                <td>{c.change}</td>
                <td>{c.why ?? ""}</td>
                <td>
                  {editing === c.id ? (
                    <form className={styles.inline} onSubmit={(e) => { e.preventDefault(); saveResult(c.id); }}>
                      <input id={`sc-result-${c.id}`} className={styles.input} value={result} onChange={(e) => setResult(e.target.value)} aria-label="Result" autoFocus />
                      <button className={styles.button}>Save</button>
                      <button type="button" className={`${styles.button} ${styles.ghost}`} onClick={() => { setEditing(null); setRowMsg(null); }}>Cancel</button>
                      {rowMsg ? <span role="status" className={styles.error}>{rowMsg}</span> : null}
                    </form>
                  ) : (
                    <>{c.result ?? ""} <button type="button" className={styles.linkButton} onClick={() => { setEditing(c.id); setResult(c.result ?? ""); setRowMsg(null); }}>{c.result ? "Edit" : "Add result"}</button></>
                  )}
                </td>
              </tr>
            ))}
            {changes.length ? null : <tr><td colSpan={4} className={styles.muted}>No changes logged yet.</td></tr>}
          </tbody>
        </table>
      </div>
      <form className={styles.form} onSubmit={add}>
        <div className={styles.fields}>
          <label className={styles.field}><span>Date</span><input id="sc-change-day" className={styles.input} type="date" value={day} required onChange={(e) => setDay(e.target.value)} /></label>
          <label className={`${styles.field} ${styles.wide}`}><span>What changed</span><input id="sc-change" className={styles.input} value={change} maxLength={300} required onChange={(e) => setChange(e.target.value)} /></label>
          <label className={`${styles.field} ${styles.wide}`}><span>Why (the signal)</span><input id="sc-why" className={styles.input} value={why} maxLength={300} onChange={(e) => setWhy(e.target.value)} /></label>
        </div>
        <div className={styles.formEnd}>
          <button className={styles.button} disabled={busy}>{busy ? "Saving…" : "Log change"}</button>
          {msg ? <span role="status" className={msg.ok ? styles.ok : styles.error}>{msg.text}</span> : null}
        </div>
      </form>
    </div>
  );
}
