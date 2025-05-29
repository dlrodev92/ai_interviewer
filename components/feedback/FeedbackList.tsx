'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FeedbackCard from './FeedbackCard';

interface FeedbackListProps {
  initialFeedbacks: Array<{
    id: string;
    title: string;
    date: Date;
    duration: number;
    type: string;
    hasTranscript: boolean;
    hasRecording: boolean;
    overallScore: number;
    categories: {
      name: string;
      score: number;
    }[];
  }>;
}

export default function FeedbackList({ initialFeedbacks }: FeedbackListProps) {
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);

  // Handle feedback deletion by updating the local state
  const handleDelete = (id: string) => {
    setFeedbacks(feedbacks.filter((feedback) => feedback.id !== id));
    router.refresh(); // Refresh the page to update server-side components
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {feedbacks.map((feedback, index) => (
        <div
          key={feedback.id}
          className="opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <Link href={`/dashboard/feedback/${feedback.id}`} passHref>
            <FeedbackCard
              feedback={feedback}
              onDelete={() => handleDelete(feedback.id)}
            />
          </Link>
        </div>
      ))}
    </div>
  );
}
