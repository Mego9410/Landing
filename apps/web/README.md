# Steadie website

Next.js (App Router) site at the root of the Steadie domain: the brand, the plan in three phases, App Store download
links, the guides, the legal pages and the app's account API. Colours, type and spacing come from `@landing/design-system/tokens.css`, so it follows the brand and the
device's dark mode.

- `app/home.tsx` and `app/page.module.css`: the home page, in two versions: `app/page.tsx` (UK, at `/`) and
  `app/us/page.tsx` (US, at `/us`: "shot", doctor, US prices, the US App Store). `proxy.ts` sends a first-time visitor
  in the US to `/us` and anyone else to `/`, using Vercel's country header; search engines are never redirected, and
  hreflang tells Google which page is for which country. The footer's "UK · US" switcher (`app/region/route.ts`) sets
  the `steadie_region` cookie, which then wins over location.
- `app/us/consumer-health-data/page.tsx`: the US consumer health data notice Washington's My Health My Data Act asks
  for, linked from every footer (text in `packages/content/src/legal.ts`; keep it in step with the app privacy policy)
- `app/app-store.tsx`: the "Download on the App Store" button (links to `APP_STORE_URL` in `app/site.ts`)
- `app/privacy/page.tsx`: the website privacy notice (text in `packages/content/src/legal.ts`). The `waitlist` table
  still holds pre-launch sign-ups: email them once at launch, then delete it within 6 months, as the notice says.
- `prelaunch.json`: `showPrototype: true` adds a floating **Preview the app** button and publishes the prototype
  at `/prototype` (copied in by `scripts/copy-prototype.mjs` at build time). **Set it to `false` before going live.**
- `public/screens/`: app screens for the hero phone and the "Inside the app" fan (780 px wide WebP), and
  `public/og.png`, the social card

Run it with `pnpm dev` from the repo root. Deploying: [docs/deployment.md](../../docs/deployment.md).
