"use client";

import { createContext, useContext, type ReactNode } from "react";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: "CANDIDATE" | "RECRUITER";
  companyName?: string | null;
} | null;

const AuthContext = createContext<PublicUser>(null);

export function AuthProvider({
  user,
  children,
}: {
  user: PublicUser;
  children: ReactNode;
}) {
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
