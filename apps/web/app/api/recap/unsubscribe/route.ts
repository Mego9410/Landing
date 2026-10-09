import { setWantsRecap, validUnsubscribe } from "@/lib/recap";

// The unsubscribe link in every weekly recap. GET (someone clicking it) turns the recap off and says so; POST is the
// one-click unsubscribe mail apps send from the List-Unsubscribe header. The link is signed, so it only works for the
// person it was sent to.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const page = (title: string, text: string, status = 200) => new Response(
  `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;background:#F5EFE6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#2A2530">
<main style="max-width:480px;margin:12vh auto;padding:32px 28px;background:#fff;border-radius:20px"><h1 style="font-size:24px;margin:0 0 12px">${title}</h1>
<p style="font-size:16px;line-height:24px;margin:0 0 16px">${text}</p><p style="margin:0"><a href="/" style="color:#B4532C;font-weight:700">Back to Steadie</a></p></main></body></html>`,
  { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });

async function unsubscribe(request: Request) {
  const url = new URL(request.url);
  const u = url.searchParams.get("u") ?? "", t = url.searchParams.get("t") ?? "";
  if (!validUnsubscribe(u, t)) return null;
  await setWantsRecap(u, false);
  return true;
}

export async function GET(request: Request) {
  const ok = await unsubscribe(request).catch((e) => { console.error("recap unsubscribe", e); return false; });
  if (ok === null) return page("That link didn't work", "It may have been copied only in part. You can turn the weekly recap off in the app: Settings, then Account.", 400);
  if (!ok) return page("Something went wrong", "We couldn't update your settings just now. Try the link again in a minute, or turn the recap off in the app's Settings.", 500);
  return page("You're unsubscribed", "You won't get the weekly recap any more. You can turn it back on in the app's Settings whenever you like.");
}

export async function POST(request: Request) {
  const ok = await unsubscribe(request).catch(() => false);
  return new Response(null, { status: ok ? 200 : ok === null ? 400 : 500 });
}
