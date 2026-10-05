# @landing/motion

The exercise loops: a side-on Landing figure built from the brand's shapes (pill limbs, a sun-disc head, no face),
posed by keyframes, with simple props. 80 loops cover every level of the 12 movement patterns plus the seated
versions. Open [gallery.html](gallery.html) to see them all.

```
src/rig.ts        The figure: pose targets, two-bone IK for elbows and knees, blending and timing
src/poses.ts      Pose builders: standing, sitting, lying, kneeling, plank lines, press-ups, walking
src/scene.ts      Turns a pose plus props into flat shapes; the palette lives here
src/exercises.ts  The library: one entry per exercise with name, level, equipment, cue, props and keyframes
src/svg.ts        Renders a loop as a self-contained animated SVG (SMIL, no script)
svg/              Generated: <id>.svg loops, still/<id>.svg posters, index.json catalogue
```

## Commands

```sh
pnpm motion                                   # rebuild svg/ and gallery.html (from the repo root)
pnpm --filter @landing/motion contact         # contact sheet of every loop at 4 moments, for checking poses
pnpm --filter @landing/motion check           # CI: fails if svg/ is out of date
```

Node 22.18 or later runs the TypeScript directly; there is no compile step.

## Where the loops are used

- **Prototype:** `apps/prototype/scripts/motion.mjs` copies the loops named in `src/core.js` (`anim` and `easier`)
  into `src/motion.js` as data URIs. The session overview shows stills; the in-session screen plays the loop, and
  shows the still when paused or when reduced motion is on.
- **Expo app:** `apps/mobile/src/components/ExerciseAnimation.tsx` draws the same frames live with react-native-svg,
  so the loops stay sharp at any size. It holds the starting position when reduced motion is on.
- **Web:** use `svg/<id>.svg` in an `<img>`.

## Adding an exercise

1. Add an `ex(...)` entry in `src/exercises.ts`. Give the id as `<pattern>-<level>`, a name, equipment, one cue in the
   brand's voice (UK English, sentence case, calm), props, and two to five keys built from the helpers in `poses.ts`.
2. Run `pnpm --filter @landing/motion contact` and look at the sheet: knees bend the right way, feet stay on the
   floor, hands reach what they hold.
3. Run `pnpm motion` and commit `svg/` and `gallery.html` with the change.

Coordinates are a 240 × 200 box, y down, the figure facing right; the floor's top edge is at y = 186. A pose sets the
hips, the torso angle (0 upright, 90 face down, −90 on the back) and where the hands and ankles go; elbows and knees
follow. Pin a knee or elbow with `kneeAt` or `elbowAt` when it rests on something.

The physio reviews every loop alongside its cues before it ships (see docs/plan-movement-food-shopping.md).
