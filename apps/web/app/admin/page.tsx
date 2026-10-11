import type { Metadata } from "next";
import { headers } from "next/headers";
import { adminFrom, guideSchedule, loadDownloads, loadEmails, loadCrashes, loadFunnel, loadLapses, loadMembers, loadRevenue, setupChecks, type Loaded, type RcMetric } from "@/lib/admin";
import { getAuth } from "@/lib/auth";
import { londonToday } from "@/content/guides";
import { CHECKPOINTS, FUNNEL, HEADLINE, KPIS, lastWeekStart, loadScorecard, RULES, type Kpi, type KpiKey, type Week } from "@/lib/growth";
import styles from "./admin.module.css";
import { DailyBars } from "./chart";
import { AdminLogin, SignOut } from "./login";
import { ChangeLog, WeekForm } from "./scorecard";

// The owner's dashboard: members, subscriptions, downloads, emails and guides in one place. Only ADMIN_EMAILS can
// open it; everything is read live on each visit. The data comes from lib/admin.ts.
export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const n = (v: number) => v.toLocaleString("en-GB");
const pct = (v?: number) => (v === undefined || v === null ? "–" : `${Math.round(v * (v <= 1 ? 100 : 1))}%`);
const when = (iso: string) => new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });
const day = (d: string) => new Date(d + "T12:00:00Z").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });

const pctText = (p: number | null) => (p == null ? "–" : `${p}%`);

function Tile({ label, value, note }: { label: string; value: string; note?: string }) {
  return <div className={styles.tile}><span className={styles.tileLabel}>{label}</span><span className={styles.tileValue}>{value}</span>{note ? <span className={styles.tileNote}>{note}</span> : null}</div>;
}
function Notice<T>({ loaded }: { loaded: Loaded<T> }) {
  return loaded.ok ? null : <p className={styles.notice}>{loaded.reason}</p>;
}
/** A scorecard figure as it reads: 1,234 · 4.2% · £300 · 4.7. */
const kpiText = (k: Kpi, v: number | null | undefined) => v == null ? "–"
  : k.kind === "pct" ? `${v.toLocaleString("en-GB", { maximumFractionDigits: 1 })}%`
  : k.kind === "gbp" ? `£${Math.round(v).toLocaleString("en-GB")}`
  : k.kind === "stars" ? v.toFixed(1) : n(v);
const KPI_BY = Object.fromEntries(KPIS.map((k) => [k.key, k])) as Record<KpiKey, Kpi>;
const plusDays = (d: string, days: number) => { const x = new Date(`${d}T12:00:00Z`); x.setUTCDate(x.getUTCDate() + days); return x.toISOString().slice(0, 10); };

function KpiCard({ k, latest, prev }: { k: Kpi; latest?: Week; prev?: Week }) {
  const v = latest?.[k.key] ?? null, before = prev?.[k.key] ?? null;
  const change = v != null && before != null ? Math.round((v - before) * 10) / 10 : null;
  const miss = v != null && k.goal != null && v < k.goal;
  return (
    <div className={styles.tile}>
      <span className={styles.tileLabel}>{k.label}</span>
      <span className={`${styles.tileValue} ${miss ? styles.miss : ""}`}>{kpiText(k, v)}</span>
      <span className={`${styles.tileNote} ${change ? (change > 0 ? styles.up : styles.down) : ""}`}>
        {change == null ? (latest ? "No week before to compare" : "No weeks yet") : `${change > 0 ? "+" : change < 0 ? "−" : "±"}${kpiText(k, Math.abs(change))} on the week before`}
      </span>
      <span className={styles.tileNote}>Target by month 6: <strong>{k.target}</strong></span>
    </div>
  );
}

const metric = (list: RcMetric[], id: string) => list.find((m) => m.id === id);
const rcValue = (m?: RcMetric) => (!m ? "–" : m.unit === "$" || m.unit === "£" || /revenue|mrr/i.test(m.id) ? `£${n(Math.round(m.value))}` : n(m.value));

export default async function Admin() {
  const h = await headers();
  const admin = await adminFrom(h);
  if (!admin) {
    const session = await (await getAuth()).api.getSession({ headers: new Headers(h) }).catch(() => null);
    return <main className={styles.page}><AdminLogin signedInAs={session?.user.email} /></main>;
  }

  const [members, emails, revenue, downloads, funnel, lapses, crashes, scorecard] = await Promise.all([loadMembers(), loadEmails(), loadRevenue(), loadDownloads(), loadFunnel(), loadLapses(), loadCrashes(),
    loadScorecard().then((data) => ({ ok: true as const, data })).catch((e: Error) => { console.error("admin: scorecard", e); return { ok: false as const, reason: `Couldn't load the scorecard: ${e.message}` }; })]);
  const guides = guideSchedule();
  const rc = revenue.ok ? revenue.data : [];
  const dl = downloads.ok ? downloads.data : [];
  const dlTotal = dl.reduce((s, p) => s + (p.n ?? 0), 0);

  // Growth scorecard: the latest two weeks, the weakest funnel step against target, and what the form can fill in.
  const today = londonToday(), reviewWeek = lastWeekStart(today);
  const weeks = scorecard.ok ? scorecard.data.weeks : [];
  const latest = weeks[weeks.length - 1], prev = weeks[weeks.length - 2];
  const leak = latest ? FUNNEL.map((key) => ({ k: KPI_BY[key], ratio: (latest[key] ?? NaN) / (KPI_BY[key].goal ?? NaN) })).filter((x) => Number.isFinite(x.ratio)).sort((a, b) => a.ratio - b.ratio)[0] : undefined;
  const weekDays = dl.filter((p) => p.day >= reviewWeek && p.day <= plusDays(reviewWeek, 6));
  const suggested: Partial<Record<KpiKey, number>> = {};
  if (weekDays.length === 7 && weekDays.every((p) => p.n != null)) suggested.downloads = weekDays.reduce((s, p) => s + (p.n ?? 0), 0);
  const payers = metric(rc, "active_subscriptions"), mrr = metric(rc, "mrr");
  if (payers) suggested.active_payers = Math.round(payers.value);
  if (mrr) suggested.net_mrr_gbp = Math.round(mrr.value * 0.85); // after Apple's 15% (Small Business Programme)

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <header className={styles.top}>
          <div>
            <h1 className={styles.title}>Steadie dashboard</h1>
            <p className={styles.muted}>Live as of {when(new Date().toISOString())} · signed in as {admin.email}</p>
          </div>
          <SignOut />
        </header>

        <div className={styles.tiles}>
          <Tile label="Members" value={members.ok ? n(members.data.total) : "–"} note={members.ok ? `${n(members.data.new7)} new this week` : "Accounts in the app"} />
          <Tile label="Active this week" value={members.ok ? n(members.data.active7) : "–"} note="Signed-in members who opened the app" />
          <Tile label="Subscribers" value={rcValue(metric(rc, "active_subscriptions"))} note={revenue.ok ? `${rcValue(metric(rc, "active_trials"))} on a free trial` : "From RevenueCat"} />
          <Tile label="Monthly revenue" value={rcValue(metric(rc, "mrr"))} note="MRR, from RevenueCat" />
          <Tile label="Downloads" value={downloads.ok ? n(dlTotal) : "–"} note="Last 14 days, App Store" />
          <Tile label="Email subscribers" value={emails.ok ? n(emails.data.subscribed) : "–"} note={emails.ok ? `${n(emails.data.unsubscribed)} unsubscribed` : "Guide emails"} />
          <Tile label="Crash-free sessions" value={crashes.ok && crashes.data.crashFree?.rate != null ? `${(crashes.data.crashFree.rate * 100).toFixed(1)}%` : "–"} note={crashes.ok ? `${n(crashes.data.issues.length)} open issues · 14 days` : "From Sentry"} />
          <Tile label="Guides live" value={n(guides.live)} note={`${guides.scheduled} scheduled`} />
        </div>

        <section className={styles.section} aria-labelledby="growth">
          <div className={styles.sectionHead}>
            <h2 id="growth" className={styles.h2}>Growth scorecard</h2>
            <span className={styles.muted}>{latest ? `Week of ${day(latest.week_start)}, against the month-6 targets` : "From the Organic Growth Playbook · filled in at the Monday review"}</span>
          </div>
          {scorecard.ok ? null : <p className={styles.notice}>{scorecard.reason}</p>}
          <p className={styles.lead}>
            {!latest ? "No weeks logged yet. Fill in the first row at the Monday review after Steadie is live on the App Store."
              : !leak ? "Fill in the funnel figures to see this week's leak."
              : leak.ratio < 1 ? `The leak to fix this week: ${leak.k.label.toLowerCase()}, furthest below its target. Pick at most two changes from the rules below.`
              : "Every funnel step is at or above target. Keep shipping the content cadence and leave the listing alone."}
          </p>
          <div className={styles.tiles}>{HEADLINE.map((key) => <KpiCard key={key} k={KPI_BY[key]} latest={latest} prev={prev} />)}</div>

          <details className={styles.details} open={!weeks.length || latest?.week_start !== reviewWeek}>
            <summary>Fill in a week</summary>
            <WeekForm kpis={KPIS} weeks={weeks} start={reviewWeek} suggested={suggested} />
          </details>

          <div className={styles.scroll}>
            <p className={styles.muted} style={{ marginBottom: 8 }}>Every week, newest first</p>
            <table className={styles.table}>
              <thead><tr><th>Week of</th>{KPIS.map((k) => <th key={k.key} className={styles.num} title={k.definition}>{k.short}</th>)}</tr></thead>
              <tbody>
                {[...weeks].reverse().map((w) => (
                  <tr key={w.week_start}><td style={{ whiteSpace: "nowrap" }}>{day(w.week_start)}</td>{KPIS.map((k) => {
                    const v = w[k.key], miss = v != null && k.goal != null && v < k.goal;
                    return <td key={k.key} className={`${styles.num} ${miss ? styles.miss : ""}`}>{kpiText(k, v)}</td>;
                  })}</tr>
                ))}
                {weeks.length ? null : <tr><td colSpan={KPIS.length + 1} className={styles.muted}>No weeks yet.</td></tr>}
              </tbody>
            </table>
          </div>

          <div className={styles.grid2}>
            <div className={styles.scroll}>
              <p className={styles.muted} style={{ marginBottom: 8 }}>Decision rules · at most two changes a week, one thing at a time</p>
              <table className={styles.table}>
                <thead><tr><th>Signal</th><th>Threshold</th><th>Action this week</th></tr></thead>
                <tbody>{RULES.map((r) => <tr key={r.signal}><td><strong>{r.signal}</strong></td><td>{r.threshold}</td><td>{r.action}</td></tr>)}</tbody>
              </table>
            </div>
            <div className={styles.scroll}>
              <p className={styles.muted} style={{ marginBottom: 8 }}>Scenario checkpoints · the US move triggers at £5k net MRR</p>
              <table className={styles.table}>
                <thead><tr><th>When</th><th>On target</th><th>Behind if</th><th>If behind</th></tr></thead>
                <tbody>{CHECKPOINTS.map((c) => <tr key={c.when}><td style={{ whiteSpace: "nowrap" }}><strong>{c.when}</strong></td><td>{c.onTarget}</td><td>{c.behind}</td><td>{c.ifBehind}</td></tr>)}</tbody>
              </table>
            </div>
          </div>

          <div>
            <p className={styles.muted} style={{ marginBottom: 8 }}>Change log · every change, the signal behind it, and what it did two weeks later</p>
            <ChangeLog changes={scorecard.ok ? scorecard.data.changes : []} today={today} />
          </div>

          <details className={styles.details}>
            <summary>What each figure means</summary>
            <div className={styles.scroll}>
              <table className={styles.table}>
                <thead><tr><th>KPI</th><th>Definition</th><th>Source</th><th>Month-6 target</th></tr></thead>
                <tbody>{KPIS.map((k) => <tr key={k.key}><td><strong>{k.label}</strong></td><td>{k.definition}</td><td>{k.source}</td><td>{k.target}</td></tr>)}</tbody>
              </table>
            </div>
          </details>
        </section>

        <section className={styles.section} aria-labelledby="crashes">
          <div className={styles.sectionHead}><h2 id="crashes" className={styles.h2}>Crashes and errors</h2><span className={styles.muted}>Sentry, last 14 days{crashes.ok ? <> · <a href={crashes.data.link} target="_blank" rel="noreferrer" style={{ color: "inherit" }}>open in Sentry</a></> : null}</span></div>
          <Notice loaded={crashes} />
          {crashes.ok ? (
            <div className={styles.grid2}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {crashes.data.perDay ? <><p className={styles.muted}>Errors per day</p><DailyBars points={crashes.data.perDay} label="App errors per day" /></> : <p className={styles.muted}>Errors per day aren&apos;t available with this token.</p>}
                <div className={styles.stats}>
                  <div className={styles.stat}><strong>{crashes.data.crashFree?.rate != null ? `${(crashes.data.crashFree.rate * 100).toFixed(1)}%` : "–"}</strong><span>crash-free sessions</span></div>
                  <div className={styles.stat}><strong>{crashes.data.crashFree ? n(crashes.data.crashFree.sessions) : "–"}</strong><span>app sessions</span></div>
                  <div className={styles.stat}><strong>{n(crashes.data.issues.reduce((a, i) => a + i.count, 0))}</strong><span>events in open issues</span></div>
                </div>
              </div>
              <div className={styles.scroll}>
                <p className={styles.muted} style={{ marginBottom: 8 }}>Open issues, most frequent first</p>
                <table className={styles.table}>
                  <thead><tr><th>Issue</th><th className={styles.num}>Events</th><th className={styles.num}>People</th><th>Last seen</th></tr></thead>
                  <tbody>{crashes.data.issues.map((i) => (
                    <tr key={i.id}>
                      <td style={{ wordBreak: "break-word" }}><a href={i.link} target="_blank" rel="noreferrer" style={{ color: "inherit", fontWeight: 700 }}>{i.title}</a>{i.culprit ? <div className={styles.muted}>{i.culprit}</div> : null}</td>
                      <td className={styles.num}>{n(i.count)}</td><td className={styles.num}>{n(i.users)}</td><td>{i.lastSeen ? when(i.lastSeen) : "–"}</td>
                    </tr>
                  ))}{crashes.data.issues.length ? null : <tr><td colSpan={4} className={styles.muted}>No open issues. Nice.</td></tr>}</tbody>
                </table>
              </div>
            </div>
          ) : null}
        </section>

        <section className={styles.section} aria-labelledby="funnel">
          <div className={styles.sectionHead}><h2 id="funnel" className={styles.h2}>Funnel</h2><span className={styles.muted}>From the app, everyone (signed in or not): installs reaching each step{funnel.ok ? ` · ${n(funnel.data.installs)} installs active in 30 days` : ""}</span></div>
          <Notice loaded={funnel} />
          {funnel.ok ? (
            <div className={styles.grid2}>
              {funnel.data.windows.map((w) => (
                <div key={w.days} className={styles.scroll}>
                  <p className={styles.muted} style={{ marginBottom: 8 }}>Last {w.days} days</p>
                  <table className={styles.table}>
                    <thead><tr><th>Step</th><th className={styles.num}>Installs</th><th className={styles.num}>Of opens</th><th className={styles.num}>Of step before</th></tr></thead>
                    <tbody>{w.steps.map((st) => (
                      <tr key={st.label}><td>{st.label}</td><td className={styles.num}>{n(st.n)}</td><td className={styles.num}>{pctText(st.ofFirst)}</td><td className={styles.num}>{pctText(st.ofPrev)}</td></tr>
                    ))}</tbody>
                  </table>
                </div>
              ))}
              <div className={styles.stats}>
                {funnel.data.retention.map((r) => (
                  <div key={r.label} className={styles.stat}><strong>{pctText(r.pct)}</strong><span>{r.label} check-in retention ({n(r.kept)} of {n(r.eligible)})</span></div>
                ))}
              </div>
              {funnel.data.screens.length ? (
                <div className={styles.scroll}>
                  <p className={styles.muted} style={{ marginBottom: 8 }}>Onboarding screens reached, last 30 days</p>
                  <table className={styles.table}>
                    <thead><tr><th>Screen</th><th className={styles.num}>Installs</th><th className={styles.num}>Of screen before</th></tr></thead>
                    <tbody>{funnel.data.screens.map((sc) => (
                      <tr key={sc.step}><td>{sc.step}</td><td className={styles.num}>{n(sc.n)}</td><td className={styles.num}>{pctText(sc.ofPrev)}</td></tr>
                    ))}</tbody>
                  </table>
                </div>
              ) : null}
            </div>
          ) : null}
        </section>

        <section className={styles.section} aria-labelledby="lapses">
          <div className={styles.sectionHead}><h2 id="lapses" className={styles.h2}>Why people cancel</h2><span className={styles.muted}>The card shown once after a cancellation{lapses.ok ? ` · ${n(lapses.data.total)} answers` : ""}</span></div>
          <Notice loaded={lapses} />
          {lapses.ok ? (
            <div className={styles.grid2}>
              <div className={styles.scroll}>
                <table className={styles.table}>
                  <thead><tr><th>Reason</th><th className={styles.num}>Last 30 days</th><th className={styles.num}>All time</th></tr></thead>
                  <tbody>{lapses.data.reasons.map((r) => (
                    <tr key={r.key}><td>{r.label}</td><td className={styles.num}>{n(r.n30)}</td><td className={styles.num}>{n(r.n)}</td></tr>
                  ))}</tbody>
                </table>
              </div>
              <div className={styles.scroll}>
                <p className={styles.muted} style={{ marginBottom: 8 }}>Latest notes</p>
                <table className={styles.table}>
                  <tbody>{lapses.data.notes.map((x, i) => (
                    <tr key={i}><td style={{ whiteSpace: "nowrap" }}>{x.reason}</td><td>{x.note}</td><td style={{ whiteSpace: "nowrap" }}>{when(x.at)}</td></tr>
                  ))}{lapses.data.notes.length ? null : <tr><td className={styles.muted}>No notes yet.</td></tr>}</tbody>
                </table>
              </div>
            </div>
          ) : null}
        </section>

        <section className={styles.section} aria-labelledby="members">
          <div className={styles.sectionHead}><h2 id="members" className={styles.h2}>Members</h2><span className={styles.muted}>People with a Steadie account (signing in is optional, so this isn&apos;t everyone using the app)</span></div>
          <Notice loaded={members} />
          {members.ok ? (
            <div className={styles.grid2}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <p className={styles.muted}>New accounts per day, last 30 days</p>
                <DailyBars points={members.data.signups} label="New accounts per day" />
                <div className={styles.stats}>
                  <div className={styles.stat}><strong>{n(members.data.new30)}</strong><span>new in 30 days</span></div>
                  <div className={styles.stat}><strong>{n(members.data.active30)}</strong><span>active in 30 days</span></div>
                  <div className={styles.stat}><strong>{n(members.data.apple)}</strong><span>with Apple</span></div>
                  <div className={styles.stat}><strong>{n(members.data.total - members.data.apple)}</strong><span>with email</span></div>
                  <div className={styles.stat}><strong>{n(members.data.backups)}</strong><span>with a backup</span></div>
                  <div className={styles.stat}><strong>{n(members.data.waitlist)}</strong><span>on the old waitlist</span></div>
                </div>
              </div>
              <div className={styles.scroll}>
                <p className={styles.muted} style={{ marginBottom: 8 }}>Newest members</p>
                <table className={styles.table}>
                  <thead><tr><th>Email</th><th>Joined</th><th>Sign-in</th></tr></thead>
                  <tbody>{members.data.recent.map((m) => (
                    <tr key={m.email}><td style={{ wordBreak: "break-all" }}>{m.email}</td><td>{when(m.at)}</td><td>{m.apple ? "Apple" : "Email"}{m.backedUp ? "" : " · no backup yet"}</td></tr>
                  ))}{members.data.recent.length ? null : <tr><td colSpan={3} className={styles.muted}>No members yet.</td></tr>}</tbody>
                </table>
              </div>
            </div>
          ) : null}
        </section>

        <div className={styles.grid2}>
          <section className={styles.section} aria-labelledby="subs">
            <div className={styles.sectionHead}><h2 id="subs" className={styles.h2}>Subscriptions</h2><span className={styles.muted}>RevenueCat, last 28 days where it applies</span></div>
            <Notice loaded={revenue} />
            {revenue.ok ? (
              <div className={styles.stats}>{rc.map((m) => (
                <div key={m.id} className={styles.stat} title={m.description}><strong>{rcValue(m)}</strong><span>{m.name}</span></div>
              ))}</div>
            ) : null}
          </section>

          <section className={styles.section} aria-labelledby="downloads">
            <div className={styles.sectionHead}><h2 id="downloads" className={styles.h2}>Downloads</h2><span className={styles.muted}>First-time downloads, App Store (a day or two behind)</span></div>
            <Notice loaded={downloads} />
            {downloads.ok ? <DailyBars points={dl} label="App Store downloads per day" /> : null}
          </section>
        </div>

        <section className={styles.section} aria-labelledby="emails">
          <div className={styles.sectionHead}><h2 id="emails" className={styles.h2}>Guide emails</h2><span className={styles.muted}>Resend, last 60 days</span></div>
          <Notice loaded={emails} />
          {emails.ok ? (
            <>
              <div className={styles.stats}>
                <div className={styles.stat}><strong>{n(emails.data.subscribed)}</strong><span>subscribed</span></div>
                <div className={styles.stat}><strong>{n(emails.data.totals?.delivered ?? 0)}</strong><span>delivered</span></div>
                <div className={styles.stat}><strong>{pct(emails.data.totals?.open_rate)}</strong><span>open rate</span></div>
                <div className={styles.stat}><strong>{pct(emails.data.totals?.click_rate)}</strong><span>click rate</span></div>
                <div className={styles.stat}><strong>{n(emails.data.totals?.unsubscribed ?? 0)}</strong><span>unsubscribes</span></div>
              </div>
              <div className={styles.scroll}>
                <table className={styles.table}>
                  <thead><tr><th>Email</th><th>Sent</th><th className={styles.num}>Delivered</th><th className={styles.num}>Opened</th><th className={styles.num}>Clicked</th></tr></thead>
                  <tbody>{emails.data.broadcasts.map((b) => (
                    <tr key={b.name + b.sentAt}><td>{b.name.replace(/^guide:/, "Guide: ").replace(/^digest:/, "Digest: ")}</td><td>{b.sentAt ? when(b.sentAt) : b.status}</td>
                      <td className={styles.num}>{b.stats?.delivered ?? "–"}</td><td className={styles.num}>{pct(b.stats?.open_rate)}</td><td className={styles.num}>{pct(b.stats?.click_rate)}</td></tr>
                  ))}{emails.data.broadcasts.length ? null : <tr><td colSpan={5} className={styles.muted}>Nothing sent yet.</td></tr>}</tbody>
                </table>
              </div>
            </>
          ) : null}
        </section>

        <div className={styles.grid2}>
          <section className={styles.section} aria-labelledby="guides">
            <div className={styles.sectionHead}><h2 id="guides" className={styles.h2}>Guides</h2><span className={styles.muted}>{guides.live} live · {guides.scheduled} scheduled{guides.lastDate ? ` · runs out ${day(guides.lastDate)}` : ""}</span></div>
            <table className={styles.table}>
              <thead><tr><th>Coming up</th><th>Goes live</th></tr></thead>
              <tbody>{guides.next.map((g) => <tr key={g.slug}><td>{g.title}</td><td style={{ whiteSpace: "nowrap" }}>{day(g.date)}</td></tr>)}
                {guides.next.length ? null : <tr><td colSpan={2} className={styles.muted}>Nothing scheduled. Time for a new batch.</td></tr>}</tbody>
            </table>
          </section>

          <section className={styles.section} aria-labelledby="setup">
            <div className={styles.sectionHead}><h2 id="setup" className={styles.h2}>Set-up</h2></div>
            <ul className={styles.checks}>{setupChecks().map((c) => (
              <li key={c.label}><span className={`${styles.pill} ${c.ok ? "" : styles.pillOff}`}>{c.ok ? "On" : "Off"}</span>{c.label}</li>
            ))}</ul>
            <div className={styles.links}>
              <a href="https://appstoreconnect.apple.com/apps/6820083153" rel="noopener">App Store Connect</a>
              <a href="https://app.revenuecat.com" rel="noopener">RevenueCat</a>
              <a href="https://resend.com/broadcasts" rel="noopener">Resend</a>
              <a href="https://vercel.com/dashboard" rel="noopener">Vercel</a>
              <a href="https://expo.dev/accounts/mego10/projects/landing" rel="noopener">Expo</a>
              <a href="https://console.neon.tech" rel="noopener">Neon</a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
