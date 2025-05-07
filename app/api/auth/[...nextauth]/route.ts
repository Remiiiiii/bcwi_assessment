import { Auth, type AuthConfig } from "@auth/core";
import Google from "@auth/core/providers/google";
import GitHub from "@auth/core/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "../../../generated/prisma";

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

export const authOptions: AuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Temporarily comment out ALL providers
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  session: { strategy: "database" }, // JWT is default in v5, use database for adapter
  basePath: "/api/auth", // Explicitly set base path
  trustHost: true, // Explicitly trust the host
  secret: process.env.AUTH_SECRET, // Explicitly pass the secret
  // Optional: Add callbacks, pages, session strategy, etc.
  // callbacks: {
  //   async session({ session, user }) {
  //     session.user.id = user.id;
  //     return session;
  //   },
  // },
  // pages: {
  //   signIn: '/login',
  // },
  // You MUST have an AUTH_SECRET set in your .env.local
};

async function handler(req: Request) {
  console.log(
    "[Auth Handler] process.env.AUTH_SECRET in handler:",
    process.env.AUTH_SECRET
  );

  try {
    const response = await Auth(req, authOptions);
    console.log(
      "[Auth Handler] Auth function returned status:",
      response.status
    );
    return response;
  } catch (error) {
    console.error("[Auth Handler] Error in Auth function:", error);
    return new Response("Internal Server Error during authentication", {
      status: 500,
    });
  }
}

export { handler as GET, handler as POST };
