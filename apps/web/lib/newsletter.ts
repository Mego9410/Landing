// Guide emails, sent through Resend (https://resend.com). People who ask for them in the app become contacts in one
// Resend segment, "Steadie guides". Each new guide goes out as a Resend broadcast on its publish day, and a weekly
// digest goes out on Sundays. Resend handles unsubscribes: every email carries its one-click unsubscribe link, and an
// unsubscribed contact gets nothing more. Broadcast names ("guide:<slug>", "digest:<date>") make sending idempotent:
// a name that already exists in Resend is never sent again.
//
// Env: RESEND_API_KEY (already used for sign-in codes), GUIDE_EMAILS="on" to actually send, optionally
// RESEND_SEGMENT_ID (otherwise the segment is found or created by name), GUIDE_EMAIL_FROM and EMAIL_REPLY_TO.
import { ALL_GUIDES, latestGuides, type Guide } from "@/content/guides";
import { ORG_NAME, SITE_URL } from "@/app/site";

const API = "https://api.resend.com";
const SEGMENT_NAME = "Steadie guides";

export class ResendError extends Error {}

export async function resend<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new ResendError("RESEND_API_KEY isn't set.");
  const res = await fetch(API + path, {
    method: init.method ?? "GET",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store",
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw Object.assign(new ResendError(`Resend ${init.method ?? "GET"} ${path}: ${res.status} ${data?.message ?? text}`), { status: res.status });
  return data as T;
}

const statusOf = (e: unknown) => (e as { status?: number })?.status;

let segmentCache: string | undefined;
/** The "Steadie guides" segment's id: from RESEND_SEGMENT_ID, or found by name, or created. */
export async function segmentId() {
  if (process.env.RESEND_SEGMENT_ID) return process.env.RESEND_SEGMENT_ID;
  if (segmentCache) return segmentCache;
  const list = await resend<{ data: { id: string; name: string }[] }>("/segments");
  const found = list.data.find((s) => s.name === SEGMENT_NAME);
  segmentCache = found?.id ?? (await resend<{ id: string }>("/segments", { method: "POST", body: { name: SEGMENT_NAME } })).id;
  return segmentCache;
}

/** Whether this email address gets guide emails. */
export async function wantsGuides(email: string) {
  try {
    const c = await resend<{ unsubscribed: boolean }>(`/contacts/${encodeURIComponent(email)}`);
    return !c.unsubscribed;
  } catch (e) {
    if (statusOf(e) === 404) return false;
    throw e;
  }
}

/** Turn guide emails on or off for an address. Turning them on adds the contact to the segment. */
export async function setWantsGuides(email: string, on: boolean, firstName?: string) {
  const id = await segmentId();
  try {
    await resend("/contacts", { method: "POST", body: { email, unsubscribed: !on, first_name: firstName || undefined, segments: [{ id }] } });
    return;
  } catch (e) {
    const status = statusOf(e);
    if (status !== 409 && status !== 422 && status !== 400) throw e;
  }
  // Already a contact: update it, and make sure it's in the segment.
  await resend(`/contacts/${encodeURIComponent(email)}`, { method: "PATCH", body: { unsubscribed: !on } });
  if (on) await resend(`/contacts/${encodeURIComponent(email)}/segments/${id}`, { method: "POST" }).catch((e) => { if (statusOf(e) !== 409) throw e; });
}

/** Remove an address from Resend altogether, for account deletion. */
export async function forgetContact(email: string) {
  await resend(`/contacts/${encodeURIComponent(email)}`, { method: "DELETE" }).catch((e) => { if (statusOf(e) !== 404) throw e; });
}

/** Whether anyone in the segment is still subscribed. Resend refuses to send a broadcast to an empty segment. */
export async function hasSubscribers() {
  const id = await segmentId();
  let after: string | undefined;
  for (let page = 0; page < 50; page++) {
    const res = await resend<{ data: { id: string; unsubscribed: boolean }[]; has_more: boolean }>(`/segments/${id}/contacts?limit=100${after ? `&after=${after}` : ""}`);
    if (res.data.some((c) => !c.unsubscribed)) return true;
    if (!res.has_more || !res.data.length) return false;
    after = res.data.at(-1)!.id;
  }
  return true;
}

/** Names of broadcasts already created, so nothing is sent twice. */
async function broadcastNames() {
  const names = new Set<string>();
  let after: string | undefined;
  for (let page = 0; page < 20; page++) {
    const res = await resend<{ data: { id: string; name: string | null }[]; has_more: boolean }>(`/broadcasts?limit=100${after ? `&after=${after}` : ""}`);
    for (const b of res.data) if (b.name) names.add(b.name);
    if (!res.has_more || !res.data.length) break;
    after = res.data.at(-1)!.id;
  }
  return names;
}

export interface Email { name: string; subject: string; previewText: string; html: string; text: string }

/** Create and send a broadcast to the segment, unless one with this name exists. Returns whether it was sent. */
export async function sendOnce(email: Email, existing?: Set<string>) {
  const names = existing ?? (await broadcastNames());
  if (names.has(email.name)) return false;
  await resend("/broadcasts", {
    method: "POST",
    body: {
      name: email.name,
      segment_id: await segmentId(),
      from: process.env.GUIDE_EMAIL_FROM || process.env.EMAIL_FROM || "Steadie <hello@getsteadieapp.com>",
      reply_to: process.env.EMAIL_REPLY_TO || undefined,
      subject: email.subject,
      preview_text: email.previewText,
      html: email.html,
      text: email.text,
      send: true,
    },
  });
  names.add(email.name);
  return true;
}
export { broadcastNames };

// ---- The emails ----

const esc = (s: string) => s.replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c]!);
/** Guide text uses [label](href) and **bold**; emails get plain text. */
const plain = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1");
const link = (g: Guide, campaign: string) => `${SITE_URL}/guides/${g.slug}?utm_source=email&utm_medium=email&utm_campaign=${campaign}`;
const UNSUBSCRIBE = "{{{RESEND_UNSUBSCRIBE_URL}}}";
/** The guide's illustration as a PNG (app/guides/[slug]/art.png). */
const artUrl = (g: Guide) => `${SITE_URL}/guides/${g.slug}/art.png`;

const C = { apricot: "#DE6F44", apricotInk: "#B4532C", cream: "#FBF1E4", oat: "#F5EFE6", ink: "#2A2530", muted: "#6A6371", line: "#E7DDD0" };
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

function shell(previewText: string, body: string) {
  return `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>Steadie</title></head>
<body style="margin:0;padding:0;background:${C.oat};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(previewText)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.oat};"><tr><td align="center" style="padding:28px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
<tr><td style="padding:0 4px 20px;"><a href="${SITE_URL}"><img src="${SITE_URL}/email/steadie-lockup.png" width="150" alt="Steadie" style="display:block;border:0;width:150px;height:auto;"></a></td></tr>
<tr><td style="background:#FFFFFF;border-radius:20px;padding:32px 28px;font-family:${FONT};color:${C.ink};">${body}</td></tr>
<tr><td style="padding:22px 8px 0;font-family:${FONT};font-size:12px;line-height:18px;color:${C.muted};">
You're getting this because you asked for Steadie guides by email. <a href="${UNSUBSCRIBE}" style="color:${C.muted};">Unsubscribe</a> any time, or turn guide emails off in the app's Settings.<br><br>
Steadie guides are general information, not medical advice. Steadie never gives advice about medicines, doses or stopping treatment: talk to your prescriber, GP or pharmacist.<br><br>
${esc(ORG_NAME)} · <a href="${SITE_URL}" style="color:${C.muted};">getsteadieapp.com</a> · <a href="${SITE_URL}/app-privacy" style="color:${C.muted};">Privacy</a>
</td></tr></table></td></tr></table></body></html>`;
}

const button = (href: string, label: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 4px;"><tr><td style="background:${C.ink};border-radius:999px;"><a href="${href}" style="display:inline-block;padding:14px 26px;font-family:${FONT};font-size:16px;font-weight:700;color:${C.cream};text-decoration:none;">${esc(label)}</a></td></tr></table>`;

const footerText = `\n\n---\nYou're getting this because you asked for Steadie guides by email. Unsubscribe: ${UNSUBSCRIBE}\nSteadie guides are general information, not medical advice. ${ORG_NAME} · ${SITE_URL}`;

/** The email for one new guide: its short version, then a link to read it all. */
export function guideEmail(g: Guide): Email {
  const href = link(g, `guide-${g.slug}`);
  const body = `<a href="${href}"><img src="${artUrl(g)}" width="504" alt="" style="display:block;width:100%;max-width:504px;height:auto;border:0;border-radius:14px;margin:0 0 22px;"></a>
<p style="margin:0 0 8px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${C.apricotInk};">New guide · ${esc(g.category)}</p>
<h1 style="margin:0 0 14px;font-size:26px;line-height:32px;font-weight:700;">${esc(g.title)}</h1>
<p style="margin:0 0 18px;font-size:16px;line-height:24px;color:${C.muted};">${esc(g.description)}</p>
<p style="margin:0 0 8px;font-size:15px;font-weight:700;">The short version</p>
<ul style="margin:0;padding-left:20px;font-size:16px;line-height:24px;">${g.summary.map((s) => `<li style="margin:0 0 8px;">${esc(plain(s))}</li>`).join("")}</ul>
${button(href, "Read the guide")}`;
  return {
    name: `guide:${g.slug}`,
    subject: g.title,
    previewText: g.description,
    html: shell(g.description, body),
    text: `New guide: ${g.title}\n\n${g.description}\n\nThe short version:\n${g.summary.map((s) => `- ${plain(s)}`).join("\n")}\n\nRead the guide: ${href}${footerText}`,
  };
}

/** Guides from the library for a week's digest: a different few each week, never this week's new ones. */
export function libraryPicks(today: string, exclude: Set<string>, count = 3) {
  const pool = ALL_GUIDES.filter((g) => g.published <= today && !exclude.has(g.slug));
  if (!pool.length) return [];
  const week = Math.floor(Date.parse(today + "T12:00:00Z") / (7 * 86400000));
  return Array.from({ length: Math.min(count, pool.length) }, (_, i) => pool[(week * count + i) % pool.length]);
}

/** Sunday's digest: the week's new guides, then a few from the library. */
export function digestEmail(today: string): Email {
  const weekAgo = new Date(Date.parse(today + "T12:00:00Z") - 6 * 86400000).toISOString().slice(0, 10);
  // At most three, newest first (the launch week alone had 22).
  const fresh = latestGuides(today).filter((g) => g.published >= weekAgo).slice(0, 3);
  const library = libraryPicks(today, new Set(fresh.map((g) => g.slug)));
  const campaign = `digest-${today}`;
  const card = (g: Guide) => `<tr><td width="132" valign="top" style="padding:14px 14px 14px 0;border-top:1px solid ${C.line};"><a href="${link(g, campaign)}"><img src="${artUrl(g)}" width="118" alt="" style="display:block;width:118px;height:auto;border:0;border-radius:10px;"></a></td>
<td valign="top" style="padding:14px 0;border-top:1px solid ${C.line};"><a href="${link(g, campaign)}" style="font-size:17px;line-height:23px;font-weight:700;color:${C.ink};text-decoration:none;">${esc(g.title)}</a><p style="margin:4px 0 0;font-size:15px;line-height:22px;color:${C.muted};">${esc(g.description)}</p></td></tr>`;
  const section = (title: string, list: Guide[]) => list.length
    ? `<p style="margin:22px 0 6px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${C.apricotInk};">${title}</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${list.map(card).join("")}</table>` : "";
  const intro = fresh.length ? `${fresh.length === 1 ? "One new guide" : `${fresh.length} new guides`} this week, and a few from the library you might have missed.` : "A few guides from the library you might have missed.";
  const body = `<h1 style="margin:0 0 10px;font-size:26px;line-height:32px;font-weight:700;">Your Sunday read</h1>
<p style="margin:0;font-size:16px;line-height:24px;color:${C.muted};">${intro}</p>
${section("New this week", fresh)}${section("From the library", library)}
${button(`${SITE_URL}/guides?utm_source=email&utm_medium=email&utm_campaign=${campaign}`, "See all guides")}`;
  const subject = fresh[0] ? `This week: ${fresh[0].title}` : "Your Sunday read from Steadie";
  const textList = (list: Guide[]) => list.map((g) => `- ${g.title}\n  ${link(g, campaign)}`).join("\n");
  return {
    name: `digest:${today}`,
    subject,
    previewText: intro,
    html: shell(intro, body),
    text: `Your Sunday read\n\n${intro}\n\n${fresh.length ? `New this week:\n${textList(fresh)}\n\n` : ""}From the library:\n${textList(library)}${footerText}`,
  };
}
