# Inbound email (hello@getsteadieapp.com)

Mail sent to any address at getsteadieapp.com arrives in **Resend**, which calls the website's `/api/inbound` webhook.
The site fetches the email (with attachments) and forwards it to a real inbox. Replying from that inbox goes straight
to the sender, because the forward's Reply-To is theirs. Code: `apps/web/lib/inbound.ts`.

## How it's watched

- **On failure:** the webhook answers with an error so Resend retries, and an alert email goes to `INBOUND_ALERT_TO`
  (once per email). When a held email gets through later, a "Resolved" email follows.
- **Hourly check (10 past each hour):** `/api/cron/inbound` lists the last 7 days of received mail in Resend and forwards
  anything that never reached the inbox. It emails an alert if it had to step in (the webhook isn't working), if an
  email is still stuck, or if a setting is missing.
- **If Resend itself is down or the API key is wrong,** alerts can't be emailed either: the cron run shows as failed in
  Vercel (Logs, and Settings → Cron Jobs) and the error is logged. Nothing is lost: received mail stays in Resend
  (Emails → Receiving) and the hourly check catches up for 7 days.
- Each email's sender, subject and outcome are kept in the `inbound_emails` table for 90 days, then deleted.

## Setup

1. **Resend → Domains → getsteadieapp.com:** turn on **Receiving**. Resend shows an MX record for the root domain.
2. **Vercel → Domains → getsteadieapp.com → DNS records:** add that MX record exactly as shown (name `@`). The domain
   had no MX records before, so nothing else receives mail there. Sending (sign-in codes, guides) is unaffected: it
   uses Resend's existing `send` records.
3. **Resend → Webhooks → Add webhook:** endpoint `https://www.getsteadieapp.com/api/inbound`, event
   `email.received`. Copy its signing secret (`whsec_…`).
4. **Vercel → landing-web → Settings → Environment Variables** (Production):
   - `RESEND_INBOUND_SECRET`: the signing secret from step 3.
   - `INBOUND_FORWARD_TO`: the inbox to forward to. Kept out of the repo, which is public.
   - Optional: `INBOUND_FROM` (default `inbox@getsteadieapp.com`), `INBOUND_ALERT_TO` (default the forward address).
   - `RESEND_API_KEY` and `CRON_SECRET` are already set. The key needs **full access** (it reads received mail).
5. **Redeploy**, then send a test email to hello@getsteadieapp.com from another account.

## Replying as hello@

Forwards arrive from "Name via Steadie" and replies go from the inbox's own address. To reply as
hello@getsteadieapp.com, add it in Gmail under Settings → Accounts → **Send mail as**, using Resend's SMTP
(`smtp.resend.com`, port 465, user `resend`, password a Resend API key with sending access).
