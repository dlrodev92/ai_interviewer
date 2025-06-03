// /components/feedback/detail/FeedbackOverview.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { StarIcon } from 'lucide-react';

interface FeedbackOverviewProps {
  feedback: {
    summary: string;
    strengths: string[];
    improvements: string[];
    categories: {
      name: string;
      score: number;
      description: string;
    }[];
  };
}

export default function FeedbackOverview({ feedback }: FeedbackOverviewProps) {
  // Function to render stars based on score
  const renderStars = (score: number) => {
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
        <span className="ml-1 sm:ml-2 text-xs font-medium">
          {score.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="bg-zinc-900 border-zinc-800 lg:col-span-2 h-auto">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">
            Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="text-zinc-300 text-sm pt-0">
          <div className="max-h-[60vh] overflow-y-auto pr-1">
            <p className="mb-4">{feedback.summary}</p>

            <h3 className="text-base font-medium text-white mb-2">
              Key Strengths
            </h3>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              {feedback.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>

            <h3 className="text-base font-medium text-white mb-2">
              Areas for Improvement
            </h3>
            <ul className="list-disc pl-5 mb-2 space-y-1">
              {feedback.improvements.map((improvement, index) => (
                <li key={index}>{improvement}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800 h-auto">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">
            Performance Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="text-zinc-300 text-sm pt-0">
          <div className="max-h-[60vh] overflow-y-auto pr-1">
            <div className="space-y-4">
              {feedback.categories.map((category, index) => (
                <div key={category.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm">{category.name}</span>
                    <div className="flex items-center">
                      {renderStars(category.score)}
                    </div>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-1">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(category.score / 5) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-zinc-400">
                    {category.description}
                  </p>

                  {index !== feedback.categories.length - 1 && (
                    <Separator className="my-3 bg-zinc-800" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
