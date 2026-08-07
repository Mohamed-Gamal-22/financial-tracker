import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      fullname: string;
      email: string;
    } & DefaultSession["user"];
    /** Backend API access token (refresh stays server-only in the JWT). */
    accessToken?: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
    fullname?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}
