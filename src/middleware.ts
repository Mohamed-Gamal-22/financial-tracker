import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const GUEST_ONLY = ["/login", "/register", "/forgot-password"];

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;
    const isLoggedIn = Boolean(token);

    const isGuestOnly = GUEST_ONLY.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    );

    if (isLoggedIn && (isGuestOnly || pathname === "/")) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        const isProtected =
          pathname === "/profile" || pathname.startsWith("/profile/");

        if (isProtected) {
          return Boolean(token);
        }

        return true;
      },
    },
  },
);

export const config = {
  matcher: [
    "/",
    "/profile/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
