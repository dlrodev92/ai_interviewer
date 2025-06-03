import { Aldrich } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Providers } from '../hooks/Providers';

const aldrichSans = Aldrich({
  weight: '400',
  display: 'swap',
  variable: '--font-aldrich',
  subsets: ['latin'],
});

export const metadata = {
  title: 'My App',
  description: 'An amazing app',
};

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
