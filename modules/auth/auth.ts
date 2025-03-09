// modules/auth/auth.ts
import { signIn, signOut, useSession } from "next-auth/react";

export const login = async (provider: string, options?: object) => {
  return signIn(provider, options);
};

export const logout = async () => {
  return signOut();
};

export const useAuth = () => {
  return useSession();
};
