import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { login } from "@/services/api/auth";
import { ApiError } from "@/services/api/types";
import { loginSchema } from "@/schemas/auth.schema";
import { parseLoginData } from "@/services/auth/parse-login";

const isProd = process.env.NODE_ENV === "production";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is missing. Add it to your environment.");
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        fullname: { label: "Full name", type: "text" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse({
          email: credentials?.email,
          password: credentials?.password,
        });

        if (!parsed.success) {
          throw new Error("بيانات الدخول غير صالحة");
        }

        try {
          const response = await login(parsed.data);
          const sessionData = parseLoginData(
            response.data,
            parsed.data.email,
            credentials?.fullname?.trim() || undefined,
          );

          if (!sessionData) {
            throw new Error("تعذر قراءة بيانات الجلسة من الخادم");
          }

          return {
            id: sessionData.user.email,
            email: sessionData.user.email,
            name: sessionData.user.fullname,
            accessToken: sessionData.tokens.access_token,
            refreshToken: sessionData.tokens.refresh_token,
          };
        } catch (error) {
          if (error instanceof ApiError) {
            throw new Error(error.message || "فشل تسجيل الدخول");
          }
          if (error instanceof Error) {
            throw error;
          }
          throw new Error("فشل تسجيل الدخول");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.fullname = user.name;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? token.sub ?? "";
        session.user.email = token.email ?? "";
        session.user.fullname = token.fullname ?? "";
        session.user.name = token.fullname ?? "";
      }
      session.accessToken = token.accessToken;
      // refreshToken stays only inside the encrypted JWT cookie
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      try {
        const target = new URL(url);
        if (target.origin === baseUrl) {
          return url;
        }
      } catch {
        // ignore invalid URLs
      }
      return `${baseUrl}/profile`;
    },
  },

  events: {
    async signOut() {
      // Session cookie cleared by NextAuth; legacy keys cleaned on the client.
    },
  },

  useSecureCookies: isProd,
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
