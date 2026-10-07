// Sends the sign-in code. In production it uses Resend (add it from the Vercel Marketplace, which sets
// RESEND_API_KEY; set EMAIL_FROM to an address on a domain verified in Resend). Locally, with no key, the code is
// printed to the server's console instead, so sign-in can be tried without sending email.
export async function sendSignInCode(email: string, code: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "production" && process.env.VERCEL) throw new Error("RESEND_API_KEY isn't set, so sign-in codes can't be emailed.");
    console.info(`[dev] Landing sign-in code for ${email}: ${code}`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "Landing <hello@[YOUR DOMAIN]>",
      to: email,
      subject: `${code} is your Landing code`,
      text: `Your Landing sign-in code is ${code}.\n\nIt works for 10 minutes. If you didn't ask for it, you can ignore this email.`,
      html: `<p style="font-family:system-ui,sans-serif;font-size:16px">Your Landing sign-in code is</p><p style="font-family:system-ui,sans-serif;font-size:32px;font-weight:700;letter-spacing:6px">${code}</p><p style="font-family:system-ui,sans-serif;font-size:14px;color:#6A6371">It works for 10 minutes. If you didn't ask for it, you can ignore this email.</p>`,
    }),
  });
  if (!res.ok) throw new Error(`Resend refused the email (${res.status}).`);
}
