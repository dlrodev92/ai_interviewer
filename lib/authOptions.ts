import { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import Auth0Provider from 'next-auth/providers/auth0';
import { APP_CONFIG } from '@/config/envConfig';

export const authOptions: NextAuthOptions = {
  providers: [
    Auth0Provider({
      clientId: APP_CONFIG.AUTH.AUTH0.CLIENT_ID,
      clientSecret: APP_CONFIG.AUTH.AUTH0.CLIENT_SECRET,
      issuer: APP_CONFIG.AUTH.AUTH0.ISSUER,
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        const res = await fetch(`${APP_CONFIG.API.BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });

        if (!res.ok) throw new Error('Invalid credentials');

        const user = await res.json();
        if (!user || !user.accessToken || !user.role) {
          throw new Error('Invalid user data from API');
        }

        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          accessToken: user.accessToken,
          role: user.role,
          id: user.id,
          name: user.name,
          email: user.email,
          tokenBalance: user.tokenBalance,
        };
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name ?? '',
        email: token.email ?? '',
        role: token.role as string,
        accessToken: token.accessToken as string,
        tokenBalance: token.tokenBalance as number,
      };
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },

  secret: APP_CONFIG.AUTH.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
};
