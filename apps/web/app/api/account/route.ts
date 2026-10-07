import { eq } from "drizzle-orm";
import { userFrom } from "@/lib/auth";
import { getDb, schema } from "@/lib/db";

// Deletes the signed-in person's account and everything stored with it (sessions, sign-in methods and app data go
// with the user row). Apple requires apps with accounts to offer this inside the app.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(request: Request) {
  const user = await userFrom(request);
  if (!user) return Response.json({ error: "Sign in first." }, { status: 401 });
  const db = await getDb();
  await db.delete(schema.user).where(eq(schema.user.id, user.id));
  return new Response(null, { status: 204 });
}
