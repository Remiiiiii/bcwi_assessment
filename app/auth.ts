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
        return false; // Redirect unauthenticated users to login page
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
        return true; // Allow unauthenticated users to access login page
      }
      return true; // Allow access to other pages (adjust as needed)
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl + "/admindashboard"; // Default redirect
    },
  },
  pages: { signIn: "/login" },
};

export const { auth, signIn, signOut, handlers } = NextAuth(authConfig);
