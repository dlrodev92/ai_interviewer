'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <Button variant="outline" disabled className="text-muted-foreground">
        <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>
        Loading...
      </Button>
    );
  }

  if (session) {
    return (
      <Button
        variant="outline"
        onClick={() => signOut()}
        className="flex items-center gap-2"
      >
        <i className="fa-solid fa-right-from-bracket"></i>
        Sign Out
      </Button>
    );
  }

  return (
    <Button
      variant="default"
      onClick={() => signIn('auth0')}
      className="flex items-center gap-2"
    >
      <i className="fa-solid fa-right-to-bracket"></i>
      Sign In
    </Button>
  );
}
