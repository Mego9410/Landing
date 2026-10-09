# The owner's dashboard

**https://www.getsteadieapp.com/admin**: members, subscriptions, downloads, guide emails and the guide schedule on
one page. It works on a phone (add it to your home screen from Safari's share menu). Only addresses in `ADMIN_EMAILS`
can open it; you sign in with an emailed code, like the app. Numbers are read live on every visit. Code:
`apps/web/app/admin/` and `apps/web/lib/admin.ts`.

## What it shows

| Section | From | Needs |
| --- | --- | --- |
| Members: totals, new per day (30 days), active this week, Apple vs email, backups, newest members | The Neon database | Nothing extra |
| Subscriptions: active subscribers, trials, MRR, revenue, new customers | RevenueCat | `REVENUECAT_SECRET_KEY`, `REVENUECAT_PROJECT_ID` |
| Downloads per day (14 days) | App Store Connect sales reports | `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_PRIVATE_KEY`, `ASC_VENDOR_NUMBER` |
| Crashes and errors: crash-free sessions, errors per day, open issues (most frequent first, with links) | Sentry | `SENTRY_API_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` (`SENTRY_URL` only for EU-hosted orgs) |
| Funnel: installs at each step (7 and 30 days), check-in retention; why people cancel | The Neon database (app events) | Nothing extra |
| Guide emails: subscribers, delivered, open and click rates, each email | Resend | `RESEND_API_KEY` (already set) |
| Guides: live, scheduled, what's next, when the schedule runs out | The guide files | Nothing |
| Set-up checklist and links to each service | Environment | Nothing |

"Members" counts accounts. Signing in is optional, so people using the app without an account only show up in
RevenueCat (subscribers) and App Store downloads. The App Review account is left out of the counts.

## Setting it up (Vercel → Settings → Environment Variables → Production, then redeploy)

1. **`ADMIN_EMAILS`**: your address, for example `olivermwacton@googlemail.com`. Add more separated by commas.
2. **RevenueCat**: in RevenueCat, Project settings → API keys → **+ New secret API key**, version **V2**, with read
   access to **Charts metrics** (Project configuration and Customer information can stay off). Set it as
   `REVENUECAT_SECRET_KEY` (starts `sk_`). `REVENUECAT_PROJECT_ID` is the ID in the dashboard's address bar
   (`app.revenuecat.com/projects/<this part>/…`).
3. **App Store Connect**: Users and Access → Integrations → App Store Connect API → Team Keys → **+**, access
   **Sales** (or Finance). Download the `.p8` file (only offered once). Set `ASC_KEY_ID` (the key's ID),
   `ASC_ISSUER_ID` (shown above the keys list), `ASC_PRIVATE_KEY` (the whole contents of the `.p8` file, including the
   BEGIN and END lines) and `ASC_VENDOR_NUMBER` (Payments and Financial Reports, top left). Sales reports arrive a day
   or two late, and only once the app has its first downloads.

4. **Sentry**: in Sentry, Settings → Developer Settings → **Personal Tokens** (or an internal integration) → create a
   token with **project:read**, **event:read** and **org:read**. Set it as `SENTRY_API_TOKEN`. `SENTRY_ORG` and
   `SENTRY_PROJECT` are the slugs in Sentry's address bar (`<org>.sentry.io/projects/<project>/`). If your org is
   hosted in the EU (its address is `de.sentry.io`), also set `SENTRY_URL` to `https://de.sentry.io`. This is a
   different token from the build's `SENTRY_AUTH_TOKEN` in EAS, which only uploads source maps.

These are server-only secrets: never put them in the app or in an `EXPO_PUBLIC_` variable.
