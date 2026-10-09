import { revalidatePath } from "next/cache";
import { ALL_GUIDES, guideBySlug, londonToday } from "@/content/guides";
import { broadcastNames, digestEmail, guideEmail, hasSubscribers, sendOnce, type Email } from "@/lib/newsletter";

// The daily guides job, run by Vercel Cron (vercel.json) every morning. It refreshes the site so any guide due today
// is live, emails each guide published in the last few days that hasn't gone out yet, and on Sundays sends the weekly
// digest. Emails only send when GUIDE_EMAILS is "on" (or true/yes/1); until then it reports what it would have sent.
//
// Vercel calls it with "Authorization: Bearer $CRON_SECRET". With the same header you can also open:
//   /api/cron/guides?dry=1                 what would send today, without sending
//   /api/cron/guides?preview=<slug>        a guide's email, as HTML
//   /api/cron/guides?preview=digest        this Sunday's digest, as HTML
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** How far back to look for guides whose email hasn't gone out, in case a day's run was missed. */
const CATCH_UP_DAYS = 3;

export async function GET(request: Request) {
  // Trimmed, so a stray space or newline pasted into Vercel doesn't lock the job out.
  const secret = process.env.CRON_SECRET?.trim();
  const auth = request.headers.get("authorization")?.trim();
  if (!secret || auth !== `Bearer ${secret}`) {
    // Says why in the logs, never the secret itself.
    console.warn(!secret ? "guides cron: CRON_SECRET isn't set on this deployment (add it, then redeploy)"
      : !auth ? "guides cron: no Authorization header (Vercel only sends one when CRON_SECRET is set for this environment)"
      : "guides cron: Authorization header doesn't match CRON_SECRET");
    return Response.json({ error: "Not allowed." }, { status: 401 });
  }

  const url = new URL(request.url);
  const today = url.searchParams.get("date") && url.searchParams.has("dry") ? url.searchParams.get("date")! : londonToday();

  const preview = url.searchParams.get("preview");
  if (preview) {
    const g = guideBySlug(preview);
    const email = preview === "digest" ? digestEmail(today) : g ? guideEmail(g) : null;
    if (!email) return Response.json({ error: "No such guide." }, { status: 404 });
    return new Response(email.html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  }

  // Pages refresh hourly anyway; this makes today's guide appear straight away.
  revalidatePath("/", "layout");

  const since = new Date(Date.parse(today + "T12:00:00Z") - CATCH_UP_DAYS * 86400000).toISOString().slice(0, 10);
  const emails: Email[] = ALL_GUIDES.filter((g) => g.published > since && g.published <= today).map(guideEmail);
  const sunday = new Date(today + "T12:00:00Z").getUTCDay() === 0;
  if (sunday) emails.push(digestEmail(today));

  // "on", "true", "yes" or "1", in any case: anything else means report only.
  const switchedOn = ["on", "true", "yes", "1"].includes((process.env.GUIDE_EMAILS ?? "").trim().toLowerCase());
  const live = switchedOn && !url.searchParams.has("dry");
  if (!live) {
    if (!switchedOn) console.info(`guides cron: GUIDE_EMAILS is ${process.env.GUIDE_EMAILS ? `"${process.env.GUIDE_EMAILS}"` : "not set"}, so nothing was sent`);
    return Response.json({ today, sending: false, wouldSend: emails.map((e) => ({ name: e.name, subject: e.subject })) });
  }

  // Nobody has opted in yet (or everyone has unsubscribed): nothing to send, and not an error. Guides from the last few
  // days still go out on a later run once someone subscribes.
  if (!emails.length || !(await hasSubscribers())) return Response.json({ today, sending: true, sent: [], note: emails.length ? "No subscribers yet, so nothing was sent." : "Nothing due today." });

  const existing = await broadcastNames();
  const sent: string[] = [], skipped: string[] = [];
  for (const e of emails) ((await sendOnce(e, existing)) ? sent : skipped).push(e.name);
  return Response.json({ today, sending: true, sent, alreadySent: skipped });
}
