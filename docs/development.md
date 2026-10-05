# Working on Landing

## Setup

You need Node 22 (see `.nvmrc`) and pnpm 10 (`corepack enable` picks the version in `package.json`).

```sh
pnpm install
```

`.npmrc` sets `node-linker=hoisted`: React Native and Metro expect a flat `node_modules`, so the workspace installs
the way npm would.

## Running things

| Command | What it does |
| --- | --- |
| `pnpm dev` | The waitlist site at http://localhost:3000 |
| `pnpm dev:prototype` | Serves the repo; open http://localhost:3001/apps/prototype/ |
| `pnpm dev:mobile` | Starts Expo. Press `i` for the iOS simulator, or scan the QR code with Expo Go |
| `pnpm tokens` | Regenerates `tokens.css`, `tokens.ts` and the component preview from `tokens.json` |
| `pnpm check` | Lint, typecheck and build everything, as CI does |

Copy `apps/web/.env.example` to `apps/web/.env.local` and `apps/mobile/.env.example` to `apps/mobile/.env` before
running the apps.

## How the pieces fit

- **`packages/design-system`** is the source of truth for the brand. Edit `tokens.json`, then run `pnpm tokens`.
  - The web app imports `tokens.css`.
  - The prototype links `tokens.css` and the reference components in `components/`.
  - The Expo app imports `tokens.ts` (`@landing/design-system/tokens`), which has the same values as plain numbers
    and hex colours, because React Native has no CSS variables.
- **`designs/app-screens`** holds the 55 screen designs as PNGs and source files. They are the visual reference.
- **`apps/prototype`** is the clickable version of those designs with dummy data. Use it to agree flows and copy
  before building them in Expo.
- **`apps/mobile`** is the real app. Today is ported as the first screen; the other tabs list the designs still to
  port. Build screens from the components in `src/components` and the theme in `src/theme`.
- **`apps/web`** is the public waitlist site.

## Upgrading Expo

Expo pins React, React Native and its own packages to each SDK, and the web app shares React with it.
To move SDK, run `npx expo install expo@^<next> --fix` in `apps/mobile`, then set `react`, `react-dom` and
`@types/react` in `apps/web/package.json` to the same versions, and run `pnpm install` and `pnpm check`.
Dependabot skips these packages for that reason.
