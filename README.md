# Landing

## Design system

The Landing brand lives in [`design-system/`](design-system/), imported from the
[Landing design system artifact](https://claude.ai/artifact/SEV6vLBwGSNQc7iw6bVPs2).

- [`design-system/README.md`](design-system/README.md): the brand book (voice, colour, type, shape, imagery, logo).
- `tokens.json`: source of truth for colours (light and dark), type, spacing, radius and shadow.
- `tokens.css`: CSS custom properties generated from `tokens.json`.
- `assets/Logos`, `assets/Icons`: the SVG logos and the 24px line icon set.
- `components/`: the ten v1 React 18 components (`bundle.js` sets `window.Landing`, styled by `bundle.css`, typed by `index.d.ts`), with a README and preview for each.
- `preview.html`: a gallery of every component. Open it in a browser.

After editing `tokens.json` or a component preview, run `node design-system/build.mjs` to regenerate `tokens.css` and `preview.html`.

## App screens

[`designs/app-screens/`](designs/app-screens/) holds the 55 iPhone screen designs (onboarding, paywall,
Today, workouts, plan, progress, coach, settings and shared states), imported from the
[Landing App Screens canvas](https://claude.ai/artifact/7QFUpd1hnCxoRoH7HG12V2). Open
`designs/app-screens/index.html` to browse PNG renders of every screen; each screen's source is in `screens/`.
