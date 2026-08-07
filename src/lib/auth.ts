import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { authOptions } from "./auth-options";

export function getServerAuthSession() {
  return getServerSession(authOptions);
}

/** Access token for calling the finance API from Server Components / Route Handlers. */
export async function getServerAccessToken() {
  const session = await getServerAuthSession();
  return session?.accessToken ?? null;
}

/** Read encrypted JWT (includes access + refresh) from a request. */
export function getAuthToken(req: NextRequest) {
  return getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });
}

export async function requireServerAuth() {
  const session = await getServerAuthSession();
  if (!session?.user?.email) {
    return null;
  }
  return session;
}
