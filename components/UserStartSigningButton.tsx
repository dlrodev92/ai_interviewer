'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { signIn } from 'next-auth/react';

interface UserStartSigningButtonProps {
  text: string;
}

export default function UserStartSigningButton({
  text,
}: UserStartSigningButtonProps) {
  return (
    <Button
      size="lg"
      className="text-lg px-8 py-4 h-14 bg-primary hover:bg-primary/90 text-primary-foreground group shadow-lg hover:shadow-xl transition-all duration-300"
      onClick={() => signIn('auth0')}
    >
      {text}
      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
    </Button>
  );
}
