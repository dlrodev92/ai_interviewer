import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/authOptions';
import { getUserByEmail } from '@/services/client/userServiceClient';
import { getUserFeedbacks } from '@/services/server/userService';
import { mapFeedbacks } from '@/lib/feedbackMapper';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StarIcon } from 'lucide-react';
import FeedbackList from '@/components/feedback/FeedbackList';
import type { MappedFeedback } from '@/types/feedback';

export default async function FeedbackPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/api/auth/signin');
  }

  let feedbacks: MappedFeedback[] = [];

  try {
    const user = await getUserByEmail(session.user.email);
    const rawFeedbacks = await getUserFeedbacks(user.id);
    feedbacks = mapFeedbacks(rawFeedbacks);
  } catch (error) {
    console.error('Error loading feedbacks:', error);
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Interview Feedbacks</h1>
          <p className="text-zinc-400 mt-1">
            Review and learn from your past interview sessions
          </p>
        </div>
        <Link href="/dashboard/interview/behavioral">
          <Button variant="default">Start New Interview</Button>
        </Link>
      </div>

      {feedbacks.length === 0 ? (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="py-10 flex flex-col items-center">
            <div className="rounded-full bg-zinc-800 p-4 mb-4">
              <StarIcon className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              No feedbacks yet
            </h3>
            <p className="text-zinc-400 text-center max-w-md mb-6">
              Complete your first interview session to receive personalized
              feedback and improvement suggestions.
            </p>
            <Link href="/dashboard/interview/behavioral">
              <Button>Start an Interview</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <FeedbackList initialFeedbacks={feedbacks} />
      )}
    </div>
  );
}