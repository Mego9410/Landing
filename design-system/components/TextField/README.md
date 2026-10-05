# TextField

A rounded input with a label above and an optional unit suffix, for the quick log and onboarding.

- Provide: `label`, optional `suffix` ("kg", "g"), `hint`, `error`, and any input props (`value`, `onChange`, `inputMode`).
- Errors show inline under the field in `rose-ink`, saying what to do. Never use a pop-up alert.
- Numbers use tabular figures. Weight takes one decimal.
