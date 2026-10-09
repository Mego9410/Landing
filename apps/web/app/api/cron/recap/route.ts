import { londonToday } from "@/content/guides";
import { sendRecaps } from "@/lib/recap";

// The weekly recap, Sunday at 6pm UK time. Vercel Cron runs in UTC, so vercel.json calls this at 17:00 and 18:00 UTC
// on Sundays and only the run that falls in London's 6pm hour sends (17:00 UTC in summer, 18:00 UTC in winter).
// Called with "Authorization: Bearer $CRON_SECRET". With that header, ?dry=1 says how many would get one now.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get("authorization")?.trim() !== `Bearer ${secret}`) {
    console.warn("recap cron: not allowed (CRON_SECRET missing or doesn't match)");
    return Response.json({ error: "Not allowed." }, { status: 401 });
  }
  const now = new Date(), today = londonToday(now);
  const hour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", hourCycle: "h23" }).format(now));
  const sunday = new Date(`${today}T12:00:00Z`).getUTCDay() === 0;
  const dry = new URL(request.url).searchParams.has("dry");
  if (!dry && (!sunday || hour !== 18)) return Response.json({ today, hour, sending: false, reason: "Only sends on Sundays in London's 6pm hour." });
  if (!dry && !process.env.RESEND_API_KEY) return Response.json({ error: "RESEND_API_KEY isn't set." }, { status: 503 });
  const result = await sendRecaps(today, !dry);
  console.info(`recap cron: ${JSON.stringify(result)}`);
  return Response.json({ today, dry, ...result });
}
