import { NextResponse, type NextRequest } from "next/server";

// Two jobs, by path:
// 1. The home pages (/ and /us): send a visitor to the version for where they are.
// 2. The app's account API: CORS, so the web build of the app (which runs on another origin) can sign in and back up.

// ── 1. UK or US home page ──────────────────────────────────────────────────────────────────────────────────────────
// Vercel adds the visitor's country (from their IP address) to every request; nothing is stored. A visitor in the US
// who lands on / goes to /us, and anyone else who lands on /us goes to /. Someone who has picked a version with the
// footer switcher (app/region/route.ts) has the steadie_region cookie, and that choice wins. Search engines are never
// redirected, so Google indexes both pages (hreflang tells it which is for which country); without a country header
// (local development) nothing happens.
const REGION_COOKIE = "steadie_region"; // matches app/site.ts (proxy keeps no shared imports)
const BOT = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|preview|lighthouse|headless/i;

function regionRedirect(request: NextRequest): NextResponse | null {
  if (request.method !== "GET" && request.method !== "HEAD") return null;
  if (BOT.test(request.headers.get("user-agent") ?? "")) return null;
  const path = request.nextUrl.pathname.replace(/\/$/, "") || "/";
  if (path !== "/" && path !== "/us") return null;

  const chosen = request.cookies.get(REGION_COOKIE)?.value;
  const country = request.headers.get("x-vercel-ip-country");
  const want = chosen === "us" || chosen === "uk" ? chosen : country ? (country.toUpperCase() === "US" ? "us" : "uk") : null;
  if (!want) return null;

  const target = want === "us" ? "/us" : "/";
  if (path === target) return null;
  const url = request.nextUrl.clone();
  url.pathname = target; // keeps the query string (utm_ tags and the like)
  const res = NextResponse.redirect(url, 307);
  res.headers.set("Cache-Control", "private, no-store"); // a redirect for one country must never be cached for everyone
  return res;
}

// ── 2. CORS for the account API ────────────────────────────────────────────────────────────────────────────────────
// The iPhone app isn't a browser and doesn't need this. Extra origins, such as a hosted preview, go in APP_WEB_ORIGINS.
const ALLOWED = [
  ...(process.env.APP_WEB_ORIGINS ?? "").split(",").map((o) => o.trim()).filter(Boolean),
  ...(process.env.VERCEL ? [] : ["http://localhost:8081", "http://localhost:8765"]),
];
const HEADERS = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Expose-Headers": "set-auth-token",
  "Access-Control-Max-Age": "600",
};

function cors(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "";
  const allowed = ALLOWED.includes(origin);
  const response = request.method === "OPTIONS" ? new NextResponse(null, { status: 204 }) : NextResponse.next();
  if (allowed) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Vary", "Origin");
    for (const [k, v] of Object.entries(HEADERS)) response.headers.set(k, v);
  }
  return response;
}

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) return cors(request);
  return regionRedirect(request) ?? NextResponse.next();
}

export const config = {
  matcher: ["/", "/us", "/api/auth/:path*", "/api/sync", "/api/account", "/api/account/emails", "/api/account/recap", "/api/events", "/api/feedback"],
};
