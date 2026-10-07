# @landing/motion

The exercise loops. Six people, the movement cast, demonstrate 80 exercises (every level of the 12 movement
patterns plus the seated versions). Each person is drawn from the brand's shapes: tapered pill limbs, a soft torso
with a real profile, and a round head in profile with no eyes or mouth. Any of them can do any exercise, because
the exercises are keyframes for a skeleton and the cast is drawn on top. Open [gallery.html](gallery.html) to see
every loop with any of the cast.

| Person | Age | Build | Detail |
| --- | --- | --- | --- |
| Maya | 38 | Mid | Bun with a hair tie, apricot tee |
| Dev | 52 | Full | Short hair and a beard, sage tee, watch |
| Sue | 63 | Full | Grey crop, glasses, lilac tee |
| Amira | 44 | Mid | Hijab, long sleeves in butter yellow |
| Tom | 47 | Slim | Receding auburn hair, sky tee, watch |
| Grace | 57 | Fuller | Natural hair with a headband, rose tee |

Names and ages are briefs for the illustration and copy, not real people. The designs live on the "Steadie movement
cast" canvas in Claude Design.

```
src/rig.ts        The skeleton: pose targets, two-bone IK for elbows and knees, blending and timing
src/poses.ts      Pose builders: standing, sitting, lying, kneeling, plank lines, press-ups, walking
src/cast.ts       The six people: body shapes, skin, hair, kit, and drawing them on a skeleton
src/scene.ts      Props (chair, counter, bands, weights, machines) and the full frame, back to front
src/exercises.ts  The library: name, level, equipment, cue, props and keyframes for each exercise
src/browser.ts    window.LandingMotion for web pages: mount(), stillSvg(), portraitSvg(), mixFor()
src/svg.ts        Self-contained animated or still SVG for one exercise and one person
dist/             Generated: landing-motion.js (the browser bundle, about 45 KB)
svg/index.json    Generated: the catalogue of exercises, patterns and cast
```

## Commands

```sh
pnpm motion                                   # rebuild dist/, svg/index.json and gallery.html (from the repo root)
pnpm --filter @landing/motion contact         # contact sheet of every loop at 4 moments, for checking poses
pnpm --filter @landing/motion matrix          # every exercise with every person, to check by eye
pnpm --filter @landing/motion check           # CI: every exercise works for every person, generated files up to date
```

Node 22.18 or later runs the TypeScript directly; esbuild builds the browser bundle.

## Every exercise, every person

No exercise belongs to one body. The exercises are keyframes for a skeleton and the cast is drawn on top, so all 80
work with all six people, and "Mix it up" can give anyone any session. Bodies lying down rest on the floor whatever
their size, and props worn against the back (a backpack, a broom handle) sit at each person's own back.
`scripts/check-cast.ts` samples every loop for every person and fails CI if anything can't be drawn or goes through
the floor; `pnpm --filter @landing/motion matrix` renders the full grid to look at.

## Who shows the moves

People choose during sign-up and can change it in Settings → Exercise demos. The default is **Mix it up**: each
session gets its own person, picked by `mixFor(sessionKey)`, so it stays the same whenever that session is opened.
Settings also has **Still pictures** (the start and end positions instead of a loop) and **Starting outline** (a
faint outline of where the move begins). Reduce Motion always shows still frames.

## Where the loops are used

- **Prototype:** `apps/prototype/scripts/motion.mjs` copies `dist/landing-motion.js` into `src/motion.js`;
  `src/demo.js` has the live animation, the thumbnails and the cast picker used in sign-up and settings.
- **Expo app:** `apps/mobile/src/components/ExerciseAnimation.tsx` draws the same frames with react-native-svg.
- **Web:** load `dist/landing-motion.js` and call `LandingMotion.mount(svgElement, { id, who })`.

## Adding an exercise

1. Add an `ex(...)` entry in `src/exercises.ts`: id `<pattern>-<level>`, name, equipment, one cue in the brand's voice
   (UK English, sentence case, calm), props, and two to five keys built from the helpers in `poses.ts`.
2. Run `pnpm --filter @landing/motion contact` and check the sheet: knees bend the right way, feet stay on the floor,
   hands reach what they hold. The sheet cycles through the cast, so every body gets checked.
3. Run `pnpm motion` and commit `dist/`, `svg/` and `gallery.html` with the change.

Coordinates are a 240 × 200 box, y down, the figure facing right; the floor's top edge is at y = 186. A pose sets the
hips, the torso angle (0 upright, 90 face down, −90 on the back) and where the hands and ankles go; elbows and knees
follow. Pin a knee or elbow with `kneeAt` or `elbowAt` when it rests on something.

The physio reviews every loop alongside its cues before it ships (see docs/plan-movement-food-shopping.md).
