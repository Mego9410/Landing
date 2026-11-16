// IndexNow: tells Bing (which feeds Copilot and ChatGPT search), Yandex, Seznam and others that pages have changed, so
// they re-crawl within hours instead of waiting. The key is public by design: it's also served at /<key>.txt so the
// engines can check the request came from this site.
import { SITE_URL } from "@/app/site";

export const INDEXNOW_KEY = "1f713f5a1d64b4d4aaa5869994029791";

/** Sends site paths ("/guides/…") to IndexNow. Only on the live site, and never throws. */
export async function pingIndexNow(paths: string[]) {
  if (!paths.length || process.env.VERCEL_ENV !== "production") return { sent: 0 };
  const host = new URL(SITE_URL).host;
  const body = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: [...new Set(paths)].map((p) => `${SITE_URL}${p}`),
  };
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
    if (!res.ok && res.status !== 202) console.warn(`indexnow: ${res.status} for ${body.urlList.length} URLs`);
    return { sent: body.urlList.length, status: res.status };
  } catch (e) {
    console.warn("indexnow: request failed", e);
    return { sent: 0 };
  }
}
