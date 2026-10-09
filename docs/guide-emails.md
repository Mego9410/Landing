# Scheduled guides and guide emails

New guides go live on the website on their date, two a week, and go out by email to members who've asked for them,
with a digest every Sunday. It all runs by itself once switched on.

## How it works

- **Scheduling.** Every guide has a `published` date. Guides in `apps/web/content/guides/scheduled-*.ts` are in the
  code from the start but stay hidden until their date (London time): the guide page, the hub, the home page, the
  sitemap and the RSS feed all list only guides published so far (`liveGuides()`), and refresh every hour. A link in
  one guide to another that isn't out yet shows as plain text until it is.
- **The daily job.** Vercel Cron calls `/api/cron/guides` every day at 07:00 UTC (8am in summer, 7am in winter). It
  refreshes the site, then emails any guide published in the last three days that hasn't gone out, and on Sundays sends
  the digest: that week's new guides plus three from the library (a different three each week).
- **Resend.** Members who turn on guide emails become contacts in a Resend segment called "Steadie guides" (created
  automatically). Each email is a Resend broadcast named `guide:<slug>` or `digest:<date>`; a name that already exists
  is never sent again, so a re-run can't double-send. Every email has Resend's one-click unsubscribe link, and Resend
  stops emailing anyone who unsubscribes. You can see every send, open and click under Broadcasts in Resend.
- **Opt-in.** Guide emails are off unless someone turns them on: there's a switch on the sign-in screen ("Email me new
  guides", unticked) and in Settings → Account → Guide emails. This is consent under UK GDPR and PECR. Deleting an
  account removes the contact from Resend. The privacy policy covers all of this. Pre-launch waitlist sign-ups are
  not added: they only agreed to one launch email.

## The schedule

| Date | Guide |
| --- | --- |
| Tue, 13 Oct 2026 | The first month after stopping a GLP-1: what to expect, week by week (`first-month-after-stopping-glp-1`) |
| Fri, 16 Oct 2026 | Muscle loss on a GLP-1: why it happens and how to protect it (`muscle-loss-on-glp-1`) |
| Tue, 20 Oct 2026 | High-protein lunches: easy ideas for work and home (`high-protein-lunches-uk`) |
| Fri, 23 Oct 2026 | Strength training at home with no equipment: a 25-minute beginner routine (`strength-training-at-home-no-equipment`) |
| Tue, 27 Oct 2026 | Emotional eating after a GLP-1: when food becomes comfort again (`emotional-eating-after-glp-1`) |
| Fri, 30 Oct 2026 | Cheap high-protein foods: a UK supermarket guide (`budget-high-protein-foods-uk`) |
| Tue, 3 Nov 2026 | Alcohol after stopping a GLP-1: appetite, units and nights out (`alcohol-after-stopping-glp-1`) |
| Fri, 6 Nov 2026 | NHS support after weight-loss injections: what's available and how to ask (`nhs-support-after-weight-loss-injections`) |
| Tue, 10 Nov 2026 | High-protein snacks for hungry afternoons (`high-protein-snacks-uk`) |
| Fri, 13 Nov 2026 | Strength and balance for older adults after weight loss (`strength-training-older-adults`) |
| Tue, 17 Nov 2026 | Portion sizes without counting: the hand and plate method (`portion-sizes-without-counting`) |
| Fri, 20 Nov 2026 | Body image after weight loss: when your body changes faster than you do (`body-image-after-weight-loss`) |
| Tue, 24 Nov 2026 | Fibre after a GLP-1: why it helps and easy ways to get more (`fibre-after-glp-1`) |
| Fri, 27 Nov 2026 | Weight-loss tablets in the UK: GLP-1 pills explained (`weight-loss-tablets-uk`) |
| Tue, 1 Dec 2026 | Easy high-protein dinners for busy weeknights (`easy-high-protein-dinners-uk`) |
| Fri, 4 Dec 2026 | Exercise with joint pain: moving with sore knees, hips or back (`exercise-with-joint-pain`) |
| Tue, 8 Dec 2026 | Christmas after weight-loss jabs: a relaxed way to enjoy it (`christmas-after-weight-loss-jab`) |
| Fri, 11 Dec 2026 | Eating slowly and noticing fullness after a GLP-1 (`eating-slowly-and-fullness`) |
| Tue, 15 Dec 2026 | Holidays and travel after a GLP-1: enjoy the trip, keep it simple (`holidays-and-travel-after-glp-1`) |
| Fri, 18 Dec 2026 | Meal prep after a GLP-1: a simple weekly plan (`meal-prep-after-glp-1`) |
| Tue, 22 Dec 2026 | Menopause and weight after a GLP-1: what changes and what helps (`menopause-and-weight-after-glp-1`) |
| Fri, 25 Dec 2026 | Small habits that stick: a gentle way to change after a GLP-1 (`small-habits-that-stick`) |
| Tue, 29 Dec 2026 | Family meals after a GLP-1: one meal for everyone (`family-meals-after-glp-1`) |
| Fri, 1 Jan 2027 | A calm New Year after a weight-loss jab, without a diet (`new-year-without-a-diet`) |

Sundays from 11 October 2026 also get the digest. The 24 scheduled guides are in `scheduled-1.ts` (food),
`scheduled-2.ts` (movement, fibre and portions), `scheduled-3.ts` (mind and habits) and `scheduled-4.ts` (coming off,
seasonal and news).

## Switching it on (once)

1. **Vercel → Settings → Environment Variables (Production):**
   - `CRON_SECRET`: a long random string (`openssl rand -hex 32`). Vercel sends it with each cron call; without it
     the job refuses to run.
   - `GUIDE_EMAILS` = `on`. Until this is set, the job only reports what it would send, so you can check first.
   - Optional: `GUIDE_EMAIL_FROM` (for example `Steadie guides <guides@getsteadieapp.com>`; defaults to `EMAIL_FROM`),
     `RESEND_SEGMENT_ID` if you'd rather pick the segment yourself.
   - `RESEND_API_KEY` must have **full access** (not "sending access" only), because the job manages contacts and
     broadcasts.
2. **Redeploy** so the cron is registered (Vercel → Settings → Cron Jobs shows `/api/cron/guides`).
3. **Apple's private relay.** People who use Sign in with Apple with "Hide my email" have a relay address. Apple only
   forwards mail from registered senders: in the Apple Developer portal, Certificates, Identifiers & Profiles →
   Services → Sign in with Apple for Email Communication, add `getsteadieapp.com` and the from address. Resend's DKIM
   and SPF records already cover the domain.
4. **Check it.** With the secret as a bearer token (for example in Hoppscotch or curl):
   - `GET /api/cron/guides?dry=1`: what would go out today.
   - `GET /api/cron/guides?dry=1&date=2026-10-18`: what would go out on any date.
   - `GET /api/cron/guides?preview=<slug>` or `?preview=digest`: the email itself.

## Adding or changing guides

Add a guide to any `scheduled-*.ts` file (or a new one, imported in `index.ts`) with a future `published` date. It
goes live and emails itself on that day. To delay one, change its date before the day. To change a guide after it's
gone out, edit it and set `updated`; it won't be emailed again. Keep two a week going by adding the next batch before
1 January 2027.

## Pausing

Set `GUIDE_EMAILS` to anything other than `on` (the site keeps publishing on schedule), or remove the cron from
`apps/web/vercel.json` to pause both.
