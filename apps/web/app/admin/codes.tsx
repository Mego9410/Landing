"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AccessRequest, DiscountCode, Duration, Grant } from "@/lib/codes";
import styles from "./admin.module.css";

async function send(body: object): Promise<{ error: string | null; data?: { ends?: string | null } }> {
  const r = await fetch("/api/admin/codes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), credentials: "include" }).catch(() => null);
  if (!r) return { error: "Couldn't reach the site. Check your connection and try again." };
  const data = (await r.json().catch(() => null)) as { error?: string; ends?: string | null } | null;
  return r.ok ? { error: null, data: data ?? undefined } : { error: data?.error ?? "Couldn't save that. Try again." };
}
const day = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/London" }) : "");
const dateInput = (iso: string | null) => (iso ? iso.slice(0, 10) : "");
const EMPTY = { code: "", kind: "offering" as "offering" | "free", label: "", offering: "", free_duration: "lifetime" as Duration, new_only: false, starts_at: "", ends_at: "", max_uses: "", note: "" };

/** The codes, their uses, and a form to add one or change one (pick Edit to load it). */
export function Codes({ codes, durations }: { codes: DiscountCode[]; durations: Record<Duration, string> }) {
  const router = useRouter();
  const [f, setF] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const editing = codes.some((c) => c.code === f.code.trim().toUpperCase());
  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  async function save(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(null);
    // Dates are whole days in London: from the start of the first, to the end of the last.
    const { kind: codeKind, ...rest } = f;
    const { error } = await send({ ...rest, kind: "save", code_kind: codeKind, starts_at: f.starts_at ? `${f.starts_at}T00:00:00Z` : "", ends_at: f.ends_at ? `${f.ends_at}T23:59:59Z` : "" });
    setBusy(false);
    if (error) { setMsg({ ok: false, text: error }); return; }
    setMsg({ ok: true, text: editing ? "Code updated." : "Code added." }); setF(EMPTY);
    router.refresh();
  }
  async function toggle(c: DiscountCode) {
    const { error } = await send({ kind: "active", code: c.code, active: !c.active });
    if (error) setMsg({ ok: false, text: error }); else router.refresh();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead><tr><th>Code</th><th>What people see</th><th>Gives</th><th className={styles.num}>Used</th><th>Open</th><th>Status</th><th /></tr></thead>
          <tbody>
            {codes.map((c) => (
              <tr key={c.code}>
                <td><strong>{c.code}</strong>{c.note ? <><br /><span className={styles.muted}>{c.note}</span></> : null}</td>
                <td>{c.label}</td>
                <td>{c.kind === "free" ? <>Free access, {(c.free_duration ? durations[c.free_duration] : "").toLowerCase()} · you approve</> : <>Offering <code>{c.offering}</code></>}{c.new_only ? <><br /><span className={styles.muted}>New members only</span></> : null}</td>
                <td className={styles.num}>{c.uses}{c.max_uses ? ` of ${c.max_uses}` : ""}</td>
                <td style={{ whiteSpace: "nowrap" }}>{c.starts_at || c.ends_at ? `${day(c.starts_at) || "Now"} to ${day(c.ends_at) || "no end"}` : "Always"}</td>
                <td><span className={`${styles.pill} ${c.active ? "" : styles.pillOff}`}>{c.active ? "On" : "Off"}</span></td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button type="button" className={styles.linkButton} onClick={() => { setF({ code: c.code, kind: c.kind, label: c.label, offering: c.offering, free_duration: c.free_duration ?? "lifetime", new_only: c.new_only, starts_at: dateInput(c.starts_at), ends_at: dateInput(c.ends_at), max_uses: c.max_uses ? String(c.max_uses) : "", note: c.note ?? "" }); setMsg(null); }}>Edit</button>{" · "}
                  <button type="button" className={styles.linkButton} onClick={() => toggle(c)}>{c.active ? "Turn off" : "Turn on"}</button>
                </td>
              </tr>
            ))}
            {codes.length ? null : <tr><td colSpan={7} className={styles.muted}>No codes yet. Add the first below.</td></tr>}
          </tbody>
        </table>
      </div>
      <form className={styles.form} onSubmit={save}>
        <div className={styles.fields}>
          <label className={styles.field}><span>Code</span><input id="dc-code" className={styles.input} value={f.code} required maxLength={24} placeholder="FOUNDING" onChange={set("code")} style={{ textTransform: "uppercase" }} /><small>Letters, numbers and dashes</small></label>
          <label className={`${styles.field} ${styles.wide}`}><span>What people see</span><input id="dc-label" className={styles.input} value={f.label} required maxLength={80} placeholder="Founding member price" onChange={set("label")} /><small>Shown on the paywall with the code</small></label>
          <label className={styles.field}><span>Gives</span>
            <select id="dc-kind" className={styles.input} value={f.kind} onChange={set("kind")}>
              <option value="offering">Discounted prices</option>
              <option value="free">Free access (you approve)</option>
            </select>
          </label>
          {f.kind === "offering"
            ? <label className={styles.field}><span>RevenueCat offering</span><input id="dc-offering" className={styles.input} value={f.offering} required maxLength={64} placeholder="founding" onChange={set("offering")} /><small>Its identifier, with the discounted products</small></label>
            : <label className={styles.field}><span>Free for</span>
                <select id="dc-duration" className={styles.input} value={f.free_duration} onChange={set("free_duration")}>
                  {(Object.keys(durations) as Duration[]).map((d) => <option key={d} value={d}>{durations[d]}</option>)}
                </select><small>Requests wait for you below</small></label>}
          <label className={styles.field}><span>Who can use it</span>
            <select id="dc-new" className={styles.input} value={f.new_only ? "new" : "all"} onChange={(e) => setF({ ...f, new_only: e.target.value === "new" })}>
              <option value="all">Anyone</option>
              <option value="new">New members only</option>
            </select>
          </label>
          <label className={styles.field}><span>Opens</span><input id="dc-start" className={styles.input} type="date" value={f.starts_at} onChange={set("starts_at")} /><small>Blank for now</small></label>
          <label className={styles.field}><span>Ends</span><input id="dc-end" className={styles.input} type="date" value={f.ends_at} onChange={set("ends_at")} /><small>Blank for no end</small></label>
          <label className={styles.field}><span>Limit</span><input id="dc-max" className={styles.input} inputMode="numeric" value={f.max_uses} placeholder="1000" onChange={set("max_uses")} /><small>People, blank for no limit</small></label>
          <label className={`${styles.field} ${styles.wide}`}><span>Note (only here)</span><input id="dc-note" className={styles.input} value={f.note} maxLength={300} placeholder="Launch list email, 20 Oct" onChange={set("note")} /></label>
        </div>
        <div className={styles.formEnd}>
          <button className={styles.button} disabled={busy}>{busy ? "Saving…" : editing ? "Update code" : "Add code"}</button>
          {editing ? <button type="button" className={`${styles.button} ${styles.ghost}`} onClick={() => { setF(EMPTY); setMsg(null); }}>Clear</button> : null}
          {msg ? <span role="status" className={msg.ok ? styles.ok : styles.error}>{msg.text}</span> : null}
        </div>
      </form>
    </div>
  );
}

/** Free access for testers, friends and family: paste the Steadie ID they sent from Settings. */
export function FreeAccess({ grants, durations }: { grants: Grant[]; durations: Record<Duration, string> }) {
  const router = useRouter();
  const [id, setId] = useState("");
  const [duration, setDuration] = useState<Duration>("lifetime");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function grant(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(null);
    const { error, data } = await send({ kind: "grant", appUserId: id, duration, note });
    setBusy(false);
    if (error) { setMsg({ ok: false, text: error }); return; }
    setMsg({ ok: true, text: data?.ends ? `Free access given until ${day(data.ends)}. It shows in the app next time they open it.` : "Free access given for good. It shows in the app next time they open it." });
    setId(""); setNote(""); router.refresh();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <form className={styles.form} onSubmit={grant}>
        <div className={styles.fields}>
          <label className={`${styles.field} ${styles.wide}`}><span>Steadie ID</span><input id="fa-id" className={styles.input} value={id} required placeholder="$RCAnonymousID:…" onChange={(e) => setId(e.target.value)} /><small>They send it from Settings → Send my Steadie ID</small></label>
          <label className={styles.field}><span>How long</span>
            <select id="fa-duration" className={styles.input} value={duration} onChange={(e) => setDuration(e.target.value as Duration)}>
              {(Object.keys(durations) as Duration[]).map((d) => <option key={d} value={d}>{durations[d]}</option>)}
            </select>
          </label>
          <label className={`${styles.field} ${styles.wide}`}><span>Who (only here)</span><input id="fa-note" className={styles.input} value={note} maxLength={300} placeholder="Sam, beta tester" onChange={(e) => setNote(e.target.value)} /></label>
        </div>
        <div className={styles.formEnd}>
          <button className={styles.button} disabled={busy}>{busy ? "Giving…" : "Give free access"}</button>
          {msg ? <span role="status" className={msg.ok ? styles.ok : styles.error}>{msg.text}</span> : null}
        </div>
      </form>
      {grants.length ? (
        <div className={styles.scroll}>
          <table className={styles.table}>
            <thead><tr><th>Given</th><th>Who</th><th>How long</th><th>Steadie ID</th><th>By</th></tr></thead>
            <tbody>{grants.map((g) => <tr key={g.id}><td style={{ whiteSpace: "nowrap" }}>{day(g.created_at)}</td><td>{g.note ?? ""}</td><td>{durations[g.duration] ?? g.duration}</td><td><code>{g.app_user_id}</code></td><td>{g.granted_by}</td></tr>)}</tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

/** Requests from free-access codes: approve to give the code's free access in RevenueCat, or decline. */
export function Requests({ requests, durations }: { requests: AccessRequest[]; durations: Record<Duration, string> }) {
  const router = useRouter();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState<number | null>(null);
  async function decide(r: AccessRequest, approve: boolean) {
    setBusy(r.id); setMsg(null);
    const { error } = await send({ kind: "request", id: r.id, approve });
    setBusy(null);
    if (error) { setMsg({ ok: false, text: error }); return; }
    setMsg({ ok: true, text: approve ? "Free access given. It shows in the app next time they open it." : "Request declined." });
    router.refresh();
  }
  if (!requests.length) return <p className={styles.muted}>No requests yet. They appear here when someone types a free-access code.</p>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead><tr><th>Asked</th><th>Code</th><th>Steadie ID</th><th>Free for</th><th /></tr></thead>
          <tbody>{requests.map((r) => (
            <tr key={r.id}>
              <td style={{ whiteSpace: "nowrap" }}>{day(r.created_at)}</td>
              <td><strong>{r.code}</strong></td>
              <td><code>{r.app_user_id}</code></td>
              <td>{r.free_duration ? durations[r.free_duration] : ""}</td>
              <td style={{ whiteSpace: "nowrap" }}>
                {r.status === "pending" ? <>
                  <button type="button" className={styles.linkButton} disabled={busy === r.id} onClick={() => decide(r, true)}>{busy === r.id ? "Giving…" : "Approve"}</button>{" · "}
                  <button type="button" className={styles.linkButton} disabled={busy === r.id} onClick={() => decide(r, false)}>Decline</button>
                </> : <span className={`${styles.pill} ${r.status === "approved" ? "" : styles.pillOff}`}>{r.status === "approved" ? "Approved" : "Declined"}</span>}
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {msg ? <span role="status" className={msg.ok ? styles.ok : styles.error}>{msg.text}</span> : null}
    </div>
  );
}
