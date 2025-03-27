'use client';

import { SessionProvider } from 'next-auth/react';
import { Aldrich } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { LocomotiveProvider } from '@/hooks/useLocomotiveScrollHook';

const aldrichSans = Aldrich({
  weight: '400',
  display: 'swap',
  variable: '--font-aldrich',
  subsets: ['latin'],
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LocomotiveProvider>{children}</LocomotiveProvider>
    </SessionProvider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          aldrichSans.variable
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
