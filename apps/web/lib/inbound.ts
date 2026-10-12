// Mail sent to any address at getsteadieapp.com (hello@, support@ and so on) arrives in Resend, which calls
// /api/inbound with an `email.received` webhook. This file fetches that email from Resend and forwards it, with its
// attachments, to a real inbox. Replying from that inbox goes straight back to the sender (Reply-To is theirs).
//
// If a forward fails, Resend retries the webhook and an alert email goes to INBOUND_ALERT_TO (once per email). 
// hourly watchdog (/api/cron/inbound) also lists what Resend received in the last week and forwards anything that
// never arrived, so a broken or disabled webhook can't lose mail quietly. Setup: docs/inbound-email.md.
//
// Env: RESEND_API_KEY (already set), RESEND_INBOUND_SECRET (the webhook's signing secret, whsec_…),
// INBOUND_FORWARD_TO (the inbox), and optionally INBOUND_FROM (default inbox@getsteadieapp.com) and INBOUND_ALERT_TO
// (default INBOUND_FORWARD_TO). The inbox address lives only in Vercel, never in this public repo.
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { sql } from "drizzle-orm";
import { getDb } from "./db";
import { ensureExtraTables } from "./db/extra";

const API = "https://api.resend.com";
/** Resend's limit is 40 MB per email after base64; base64 adds a third, so keep the raw total under 28 MB. */
const MAX_ATTACHMENT_BYTES = 28 * 1024 * 1024;
/** Marks our own forwards, so a forward that somehow loops back to us is never forwarded again. */
const LOOP_HEADER = "X-Steadie-Forwarded";

const env = (name: string) => process.env[name]?.trim() || undefined;
const forwardTo = () => env("INBOUND_FORWARD_TO");
const fromAddress = () => env("INBOUND_FROM") ?? "inbox@getsteadieapp.com";
const alertTo = () => env("INBOUND_ALERT_TO") ?? forwardTo();

// ---- Webhook signature (Resend signs with Svix) ----

/** True if the webhook really came from Resend: HMAC-SHA256 of "id.timestamp.body" with the whsec_ secret, sent
 *  within the last five minutes. The body must be the raw text, not re-serialised JSON. */
export function verifyWebhook(body: string, headers: Headers, secret: string, now = Date.now()) {
  const id = headers.get("svix-id");
  const timestamp = headers.get("svix-timestamp");
  const signatures = headers.get("svix-signature");
  if (!id || !timestamp || !signatures) return false;
  const sent = Number(timestamp) * 1000;
  if (!Number.isFinite(sent) || Math.abs(now - sent) > 5 * 60 * 1000) return false;
  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expected = createHmac("sha256", key).update(`${id}.${timestamp}.${body}`).digest();
  return signatures.split(" ").some((entry) => {
    const [version, sig] = entry.split(",");
    if (version !== "v1" || !sig) return false;
    const given = Buffer.from(sig, "base64");
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
}

// ---- Resend API ----

async function api<T>(path: string, init: { method?: string; body?: unknown; idempotencyKey?: string } = {}): Promise<T> {
  const key = env("RESEND_API_KEY");
  if (!key) throw new Error("RESEND_API_KEY isn't set.");
  const res = await fetch(API + path, {
    method: init.method ?? "GET",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.idempotencyKey ? { "Idempotency-Key": init.idempotencyKey } : {}),
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store",
  });
  const text = await res.text();
  let data: unknown = {};
  try { data = text ? JSON.parse(text) : {}; } catch { /* not JSON; the status says enough */ }
  if (!res.ok) throw new Error(`Resend ${init.method ?? "GET"} ${path}: ${res.status} ${(data as { message?: string })?.message ?? text.slice(0, 200)}`);
  return data as T;
}

type Received = {
  id?: string;
  from: string;
  to: string[];
  cc?: string[];
  reply_to?: string[];
  subject: string | null;
  html: string | null;
  text: string | null;
  headers?: Record<string, string>;
  attachments?: { id: string; filename: string; content_type: string; content_disposition: string | null; content_id: string | null; size: number }[];
  created_at?: string;
};
type AttachmentLink = { id: string; filename: string; content_type: string; content_id: string | null; size: number; download_url: string };

// ---- The forward ----

const escHtml = (s: string) => s.replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c]!);
/** "Jane Doe <jane@x.com>" → "Jane Doe"; "jane@x.com" → "jane@x.com". Quotes and angle brackets removed. */
const displayName = (from: string) => (from.match(/^\s*"?([^"<]*?)"?\s*<[^>]+>/)?.[1] || from).replace(/["<>\r\n]/g, "").trim().slice(0, 60);

export type ForwardResult = { status: "forwarded" | "skipped"; note?: string };

/** Fetches a received email from Resend and sends it on to INBOUND_FORWARD_TO. Throws if it can't. Safe to call
 *  twice for the same email: Resend's idempotency key stops a second copy within 24 hours. */
export async function forwardEmail(emailId: string): Promise<ForwardResult> {
  const to = forwardTo();
  if (!to) throw new Error("INBOUND_FORWARD_TO isn't set, so there's nowhere to forward mail.");
  const email = await api<Received>(`/emails/receiving/${encodeURIComponent(emailId)}`);

  const headers = Object.fromEntries(Object.entries(email.headers ?? {}).map(([k, v]) => [k.toLowerCase(), v]));
  if (headers[LOOP_HEADER.toLowerCase()]) return { status: "skipped", note: "already a Steadie forward (loop)" };

  // Attachments: Resend hands out short-lived download links; we fetch each and pass it on as base64.
  const attachments: { filename: string; content: string; content_type?: string; content_id?: string }[] = [];
  let dropped: string[] = [];
  if (email.attachments?.length) {
    const list = await api<{ data: AttachmentLink[] }>(`/emails/receiving/${encodeURIComponent(emailId)}/attachments?limit=100`);
    const total = list.data.reduce((n, a) => n + (a.size || 0), 0);
    if (total > MAX_ATTACHMENT_BYTES) {
      dropped = list.data.map((a) => a.filename);
    } else {
      for (const a of list.data) {
        const res = await fetch(a.download_url, { cache: "no-store" });
        if (!res.ok) throw new Error(`Couldn't download attachment "${a.filename}" (${res.status}).`);
        attachments.push({
          filename: a.filename || "attachment",
          content: Buffer.from(await res.arrayBuffer()).toString("base64"),
          ...(a.content_type ? { content_type: a.content_type } : {}),
          ...(a.content_id ? { content_id: a.content_id.replace(/^<|>$/g, "") } : {}),
        });
      }
    }
  }

  const sender = headers.from || email.from;
  const recipients = [...(email.to ?? []), ...(email.cc ?? [])].join(", ");
  const droppedNote = dropped.length ? `Attachments too large to forward (over 28 MB in total): ${dropped.join(", ")}. They're still in Resend → Emails → Receiving.` : "";
  const bannerText = [`Forwarded by Steadie. From: ${sender} · To: ${recipients}`, droppedNote].filter(Boolean).join("\n");
  const bannerHtml = `<div style="font:13px/1.5 -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#6A6371;background:#F5EFE6;border-radius:8px;padding:8px 12px;margin:0 0 16px;">`
    + `Forwarded by Steadie. From: <b>${escHtml(sender)}</b> · To: ${escHtml(recipients)}`
    + (droppedNote ? `<br><b style="color:#B4532C">${escHtml(droppedNote)}</b>` : "") + `</div>`;
  const bodyHtml = email.html ?? (email.text ? `<pre style="white-space:pre-wrap;font:14px/1.5 -apple-system,Segoe UI,Roboto,Arial,sans-serif">${escHtml(email.text)}</pre>` : "");

  await api("/emails", {
    method: "POST",
    idempotencyKey: `steadie-inbound-${emailId}`,
    body: {
      from: `"${displayName(sender) || "Someone"} via Steadie" <${fromAddress()}>`,
      to: [to],
      reply_to: email.reply_to?.length ? email.reply_to : [email.from],
      subject: email.subject?.trim() || "(no subject)",
      html: bannerHtml + bodyHtml,
      text: `${bannerText}\n\n${email.text ?? ""}`,
      headers: { [LOOP_HEADER]: "1" },
      ...(attachments.length ? { attachments } : {}),
    },
  });
  return { status: "forwarded", note: droppedNote || undefined };
}

// ---- Record and alerts ----

/** One row per received email: whether it reached the inbox, and whether we've already sent an alert about it. Only
 *  the sender, subject and error are kept, for 90 days, so the watchdog and alerts can say which email it was. */
async function rows() {
  await ensureExtraTables();
  return getDb();
}

/** Sends an alert to INBOUND_ALERT_TO. Never throws: if even this fails, it goes to the Vercel logs. */
export async function sendAlert(subject: string, lines: string[], idempotencyKey?: string) {
  const to = alertTo();
  if (!to) { console.error(`inbound: ${subject} (no INBOUND_ALERT_TO or INBOUND_FORWARD_TO to tell)`, lines); return false; }
  try {
    await api("/emails", {
      method: "POST",
      ...(idempotencyKey ? { idempotencyKey } : {}),
      body: {
        from: `"Steadie mail monitor" <${fromAddress()}>`,
        to: [to],
        subject: `⚠️ ${subject}`,
        text: lines.join("\n\n"),
        html: lines.map((l) => `<p style="font:14px/1.5 -apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#2A2530">${escHtml(l)}</p>`).join(""),
        headers: { [LOOP_HEADER]: "1" },
      },
    });
    return true;
  } catch (e) {
    console.error(`inbound: couldn't send the alert "${subject}"`, e, lines);
    return false;
  }
}

type Meta = { from?: string | null; subject?: string | null; receivedAt?: string | null };

/** Forwards one email and records the outcome. On failure it alerts (once per email) and rethrows, so the webhook
 *  returns an error and Resend retries. When an email that was alerted about gets through later, says so. */
export async function forwardAndRecord(emailId: string, meta: Meta = {}, source: "webhook" | "watchdog" = "webhook") {
  const db = await rows();
  await db.execute(sql`INSERT INTO inbound_emails (email_id, received_at, from_addr, subject, status, attempts)
    VALUES (${emailId}, ${meta.receivedAt ?? new Date().toISOString()}, ${meta.from?.slice(0, 300) ?? null}, ${meta.subject?.slice(0, 300) ?? null}, 'pending', 1)
    ON CONFLICT (email_id) DO UPDATE SET attempts = inbound_emails.attempts + 1, updated_at = now()`);
  try {
    const result = await forwardEmail(emailId);
    const done = await db.execute(sql`UPDATE inbound_emails SET status = ${result.status}, last_error = ${result.note ?? null}, forwarded_at = now(), updated_at = now()
      WHERE email_id = ${emailId} RETURNING alerted_at`);
    const wasAlerted = (done as unknown as { rows?: { alerted_at: unknown }[] }).rows?.[0]?.alerted_at;
    if (result.note) {
      await alertOnce(emailId, "An email was forwarded without its attachments", [
        `From ${meta.from ?? "unknown"}: "${meta.subject ?? "(no subject)"}".`, result.note]);
    } else if (wasAlerted) {
      await sendAlert("Resolved: a held email has now been forwarded", [`From ${meta.from ?? "unknown"}: "${meta.subject ?? "(no subject)"}". It reached your inbox on a later attempt (${source}).`], `steadie-inbound-resolved-${emailId}`);
    }
    return result;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    await db.execute(sql`UPDATE inbound_emails SET status = 'failed', last_error = ${message.slice(0, 1000)}, updated_at = now() WHERE email_id = ${emailId}`);
    await alertOnce(emailId, "An email to getsteadieapp.com couldn't be forwarded", [
      `From ${meta.from ?? "unknown"}: "${meta.subject ?? "(no subject)"}".`,
      `What went wrong: ${message}`,
      `It's safe in Resend (Emails → Receiving) and will keep being retried: Resend retries the webhook for a while, and the hourly check tries again for 7 days. You'll get another email when it gets through.`,
    ]);
    throw e;
  }
}

async function alertOnce(emailId: string, subject: string, lines: string[]) {
  const db = await rows();
  const claimed = await db.execute(sql`UPDATE inbound_emails SET alerted_at = now() WHERE email_id = ${emailId} AND alerted_at IS NULL RETURNING email_id`);
  if (!(claimed as unknown as { rows?: unknown[] }).rows?.length) return;
  const sent = await sendAlert(subject, lines, `steadie-inbound-alert-${emailId}`);
  if (!sent) await db.execute(sql`UPDATE inbound_emails SET alerted_at = NULL WHERE email_id = ${emailId}`);
}

// ---- Hourly watchdog ----

const WATCH_DAYS = 7;
/** Leave the webhook this long to do its job before the watchdog steps in. */
const GRACE_MINUTES = 15;

/** Lists the last week's received mail in Resend, forwards anything that never reached the inbox, and alerts about
 *  anything that still can't be. Also checks the settings are in place, and prunes rows older than 90 days. */
export async function watchdog() {
  const problems: string[] = [];
  if (!forwardTo()) problems.push("INBOUND_FORWARD_TO isn't set in Vercel, so incoming mail can't be forwarded.");
  if (!env("RESEND_INBOUND_SECRET")) problems.push("RESEND_INBOUND_SECRET isn't set in Vercel, so the webhook rejects every email (they're still in Resend, and the hourly check forwards them).");

  const since = Date.now() - WATCH_DAYS * 86400000;
  const received: { id: string; from: string; subject: string | null; created_at: string }[] = [];
  let after: string | undefined;
  for (let page = 0; page < 5; page++) {
    const res = await api<{ data: typeof received; has_more: boolean }>(`/emails/receiving?limit=100${after ? `&after=${after}` : ""}`);
    received.push(...res.data);
    const oldest = res.data[res.data.length - 1];
    if (!res.has_more || !oldest || Date.parse(oldest.created_at) < since) break;
    after = oldest.id;
  }

  const db = await rows();
  const settled = new Set(((await db.execute(sql`SELECT email_id FROM inbound_emails WHERE status IN ('forwarded', 'skipped') AND received_at > now() - interval '8 days'`)) as unknown as { rows: { email_id: string }[] }).rows.map((r) => r.email_id));
  const due = received.filter((r) => {
    const t = Date.parse(r.created_at);
    return t >= since && t < Date.now() - GRACE_MINUTES * 60000 && !settled.has(r.id);
  });

  let forwarded = 0;
  const failed: string[] = [];
  for (const r of due) {
    try {
      await forwardAndRecord(r.id, { from: r.from, subject: r.subject, receivedAt: r.created_at }, "watchdog");
      forwarded++;
    } catch (e) {
      failed.push(`${r.from} "${r.subject ?? "(no subject)"}": ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  // Anything the webhook had never recorded at all means the webhook isn't reaching us: worth knowing even if the
  // watchdog then forwarded it fine.
  if (failed.length) problems.push(`${failed.length} email${failed.length === 1 ? " is" : "s are"} still stuck and will be retried within the hour:`, ...failed);
  if (forwarded) problems.push(`${forwarded} email${forwarded === 1 ? "" : "s"} hadn't been forwarded by the webhook and ${forwarded === 1 ? "was" : "were"} forwarded by the hourly check instead. If this keeps happening, check the webhook in Resend → Webhooks (it should point at /api/inbound and be enabled).`);

  await db.execute(sql`DELETE FROM inbound_emails WHERE received_at < now() - interval '90 days'`);

  if (problems.length) {
    // At most one alert a day for the same problem; a different problem alerts straight away.
    const day = new Date().toISOString().slice(0, 10);
    const digest = createHash("sha256").update(problems.join("|")).digest("hex").slice(0, 16);
    await sendAlert("Steadie inbox: the mail check found a problem", problems, `steadie-inbound-watchdog-${day}-${digest}`);
  }
  return { checked: received.length, due: due.length, forwarded, failed, problems };
}
