# Welcome loop

The 12-second silent film at the top of the welcome screen (`src/components/WelcomeFilm.tsx`). It's made for that
spot, not cut from the intro film: the real app in demo mode, in a phone standing on the page's own ground, so it
melts into the screen. Hannah ticks *Protein at breakfast*, starts Strength A, then the meal plan and Progress, and
back to Today. There's a light version on oat and a dark one on the dark ground; the app picks by the phone's setting.

- `loop.html`: the animation. Every frame is `render(t)`, and `t = 12` draws the same as `t = 0`, so it loops
  without a seam. Open it in a browser and call `render(4.2)` in the console to look at a moment; add
  `?scheme=dark` for the dark one. Timings, chips and colours are at the top of the script.
- `screens/`: the app screens it shows, captured from the web build by `capture.py` (re-run it after a redesign).
- `render.py`: renders the videos into `assets/film/` (needs Python Playwright and ffmpeg).
- `fonts/`: Nunito (SIL Open Font License), for the chips.
