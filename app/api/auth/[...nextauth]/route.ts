import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "../../../generated/prisma"; // Adjust path if needed
import type { NextAuthConfig } from "next-auth";

console.log(
  "[AUTH_ROUTE_MODULE] process.env.AUTH_SECRET at module load:",
  process.env.AUTH_SECRET
);
console.log(
  "[AUTH_ROUTE_MODULE] process.env.AUTH_URL at module load:",
  process.env.AUTH_URL
);
console.log(
  "[AUTH_ROUTE_MODULE] process.env.AUTH_TRUST_HOST at module load:",
  process.env.AUTH_TRUST_HOST
);

const prisma = new PrismaClient();

// Define config using NextAuthConfig type from next-auth v5
export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID, // No need for `as string` if env vars are set
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "database" },
  secret: process.env.AUTH_SECRET, // Make sure AUTH_SECRET env var is set
  // trustHost: true, // Recommended to set AUTH_TRUST_HOST=true in .env instead
  // basePath: "/api/auth", // Usually inferred
  callbacks: {
    // Add callbacks if needed, e.g., modifying session data
  },
  // pages: { signIn: '/login' }, // Optional
};

// Initialize NextAuth v5 and export handlers and auth helper
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);

// Note: handlers object contains GET and POST functions directly
