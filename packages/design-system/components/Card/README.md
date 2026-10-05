# Card

The basic container: `raised` white on oat by default, or a pastel tone for a card with a job.

- Provide: `children`, optional `tone` (`raised`, `sunk`, `apricot`, `sage`, `lilac`, `sky`, `butter`) and `hero` for extra padding.
- Stack cards with `space-6` between them. Don't nest cards.
- Pastel cards carry meaning: `sky` for prescriber and information, `sage` for achievements, `lilac` for coach prompts, `apricot` for today's focus, `butter` is reserved for `NudgeCard`.
- Text on pastel cards is `on-pastel`; the component sets it.
