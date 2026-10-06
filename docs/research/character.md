# Research: a character for the exercise animations

Written 6 October 2026. The question is what style the exercise animations' figure should have. The current figure
in `packages/motion` is a placeholder made of pill limbs and a disc head. Some sources couldn't be opened directly
during research (World Obesity, Frontiers, several design write-ups), so the points below rest on search summaries
and are marked to verify where it matters.

## What the research says

1. **Animation beats static pictures, and simplified figures teach well.** People pick up a movement from the
   relative motion of the joints. Simplified figures, including stick and point-light figures, carry that
   information, and animation gives better learning and lower cognitive load than static images. So a stylised
   character doesn't cost clarity, as long as the joints read clearly.
2. **Readability comes from silhouette.** Animators check a pose by filling it solid black: if it still reads, it
   works. This favours a side view for most moves, limbs with real volume and a visible gap between them, and a far
   side drawn in a lighter tone.
3. **People need to see themselves.** Watching a model doing the activity has a medium effect on self-efficacy in
   older adults. The evidence that a *similar* model works better is mixed, but a cast that looks like our users
   (over 30, many sizes) can't hurt and fits the brand. Our users are coming off a GLP-1, and many still live in
   larger bodies.
4. **Weight-stigma image guidelines** (World Obesity, EASO and OAC image banks, BDA guidance) say: show whole people
   doing everyday, capable things. Never show isolated bellies or body parts, ill-fitting clothes, or
   struggling-and-sweating clichés. Show people in larger bodies being strong, not "before" shots.
5. **Faceless flat people are a known cliché.** "Corporate Memphis" (Facebook's Alegria style) is widely criticised
   for faceless, rubbery-limbed characters with purple or blue skin. It reads as generic, and it sidesteps real
   diversity. Our current figure sits close to that look.
6. **Calm wellness brands get warmth from rules, not detail.** Headspace's illustration rules: rounded primitives,
   no sharp corners, a warm palette, no pure black or white, and one strict system applied across thousands of
   assets. That is close to our design system already.
7. **Tools.** Rive files are small and have state machines (one file holds the states, such as paused or tempo), so
   they suit interactive characters. Lottie plays a fixed animation. Code-driven SVG, which is what we do now, lets
   one set of poses drive any body shape.

## Recommendation

**A small cast of real, adult, rounded characters, side-on, with no facial features. Their body shapes are
parametric, so every exercise works for every body.**

- **The cast:** five or six adults aged about 35 to 65, mixed sizes (including clearly larger bodies), real skin
  tones (no purple people), varied hair including grey hair and a hijab, everyday kit (leggings or joggers, T-shirt,
  trainers). The person chooses who shows them the moves, or it rotates.
- **Shape language from the brand:** tapered pill limbs, a soft torso with a real profile (chest, belly, hips), a
  round head under a hair shape, rounded hands and trainers, and the sage horizon underneath. Two flat tones per
  surface, with no outlines and no gradients.
- **Faces:** side-on profiles with a nose line, an ear and hair, and no eyes or mouth. This keeps the brand's "no
  faces" rule in spirit, avoids the blank-egg look, and never asks a face to show strain. *This needs your call:*
  the design system currently says "No faces".
- **Motion:** calm, even tempo; a hold at the end of each move; no bounce or sweat. An optional faint "ghost" of the
  start position shows the range of movement. Reduced motion shows a still frame.
- **Build:** keep our keyframe engine, because the poses are the valuable part. Draw a richer figure from it, with
  each character defined by a few numbers (shoulder and hip width, belly depth, limb thickness, height), so all 80
  exercises work for the whole cast at no extra cost. Use Rive only if an illustrator wants to hand-animate hero
  moments (onboarding, celebrations).

## Other directions considered

- **Brand shapes only (pebble people):** charming, but joints read poorly and it can feel childish.
- **Single-line drawings with colour blocks:** elegant, but thin lines lose the pose at small sizes and in the session
  thumbnails.
- **3D avatars (Nike, Peloton guides):** clear, but costly, gym-coded, and off-brand for a calm, pastel app.
- **Filmed trainers:** most trusted for complex lifts, but costly to make inclusive across settings and sizes, and
  the design system already prefers illustration.

## Sources

- [Animation in fitness: an inclusive approach](https://espaciodca.fedace.org/content/animation-fitness-inclusive-approach)
- [Learning a motor skill from video and static pictures](https://www.mentalhealthdataprizeafrica.aphrc.org/repository/paper/41156/learning-a-motor-skill-from-video-and-static-pictures-in-physical-education-students-effects-on-technical-performances-motivation-and-cognitive-load)
- [Frontiers in Psychology, 2022: observational learning from animations](https://www.frontiersin.org/articles/10.3389/fpsyg.2022.1032680/full) (to verify)
- [Model similarity and self-efficacy (Utrecht)](https://dspace.library.uu.nl/bitstream/handle/1874/342007/Learning.pdf?sequence=1)
- [Model similarity after stroke (JEMS)](https://www.scapps.org/jems/index.php/1/article/view/2693)
- [World Obesity image guidelines](https://www.worldobesity.org/downloads/healthy_voices_downloads/HV_Image_guidelines.pdf) and [language and imagery](https://worldobesity.org/resources/policy-dossiers/weight-stigma/language-and-imagery)
- [EASO obesity image bank](https://easo.org/media-portal/obesity-image-bank)
- [BDA: eliminating weight stigma](https://www.bda.uk.com/news-campaigns/campaigns/managing-and-preventing-obesity/eliminating-weight-stigma-comms-guidelines.html)
- [Corporate Memphis (Shots)](https://shots.net/news/view/corporate-memphis-the-design-style-that-quietly-took-over-the-internet) and [AIGA Eye on Design](https://eyeondesign.aiga.org/what-the-think-pieces-about-corporate-memphis-tell-us-about-the-state-of-illustration/)
- [Headspace design guide (Blake Crosley)](https://blakecrosley.com/guides/design/headspace)
- [The power of silhouette (BINUS)](https://binus.ac.id/bandung/dkv/2025/11/04/the-power-of-silhouette-designing-readable-characters-in-motion/)
- [Lottie vs Rive (Callstack)](https://callstack.com/blog/lottie-vs-rive-optimizing-mobile-app-animation)
