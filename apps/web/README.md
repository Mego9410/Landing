# Landing waitlist site

Next.js (App Router) site at the root of the Landing domain: the brand, the plan in three phases and a waitlist
form. Colours, type and spacing come from `@landing/design-system/tokens.css`, so it follows the brand and the
device's dark mode.

- `app/page.tsx` and `app/page.module.css`: the page
- `app/waitlist-form.tsx`: the form (client component)
- `app/api/waitlist/route.ts`: validates sign-ups. **It stores nothing yet**: plug a provider into `saveSignup()`.
- `app/privacy/page.tsx`: placeholder privacy notice; fill in the bracketed details before launch
- `prelaunch.json`: `showPrototype: true` adds a floating **Preview the app** button and publishes the prototype
  at `/prototype` (copied in by `scripts/copy-prototype.mjs` at build time). **Set it to `false` before going live.**
- `public/today.png` and `public/og.png`: the hero screen and the social card, rendered from the designs

Run it with `pnpm dev` from the repo root. Deploying: [docs/deployment.md](../../docs/deployment.md).
