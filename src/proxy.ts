import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const GUEST_ONLY = ["/login", "/register", "/forgot-password"];

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;
    const isLoggedIn = Boolean(token);

    const isGuestOnly = GUEST_ONLY.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    );

    if (isLoggedIn && (isGuestOnly || pathname === "/")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
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
          pathname === "/dashboard" ||
          pathname.startsWith("/dashboard/") ||
          pathname === "/transactions" ||
          pathname.startsWith("/transactions/") ||
          pathname === "/categories" ||
          pathname.startsWith("/categories/") ||
          pathname === "/profile" ||
          pathname.startsWith("/profile/") ||
          pathname === "/reports" ||
          pathname.startsWith("/reports/");

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
    "/dashboard/:path*",
    "/transactions/:path*",
    "/categories/:path*",
    "/profile/:path*",
    "/reports/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
