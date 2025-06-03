import {
  signIn,
  signOut,
  useSession,
  type SignInOptions,
} from 'next-auth/react';

export const login = async (provider: string, options?: SignInOptions) => {
  return signIn(provider, options);
};

export const logout = async () => {
  return signOut();
};

export const useAuth = () => {
  return useSession();
};
