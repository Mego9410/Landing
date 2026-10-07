// Sends the sign-in code through Resend. In production it uses the published Resend template "steadie-sign-in-code"
// (with the variable CODE), which loads the logo from /email/steadie-lockup.png on this site. If the template can't be
// used, it falls back to a plain email so nobody is locked out. Set RESEND_API_KEY, EMAIL_FROM (an address on a
// domain verified in Resend) and EMAIL_REPLY_TO (a mailbox that receives mail: hello@ can't). Locally, with no key, the
// code is printed to the server's console instead, so sign-in can be tried without sending email.
const SIGN_IN_TEMPLATE = "steadie-sign-in-code";

export async function sendSignInCode(email: string, code: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "production" && process.env.VERCEL) throw new Error("RESEND_API_KEY isn't set, so sign-in codes can't be emailed.");
    console.info(`[dev] Steadie sign-in code for ${email}: ${code}`);
    return;
  }
  const base = {
    from: process.env.EMAIL_FROM || "Steadie <hello@getsteadieapp.com>",
    to: email,
    ...(process.env.EMAIL_REPLY_TO ? { reply_to: process.env.EMAIL_REPLY_TO } : {}),
  };
  const send = (body: object) => fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  // The template sets the subject and design; `id` takes the template's alias.
  const templated = await send({ ...base, template: { id: SIGN_IN_TEMPLATE, variables: { CODE: code } } });
  if (templated.ok) return;
  console.error(`sign-in email template failed (${templated.status}), sending the plain version`);

  const plain = await send({
    ...base,
    subject: `${code} is your Steadie code`,
    text: `Your Steadie sign-in code is ${code}.\n\nIt works for 10 minutes. If you didn't ask for it, you can ignore this email.`,
    html: `<p style="font-family:system-ui,sans-serif;font-size:16px">Your Steadie sign-in code is</p><p style="font-family:system-ui,sans-serif;font-size:32px;font-weight:700;letter-spacing:6px">${code}</p><p style="font-family:system-ui,sans-serif;font-size:14px;color:#6A6371">It works for 10 minutes. If you didn't ask for it, you can ignore this email.</p>`,
  });
  if (!plain.ok) throw new Error(`Resend refused the email (${plain.status}).`);
}
