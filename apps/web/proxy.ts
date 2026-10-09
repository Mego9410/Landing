import { NextResponse, type NextRequest } from "next/server";

// CORS for the app's account API, so the web build of the app (which runs on another origin) can sign in and back up.
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

export function proxy(request: NextRequest) {
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

export const config = { matcher: ["/api/auth/:path*", "/api/sync", "/api/account", "/api/account/emails", "/api/account/recap", "/api/events", "/api/feedback"] };
