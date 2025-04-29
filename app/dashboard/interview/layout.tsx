'use client';

import { ReactNode } from 'react';
import Navigation from '@/components/Navigation';

interface InterviewLayoutProps {
  children: ReactNode;
}

export default function InterviewLayout({ children }: InterviewLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-12 pt-28">
        {children}
      </main>
    </div>
  );
}