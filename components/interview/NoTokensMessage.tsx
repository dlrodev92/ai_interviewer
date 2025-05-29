// components/interview/NoTokensMessage.tsx
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Coins } from 'lucide-react';

export default function NoTokensMessage() {
  const router = useRouter();

  return (
    <div className="max-w-md mx-auto mt-8">
      <Card className="border-destructive/20">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <Coins className="h-5 w-5 text-destructive" />
            </div>
            <CardTitle>No Interview Credits</CardTitle>
          </div>
          <CardDescription>
            You don't have any interview credits remaining.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            In this MVP version, each user has a limited number of interview
            credits. Please contact support if you need more credits for
            testing.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push('/dashboard')} className="w-full">
            Return to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
