import { eq } from "drizzle-orm";
import { userFrom } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";
import { forgetContact } from "@/lib/newsletter";

// Deletes the signed-in person's account and everything stored with it (sessions, sign-in methods and app data go
// with the user row), and their guide-emails contact in Resend. Apple requires apps with accounts to offer this inside the app.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(request: Request) {
  const user = await userFrom(request);
  if (!user) return Response.json({ error: "Sign in first." }, { status: 401 });
  const db = await getDb();
  await db.delete(schema.user).where(eq(schema.user.id, user.id));
  // Their email address goes from the guide-emails list too.
  if (process.env.RESEND_API_KEY) await forgetContact(user.email).catch((e) => console.error("account delete: couldn't remove email contact", e));
  return new Response(null, { status: 204 });
}
