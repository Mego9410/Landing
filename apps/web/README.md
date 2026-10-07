# Steadie website

Next.js (App Router) site at the root of the Steadie domain: the brand, the plan in three phases, App Store download
links, the guides, the legal pages and the app's account API. Colours, type and spacing come from `@landing/design-system/tokens.css`, so it follows the brand and the
device's dark mode.

- `app/page.tsx` and `app/page.module.css`: the page
- `app/app-store.tsx`: the "Download on the App Store" button (links to `APP_STORE_URL` in `app/site.ts`)
- `app/privacy/page.tsx`: the website privacy notice (text in `packages/content/src/legal.ts`). The `waitlist` table
  still holds pre-launch sign-ups: email them once at launch, then delete it within 6 months, as the notice says.
- `prelaunch.json`: `showPrototype: true` adds a floating **Preview the app** button and publishes the prototype
  at `/prototype` (copied in by `scripts/copy-prototype.mjs` at build time). **Set it to `false` before going live.**
- `public/today.png` and `public/og.png`: the hero screen and the social card, rendered from the designs

Run it with `pnpm dev` from the repo root. Deploying: [docs/deployment.md](../../docs/deployment.md).
