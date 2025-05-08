import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "database" },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnRoot = nextUrl.pathname === "/";
      const isOnAdminDashboard = nextUrl.pathname.startsWith("/admindashboard");
      const isOnLoginPage = nextUrl.pathname.startsWith("/login");

      if (isOnAdminDashboard) {
        if (isLoggedIn) return true;
        return false;
      }

      if (isOnRoot) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/admindashboard", nextUrl));
        }
        return Response.redirect(new URL("/login", nextUrl));
      }

      if (isOnLoginPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/admindashboard", nextUrl));
        }
        return true;
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl + "/admindashboard";
    },
  },
  pages: { signIn: "/login" },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);
