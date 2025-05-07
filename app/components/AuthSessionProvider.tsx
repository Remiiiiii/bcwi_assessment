"use client";

import { SessionProvider } from "next-auth/react";

interface AuthSessionProviderProps {
  children: React.ReactNode;
  // Potentially: session?: Session; // If you need to pass initial session from server component
}

export default function AuthSessionProvider({
  children,
}: AuthSessionProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
