// /components/feedback/detail/FeedbackHeader.tsx

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, ClockIcon, StarIcon } from 'lucide-react';

interface FeedbackHeaderProps {
  feedback: {
    title: string;
    type: string;
    date: Date;
    duration: number;
    overallScore: number;
  };
  formatDate: (date: Date) => string;
}

export default function FeedbackHeader({
  feedback,
  formatDate,
}: FeedbackHeaderProps) {
  // Function to render stars based on score
  const renderStars = (score) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`w-3 h-3 sm:w-4 sm:h-4 ${
              star <= Math.round(score)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-zinc-300'
            }`}
          />
        ))}
        <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium">
          {score.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800 mb-4">
      <CardHeader className="sm:pb-4 pb-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div>
            <Badge
              variant="outline"
              className="bg-zinc-800 text-white border-zinc-700 mb-1 sm:mb-2 text-xs"
            >
              {feedback.type}
            </Badge>
            <CardTitle className="text-white text-lg sm:text-2xl mt-1">
              {feedback.title}
            </CardTitle>
            <CardDescription className="text-zinc-400 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm mt-1 sm:mt-2">
              <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              {formatDate(feedback.date)}
              <span className="mx-1">•</span>
              <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              {feedback.duration} min
            </CardDescription>
          </div>

          <div className="flex flex-row sm:flex-col sm:items-end items-center justify-between mt-2 sm:mt-0">
            <div className="text-xs sm:text-sm text-zinc-400 sm:mb-1">
              Overall
            </div>
            <div className="text-xl sm:text-3xl font-bold text-white sm:mb-1 ml-auto sm:ml-0">
              {feedback.overallScore.toFixed(1)}
              <span className="text-sm text-zinc-400">/5.0</span>
            </div>
            <div className="hidden sm:flex">
              {renderStars(feedback.overallScore)}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
