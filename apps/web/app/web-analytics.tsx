"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";

// Vercel Web Analytics: counts page views without cookies (visitors are a daily hash Vercel discards after 24 hours), so
// it runs for everyone, unlike Google Analytics, which waits for the cookie banner (see consent.tsx). Keep app/privacy
// (SITE_PRIVACY) in step with this.

// Only campaign tags are kept in the URLs we record, so a token or email in a link can never reach analytics.
const KEEP = /^(utm_[a-z]+|ref)$/;

function keepCampaignTags(event: BeforeSendEvent): BeforeSendEvent {
  const url = new URL(event.url);
  for (const key of [...url.searchParams.keys()]) if (!KEEP.test(key)) url.searchParams.delete(key);
  return { ...event, url: url.toString() };
}

export function WebAnalytics() {
  return <Analytics beforeSend={keepCampaignTags} />;
}
