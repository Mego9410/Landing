import { watchdog } from "@/lib/inbound";

// The daily mail check, run by Vercel Cron (vercel.json). It forwards anything received at getsteadieapp.com in the
// last week that never reached the inbox, and emails an alert if something's wrong (lib/inbound.ts). Vercel calls it
// with "Authorization: Bearer $CRON_SECRET"; with the same header you can run it by hand.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get("authorization")?.trim() !== `Bearer ${secret}`) {
    console.warn(!secret ? "inbound cron: CRON_SECRET isn't set on this deployment" : "inbound cron: Authorization header doesn't match CRON_SECRET");
    return Response.json({ error: "Not allowed." }, { status: 401 });
  }
  try {
    const result = await watchdog();
    return Response.json(result, { status: result.failed.length ? 500 : 200 });
  } catch (e) {
    // Most likely Resend itself is unreachable or the API key was changed: the alert email would fail too, so this
    // lands in Vercel's logs and the cron run shows as failed.
    console.error("inbound cron: the check itself failed", e);
    return Response.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
