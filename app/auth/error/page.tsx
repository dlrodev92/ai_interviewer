'use client';

import { useSearchParams } from 'next/navigation';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Auth Error</h1>
      <p className="text-muted-foreground mb-4">
        Something went wrong: {error}
      </p>
      <a href="/login" className="text-blue-500 underline">
        Try again
      </a>
    </div>
  );
}
