import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { getFeedbackById } from '@/services/client/feedbackService';
import { getUserByEmail } from '@/services/client/userServiceClient';
import ClientFeedbackDetail from '@/components/feedback/ClientFeedbackDetail';

function formatDate(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
}

export default async function FeedbackDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/api/auth/signin');
  }

  try {
    const user = await getUserByEmail(session.user.email);
    if (!user) notFound();

    const feedback = await getFeedbackById(id, user.id);
    if (!feedback) notFound();

    return (
      <ClientFeedbackDetail
        feedback={{
          ...feedback,
          interviewId: feedback.interviewId ?? undefined,
        }}
        formattedDate={formatDate(feedback.date)}
      />
    );
  } catch (error) {
    console.error('Error fetching feedback:', error);
    notFound();
  }
}