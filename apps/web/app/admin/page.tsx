import type { Metadata } from "next";
import { headers } from "next/headers";
import { adminFrom, guideSchedule, loadDownloads, loadEmails, loadFunnel, loadMembers, loadRevenue, setupChecks, type Loaded, type RcMetric } from "@/lib/admin";
import { getAuth } from "@/lib/auth";
import styles from "./admin.module.css";
import { DailyBars } from "./chart";
import { AdminLogin, SignOut } from "./login";

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
const metric = (list: RcMetric[], id: string) => list.find((m) => m.id === id);
const rcValue = (m?: RcMetric) => (!m ? "–" : m.unit === "$" || m.unit === "£" || /revenue|mrr/i.test(m.id) ? `£${n(Math.round(m.value))}` : n(m.value));

export default async function Admin() {
  const h = await headers();
  const admin = await adminFrom(h);
  if (!admin) {
    const session = await (await getAuth()).api.getSession({ headers: new Headers(h) }).catch(() => null);
    return <main className={styles.page}><AdminLogin signedInAs={session?.user.email} /></main>;
  }

  const [members, emails, revenue, downloads, funnel] = await Promise.all([loadMembers(), loadEmails(), loadRevenue(), loadDownloads(), loadFunnel()]);
  const guides = guideSchedule();
  const rc = revenue.ok ? revenue.data : [];
  const dl = downloads.ok ? downloads.data : [];
  const dlTotal = dl.reduce((s, p) => s + (p.n ?? 0), 0);

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
          <Tile label="Guides live" value={n(guides.live)} note={`${guides.scheduled} scheduled`} />
        </div>

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
