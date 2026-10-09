// Sends the sign-in code through Resend. The email is built here, code and all, rather than from a Resend template:
// a template's variable name or sample value can drift from what we send, and then the email shows a code that
// doesn't work. Set RESEND_API_KEY, EMAIL_FROM (an address on a domain verified in Resend) and EMAIL_REPLY_TO (a
// mailbox that receives mail: hello@ can't). Locally, with no key, the code is printed to the server's console instead,
// so sign-in can be tried without sending email.
import { SITE_URL } from "@/app/site";

/** The email for a sign-in code: subject, plain text and branded HTML, all carrying the same code. */
export function signInEmail(code: string) {
  const subject = `${code} is your Steadie code`;
  const text = `Your Steadie sign-in code is ${code}.\n\nIt works for 10 minutes. If you didn't ask for it, you can ignore this email.`;
  const font = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
  const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#F5EFE6;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">Your code works for 10 minutes.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5EFE6;"><tr><td align="center" style="padding:28px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
<tr><td style="padding:0 4px 20px;"><img src="${SITE_URL}/email/steadie-lockup.png" width="140" alt="Steadie" style="display:block;border:0;width:140px;height:auto;"></td></tr>
<tr><td style="background:#FFFFFF;border-radius:20px;padding:32px 28px;font-family:${font};color:#2A2530;">
<p style="margin:0 0 12px;font-size:17px;line-height:24px;">Your sign-in code is</p>
<p style="margin:0 0 18px;font-size:36px;line-height:44px;font-weight:700;letter-spacing:8px;">${code}</p>
<p style="margin:0;font-size:15px;line-height:22px;color:#6A6371;">It works for 10 minutes. If you didn't ask for it, you can ignore this email.</p>
</td></tr></table></td></tr></table></body></html>`;
  return { subject, text, html };
}

export async function sendSignInCode(email: string, code: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "production" && process.env.VERCEL) throw new Error("RESEND_API_KEY isn't set, so sign-in codes can't be emailed.");
    console.info(`[dev] Steadie sign-in code for ${email}: ${code}`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "Steadie <hello@getsteadieapp.com>",
      to: email,
      ...(process.env.EMAIL_REPLY_TO ? { reply_to: process.env.EMAIL_REPLY_TO } : {}),
      ...signInEmail(code),
    }),
  });
  if (!res.ok) throw new Error(`Resend refused the sign-in email (${res.status}).`);
}
