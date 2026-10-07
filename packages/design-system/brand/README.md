# Handoff: Steadie brand (logo, app icon, App Store listing)

## Overview
Brand identity for **Steadie**, an iPhone app that helps UK adults keep weight off for the 12 months after stopping a GLP-1 weight-loss injection. This package contains the final logo (symbol, wordmark, lockup), the App Store icon, brand tokens and the full App Store listing artwork.

Brand promise: **"Keep what you've worked for."** Tone: calm, warm, on the user's side — a kind friend, never a clinic, diet app or gym.

## About the design files
Files in `design-files/` are **design references built in HTML**, not production code. Recreate them in the target codebase (SwiftUI for the app, the existing stack for the website) using its own patterns. The SVGs, PNGs and token files in `logo/`, `tokens/` and `app-store/` **are** production-ready and can be used directly.

## Fidelity
**High-fidelity.** Colours, geometry and type are final. Reproduce exactly.

---

## 1. The symbol — "Roly-poly"
Idea: a self-righting shape, mid-tilt. The weight sits low (the dot), so whatever nudges it, it rocks back upright. Life will tip you; Steadie helps you settle back.

Geometry (viewBox `0 0 100 100` for the icon; `22 18 56 76` for the bare mark):
- **Body:** `M50 24 C66 24 74 44 74 59 C74 72 63 80 50 80 C37 80 26 72 26 59 C26 44 34 24 50 24 Z`
- **Lean:** body + dot rotated **−12°** about point (50, 80) — the contact point. Always leans left. Never upright, never mirrored.
- **Weight dot:** circle cx 50, cy 64, r 7 (rotated with the body). Rendered as a knock-out (tile colour shows through).
- **Ground line:** rect x 31, y 85, w 38, h 5, rx 2.5, same colour as body at **50% opacity**. Not rotated.
- In the app icon the whole group is shifted up 5 units: `translate(0 -5)`.

Colour variants (`logo/`):
- `steadie-mark-apricot.svg` — default on light/oat backgrounds
- `steadie-mark-light-on-dark.svg` — #F2A27A on dark backgrounds
- `steadie-mark-cream.svg` — on apricot backgrounds
- `steadie-mark-cocoa-mono.svg` — one-colour use (e.g. the doctor PDF in greyscale print)

Don'ts: no outline versions, no gradients, no drop shadows on the mark, no face/character details, don't recolour the dot separately from the tile/background, don't remove the ground line except below 24 px (then drop it and centre the body).

## 2. App Store icon
- `logo/steadie-app-icon-1024.png` (and `.svg`) — 1024 × 1024, opaque, no text, square corners (iOS applies the mask).
- Tile **#DE6F44**, body **#FBF1E4**, dot = tile colour, ground cream at 50%.
- `logo/app-icon-sizes/` contains 180/120/87/80/60/58/40 px renders for Xcode asset catalogues if a single-size catalogue isn't used. Prefer the single 1024 source in Xcode 15+.

## 3. Wordmark
- Always lowercase: **steadie**.
- Font: **Nunito 800**, letter-spacing **−0.035em**, line-height 1.
- Signature detail: the "i" tittle is replaced by a filled circle (the weight dot): diameter **0.16em**, top **0.10em** from the em-box top, centred on the stem. Reference implementation: `logo/wordmark-reference.html` (dotless ı + absolutely positioned circle).
- Colours: ink #2A2530 with apricot #DE6F44 dot on light; oat #F5EFE6 with #F2A27A dot on dark; cream #FBF1E4 (text and dot) on apricot.
- This is a typeset placeholder for a custom-drawn wordmark. For iOS, the web/SwiftUI build can typeset it; for print and the website header, ask design for outlined SVG before launch.

## 4. Lockup
Horizontal only: mark left, wordmark right.
- Mark height ≈ **1.15 ×** wordmark font-size.
- Gap ≈ **0.26 ×** font-size.
- Mark's optical centre aligns with the wordmark's x-height centre (wordmark gets ~6% bottom padding relative to the mark box).
- Clear space: the width of the mark on all sides.
- Minimum size: wordmark 16 px / mark 18 px tall.

Use: website header, App Store screenshots, splash screen (mark only, centred, on #F5EFE6 or #DE6F44), one-page prescriber PDF (top-left, apricot or mono).

## 5. Design tokens
`tokens/steadie-brand.css` and `tokens/steadie-brand.json`.

| Token | Hex | Use |
|---|---|---|
| apricot | #DE6F44 | Primary brand, icon tile, hero backgrounds |
| apricot-soft | #F2A27A | Mark on dark |
| cream | #FBF1E4 | Mark on apricot, cards on apricot |
| oat | #F5EFE6 | Light backgrounds |
| ink | #2A2530 | Headlines, wordmark |
| cocoa | #3B2A22 | Alt warm ink |
| night | #1C1B22 | Dark backgrounds |
| device | #1F1C23 | Phone bezel in marketing art |
| peach / lilac / sky / sage / butter | #F8D8C4 / #E3DBF2 / #D3E5EF / #D3E6D9 / #F5E5B5 | Marketing screenshot backgrounds; match in-app pastels |

Type: marketing headlines **Fredoka 600** (−0.01em); subheads/body **Nunito 700**; wordmark **Nunito 800**. These match the in-app system (Fredoka headings, Nunito body). The brand tokens extend the existing app design system — don't replace its pastels.

## 6. App Store listing artwork (`app-store/`)
iPhone 6.3″ screenshots, **1206 × 2622 px**, upload in this order:
1. `iphone-01-hero.png` — apricot; lockup, "Keep what you've worked for.", Today screen
2. `iphone-02-plan.png` — peach; "A year of support after the jab"
3. `iphone-03-habits.png` — lilac; "Three small habits a week"
4. `iphone-04-strength.png` — sky; "Strength for every body"
5. `iphone-05-meals.png` — sage; "Meals easier than a takeaway"
6. `iphone-06-shopping.png` — butter; "One shopping list for the week"
7. `iphone-07-recipes.png` — peach; "Recipes that suit how you eat"
8. `iphone-08-score.png` — sage; "A weekly score for habits, not weight"
9. `iphone-09-checkins.png` — sky; "See what shapes your steadier days"
10. `iphone-10-on-your-side.png` — apricot; reassurance cards + "Try it free for 7 days"

Product page header: `header-3840x1646.png`.

Screenshot template (to regenerate when app screens change): canvas 1206 × 2622; headline Fredoka 600 104 px / 1.05 at x 100, y 170; subhead Nunito 700 46 px / 1.35, 30 px below; phone 840 px wide at x 183, y 740, bezel #1F1C23, 22 px padding, outer radius 124 px, screen radius 104 px, shadow `0 40px 90px rgba(…,.22)` tinted to background. Source app screenshots are 1290 × 2796. Full layout in `design-files/Steadie App Store Assets.dc.html`.

Not included: app preview videos, iPad and Apple Watch screenshots. Copy must be re-checked if pricing/trial changes ("Try it free for 7 days" on slide 10).

## 7. Brand guardrails
- Never: scales, tape measures, syringes/pens/needles, before/after bodies, flames, ticks, leaves, anything clinical.
- No shame, restriction or "dieting" language. Progress = staying steady, not losing more.
- Never imply medication advice.

## Files
- `logo/` — icon (SVG, PNG, size set), mark SVGs ×4, wordmark reference HTML
- `tokens/` — CSS variables, JSON
- `app-store/` — 10 screenshots + header PNG
- `design-files/Steadie Logo Directions.dc.html` — exploration and final lockup (turn 3 = final)
- `design-files/Steadie App Store Assets.dc.html` — App Store artwork source (references `uploads/*.png` app screenshots, not included)
