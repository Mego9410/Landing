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
- **Faces:** side-on profiles with a nose, an ear and hair. The first version had no eyes or mouth; round two (below)
  adds one calm eye and a soft smile, because the blank head read as a doll.
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

## Round two: how other apps build their characters (October 2026)

The first cast still felt stiff: small heads, tube limbs with highlight streaks, pill-shaped hands, a lumpy torso,
and motion where everything moved at once and stopped dead. This round looked at how other companies make characters
and loops that feel alive.

### What others do

- **Duolingo** builds every character from three primitives (a rounded rectangle, a circle and a rounded triangle),
  with a head and a body of one or two shapes each. The eyes carry most of the feeling. They animate in Rive with
  state machines, so a character idles, reacts and talks without a new file for each moment.
- **Headspace** uses rounded primitives only, no sharp corners, a warm palette with no pure black or white, and slow,
  soft motion. Illustrations do a job (explain a step) rather than decorate.
- **Atlassian, Airbnb and WordPress** rebuilt their people around real variety: a realistic range of body sizes,
  face shapes and skin tones, drawn from photos of real people rather than a single template body. Airbnb's
  illustrator found staff simply said "this doesn't represent me" about the old set.
- **Pablo Stanley's Humaaans and Open Peeps** split a person into parts (head, body, legs, clothes) that mix and
  match. That's the same idea as our parametric cast: one skeleton, many people.
- **Exercise apps (Seven, Hevy, Gentler Streak)** keep a demo to one person, one move and a plain background, and
  loop it. Gentler Streak won an Apple Design Award partly for its gentle, non-judging tone. Research on home physio
  (Physio@Home) found clear visual guides improve how accurately people copy a move.
- **Animation craft** (the 12 principles): slow in and slow out, never linear; overlapping action, where the torso
  leads and the head follows a moment later; a strong line of action; and small secondary motion like breathing, so
  a held pose doesn't look frozen.

### What we changed

- **Proportions:** the head is bigger (radius 17, up from 15) on a shorter, thicker neck, so the figures are about five
  heads tall. This is friendlier and reads better at phone size, without looking childlike.
- **A calm face:** one eye, a soft smile and a warm cheek, the same at every effort level. The face never strains.
- **Flat shapes:** the highlight streaks are gone. Each surface is one flat colour, and the far limbs are one shade
  deeper. The torso is now two soft shapes (trousers and top) instead of four with seams.
- **Mitten hands:** one round shape, slightly wider than the wrist, so grips and pushes read at a glance.
- **Trainers:** one rounded shape on a sole, without the coloured stripe.
- **Easing:** moves use smootherstep instead of a sine curve, so the body gathers itself, moves, then settles.
- **Overlapping action:** the head runs about 0.14 s behind the torso and takes up about half of its turn (at most
  10°), so bending forward and standing up have follow-through.
- **Breathing:** the chest rises and falls about every 3.5 seconds, fitted to the loop so it never jumps.
- **What doesn't change:** hands, feet and hips stay exactly on their keyframes, so the exercises themselves are
  untouched. All 80 still pass the check for all six people.
- **Framing:** the frame has a little more headroom, and the step-up uses a normal stair height (22 rather than 30
  units), so no one's head leaves the frame.

Not done yet: anticipation (a small dip before a big move) was left out, because adding motion to the exercise
itself could teach the wrong form. If we bring in an illustrator later, Rive is the route for hero moments
(onboarding, celebrations) where a character reacts to the person.

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
- [Duolingo: character illustration](https://design.duolingo.com/illustration/characters) and [world character visemes](https://blog.duolingo.com/world-character-visemes)
- [Designing inclusive illustrations at Atlassian](https://www.atlassian.com/blog/inside-atlassian/designing-inclusive-illustrations-at-atlassian)
- [Diversity and illustrations (Leading Hand)](https://leadinghand.com.au/insights/diversity-and-illustrations-part-two-2)
- [Airbnb: Your face here](https://airbnb.design/your-face-here) and [Meet the illustrator diversifying Airbnb's image](https://ontheimage.com/news/meet-the-illustrator-diversifying-airbnbs-image)
- [Humaaans (Dribbble)](https://dribbble.com/stories/2018/12/14/humaaans-a-new-highly-customizable-library-of-illustrations) and [Open Peeps](https://licenseorg.com/guide/design-graphics/open-peeps)
- [Apple Design Awards 2024 (Gentler Streak)](https://developer.apple.com/design/awards/2024)
- [Seven: 7 minute workout (Screens Design)](https://screensdesign.com/showcase/seven-7-minute-workout) and [Hevy exercise library](https://www.hevyapp.com/features/exercise-library/)
- [Physio@Home (CHI 2015)](https://www.cs.dartmouth.edu/~xingdong/papers/2015-chi2015-physio-at-home.pdf)
- [The 12 principles of animation (Adobe)](https://www.adobe.com/in/creativecloud/roc/blog/video/animation-principles) and [follow-through and overlapping action (GarageFarm)](https://garagefarm.net/blog/follow-through-and-overlapping-action-in-animation)
