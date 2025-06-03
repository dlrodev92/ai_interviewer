'use client';

import { SessionProvider } from 'next-auth/react';
import { LocomotiveProvider } from '@/hooks/useLocomotiveScrollHook';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LocomotiveProvider>{children}</LocomotiveProvider>
    </SessionProvider>
  );
}
