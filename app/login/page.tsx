'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <Button
        onClick={() => signIn('auth0')}
        className="flex items-center gap-2"
      >
        <i className="fa-solid fa-right-to-bracket"></i>
        Sign In with Auth0
      </Button>
    </div>
  );
}
