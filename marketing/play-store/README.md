# Google Play artwork

Built by `build.py` from the App Store source screens (`../app-store/source/`), with the same copy, colours and fonts.
Rebuild with `python3 marketing/play-store/build.py` (needs Pillow).

Differences from the App Store set, all because of Play's rules:

- **1440 × 2560 (9:16).** Play rejects screenshots whose long side is more than twice the short side; the iPhone
  6.9" art is 2.17.
- **No iPhone.** The phone is a plain frame and the iOS status bar and notch are replaced with an Android-style bar,
  because Play doesn't accept another platform's device in store images.
- **Eight screenshots** (Play's maximum): hero, plan, habits, strength, meals, shopping, score, and "On your side".
  Recipes and check-ins are left out.
- "Your data stays yours" reads "Kept private. Never sold, never used for ads.", to match the privacy policy now that
  signed-in people have a backup.

| File | Upload to |
| --- | --- |
| `listing/icon-512.png` | App icon (512 × 512) |
| `listing/feature-graphic.png` | Feature graphic (1024 × 500) |
| `listing/phone-01…08-*.png` | Phone screenshots, in order |

"Try it free for 7 days" on screenshot 8 is true once both subscriptions have their 7-day free-trial offer in Play
Console (`docs/google-play-launch.md`). Fonts are Fredoka and Nunito (SIL Open Font License, in `fonts/`).
