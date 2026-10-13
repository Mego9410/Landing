import { NextResponse, type NextRequest } from "next/server";
import { HOME, REGION_COOKIE, type Region } from "../site";

// The footer's "UK · US" switcher: /region?to=us or /region?to=uk. It remembers the choice for a year in one cookie
// holding just "uk" or "us", so proxy.ts stops sending this person by country, then opens that home page. This is the
// only cookie the website sets, and only when someone asks for it (see the website privacy notice).
export function GET(request: NextRequest) {
  const to = request.nextUrl.searchParams.get("to");
  const region: Region = to === "us" ? "us" : "uk";
  const res = NextResponse.redirect(new URL(HOME[region], request.url), 303);
  res.cookies.set(REGION_COOKIE, region, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.headers.set("Cache-Control", "private, no-store");
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}
