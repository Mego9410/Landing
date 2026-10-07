import { getAuth } from "@/lib/auth";

// Better Auth's endpoints: sending and checking sign-in codes, Sign in with Apple, sessions, signing out.
export const runtime = "nodejs";
export const GET = async (request: Request) => (await getAuth()).handler(request);
export const POST = async (request: Request) => (await getAuth()).handler(request);
