# Steadie

**Keep what you've worked for.** Steadie helps people keep weight off in the year after they stop a GLP-1 jab:
a 12-month habit plan, a weekly steady score, short strength sessions and a coach, built to feel calm and on
their side.

## What's in this repository

```
apps/
  web/          Waitlist site (Next.js) → Vercel
  prototype/    Clickable HTML prototype of the whole app, with dummy data and a test panel → Vercel
  mobile/       The iPhone app (Expo, Expo Router) → EAS Build and the App Store
packages/
  design-system/  Brand guidelines, tokens, logos, icons and reference components, shared by all three apps
  motion/         The movement cast and 80 illustrated exercise loops, for the prototype, the app and the web
designs/
  app-screens/  The 55 screen designs as PNGs and source files
docs/
  development.md  Setup, commands and how the pieces fit
  deployment.md   Vercel, domains, EAS and branch rules
  plan-movement-food-shopping.md  Plan for strength sessions, easy meals and supermarket baskets
  plan-app-store-launch.md  What's left to build, decide and sign off to launch on the App Store
  seo.md          Guides, structured data and search: what's in place and what to do at launch
  research/       The research behind it: movement, food, supermarkets
.github/        CI, pull request template, Dependabot
```

## Quick start

```sh
corepack enable        # uses the pnpm version pinned in package.json
pnpm install
pnpm dev               # waitlist site on http://localhost:3000
pnpm dev:prototype     # prototype on http://localhost:3001/apps/prototype/
pnpm dev:mobile        # Expo; press i for the iOS simulator
pnpm check             # lint, typecheck and build everything, as CI does
```

Node 22 and pnpm 10. More in [docs/development.md](docs/development.md).

## Deploying

The waitlist site and the prototype are two Vercel projects pointing at `apps/web` and `apps/prototype`; the app
ships through EAS. Step by step in [docs/deployment.md](docs/deployment.md).

## The brand

Start with [packages/design-system/README.md](packages/design-system/README.md): voice and copy rules, colour,
type, shape, imagery and the logo. Colours, type and spacing live in `packages/design-system/tokens.json`; run
`pnpm tokens` after changing it, and every app picks the change up. The design system and the screens were imported
from the [Steadie design system](https://claude.ai/artifact/SEV6vLBwGSNQc7iw6bVPs2) and the
[Steadie App Screens canvas](https://claude.ai/artifact/7QFUpd1hnCxoRoH7HG12V2).

Steadie is a general wellness app. It never gives advice about medication, doses or stopping treatment.
