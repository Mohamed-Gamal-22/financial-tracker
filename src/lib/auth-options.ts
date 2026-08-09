import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  continueWithGoogle,
  login,
  loginWithGmail,
} from "@/services/api/auth";
import { ApiError } from "@/services/api/types";
import {
  googleAuthModeSchema,
  googleIdTokenSchema,
  loginSchema,
} from "@/schemas/auth.schema";
import { parseLoginData } from "@/services/auth/parse-login";
import {
  emailFromGoogleIdToken,
  nameFromGoogleIdToken,
} from "@/services/auth/decode-id-token";

const isProd = process.env.NODE_ENV === "production";

/**
 * NextAuth secret. During `next build` Vercel may evaluate this module without
 * env vars yet — don't crash the build. Fail clearly at request time instead.
 */
function getAuthSecret() {
  const secret = process.env.NEXTAUTH_SECRET;
  if (secret) return secret;

  if (process.env.NEXT_PHASE === "phase-production-build") {
    return "build-time-placeholder";
  }

  throw new Error(
    "NEXTAUTH_SECRET is missing. Add it in Vercel → Settings → Environment Variables (and in .env.local locally).",
  );
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

    CredentialsProvider({
      id: "google-id-token",
      name: "Google ID Token",
      credentials: {
        idToken: { label: "Google ID Token", type: "text" },
        /** `continue` → POST /auth/gmail | `login` → POST /auth/login/gmail */
        mode: { label: "Mode", type: "text" },
      },
      async authorize(credentials) {
        const tokenParsed = googleIdTokenSchema.safeParse({
          idToken: credentials?.idToken,
        });
        const modeParsed = googleAuthModeSchema.safeParse(
          credentials?.mode || "continue",
        );

        if (!tokenParsed.success || !modeParsed.success) {
          throw new Error("بيانات Google غير صالحة");
        }

        const { idToken } = tokenParsed.data;
        const mode = modeParsed.data;

        try {
          const response =
            mode === "login"
              ? await loginWithGmail({ idToken })
              : await continueWithGoogle({ idToken });

          const fallbackEmail = emailFromGoogleIdToken(idToken);
          const fallbackName = nameFromGoogleIdToken(idToken);

          const sessionData = parseLoginData(
            response.data,
            fallbackEmail,
            fallbackName || undefined,
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
            const msg = error.message || "فشل تسجيل الدخول عبر Google";
            if (/audience|Wrong recipient|requiredAudience/i.test(msg)) {
              throw new Error(
                "Client ID على الفرونت غير مطابق لإعداد Google في الـ backend",
              );
            }
            throw new Error(msg);
          }
          if (error instanceof Error) {
            throw error;
          }
          throw new Error("فشل تسجيل الدخول عبر Google");
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
  secret: getAuthSecret(),
  debug: process.env.NODE_ENV === "development",
};
