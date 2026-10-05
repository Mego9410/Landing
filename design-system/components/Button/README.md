# Button

Pill-shaped buttons; `primary` (apricot) is used at most once per screen, for the step the screen exists for.

- Provide: `children` (the label), optional `variant`, `size`, `block`, `icon` and any button props (`onClick`, `disabled`).
- `primary` for the main step: "Start my plan", "Save", "Start free trial". `secondary` for alternatives. `quiet` for "Not now", "Skip". `danger` only for deleting an account or data, and always behind an inline confirmation step, never a pop-up alert.
- Use `block` on onboarding and the paywall, pinned above the home indicator with `space-4` margins.
- Labels: verb first, sentence case, two to four words. No "Submit", no exclamation marks.
- Minimum height is 40px (`sm`); the default is 52px for easy tapping.
