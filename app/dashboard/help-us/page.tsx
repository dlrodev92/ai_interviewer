'use client';

import { useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StarIcon, SendIcon, ThumbsUpIcon } from 'lucide-react';

// Define types for the feedback data
type Rating = 0 | 1 | 2 | 3 | 4 | 5;

interface FeedbackRatings {
  usability: Rating;
  interview_quality: Rating;
  feedback_helpfulness: Rating;
  overall_experience: Rating;
  recommend_likelihood: Rating;
}

interface FeedbackData {
  ratings: FeedbackRatings;
  additional_comments: string;
  submittedAt: string;
}

interface StarRatingProps {
  rating: Rating;
  setRating: (rating: Rating) => void;
}

interface FeedbackQuestion {
  id: keyof FeedbackRatings;
  question: string;
  description: string;
  rating: Rating;
  setRating: (rating: Rating) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, setRating }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star as Rating)}
          className="focus:outline-none"
        >
          <StarIcon
            className={`w-6 h-6 ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-zinc-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default function HelpUsPage() {
  // State for each question rating
  const [usabilityRating, setUsabilityRating] = useState<Rating>(0);
  const [interviewQualityRating, setInterviewQualityRating] =
    useState<Rating>(0);
  const [feedbackQualityRating, setFeedbackQualityRating] = useState<Rating>(0);
  const [overallExperienceRating, setOverallExperienceRating] =
    useState<Rating>(0);
  const [recommendRating, setRecommendRating] = useState<Rating>(0);

  // State for comments
  const [comments, setComments] = useState<string>('');

  // State for submission status
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Define the feedback questions array
  const feedbackQuestions: FeedbackQuestion[] = [
    {
      id: 'usability',
      question: 'How easy is the app to use?',
      description: 'Rate the overall usability of the interface',
      rating: usabilityRating,
      setRating: setUsabilityRating,
    },
    {
      id: 'interview_quality',
      question: 'How realistic are the interview questions?',
      description: 'Rate the quality and relevance of interview questions',
      rating: interviewQualityRating,
      setRating: setInterviewQualityRating,
    },
    {
      id: 'feedback_helpfulness',
      question: 'How helpful is the interview feedback?',
      description: 'Rate the quality and actionability of feedback you receive',
      rating: feedbackQualityRating,
      setRating: setFeedbackQualityRating,
    },
    {
      id: 'overall_experience',
      question: 'How would you rate your overall experience?',
      description: 'Your overall satisfaction with AI Interviewer',
      rating: overallExperienceRating,
      setRating: setOverallExperienceRating,
    },
    {
      id: 'recommend_likelihood',
      question: 'How likely are you to recommend this app to others?',
      description: 'Would you suggest AI Interviewer to friends or colleagues',
      rating: recommendRating,
      setRating: setRecommendRating,
    },
  ];

  // Check if any question has been answered
  const hasAnyRating = (): boolean => {
    return feedbackQuestions.some((question) => question.rating > 0);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare feedback data
      const feedbackData: FeedbackData = {
        ratings: {
          usability: usabilityRating,
          interview_quality: interviewQualityRating,
          feedback_helpfulness: feedbackQualityRating,
          overall_experience: overallExperienceRating,
          recommend_likelihood: recommendRating,
        },
        additional_comments: comments,
        submittedAt: new Date().toISOString(),
      };

      // Submit to API
      const response = await fetch('/api/feedback/submit-ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      // Show success message
      setIsSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setUsabilityRating(0);
        setInterviewQualityRating(0);
        setFeedbackQualityRating(0);
        setOverallExperienceRating(0);
        setRecommendRating(0);
        setComments('');
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('There was an error submitting your feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="">
      <DashboardHeader
        title="Help Us"
        description="Give us some feedback in order to improve the app"
      />

      {isSubmitted ? (
        <Card className="border-green-500 bg-green-50/10">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="bg-green-500/20 p-3 rounded-full mb-4">
                <ThumbsUpIcon className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Thank You!
              </h3>
              <p className="text-zinc-400">
                Your feedback has been submitted successfully. We appreciate
                your help in improving AI Interviewer.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Rate Your Experience</CardTitle>
              <CardDescription>
                Please rate the following aspects of AI Interviewer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Map through questions array */}
              {feedbackQuestions.map((question) => (
                <div key={question.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-medium text-white">
                      {question.question}
                    </label>
                    <StarRating
                      rating={question.rating}
                      setRating={question.setRating}
                    />
                  </div>
                  <p className="text-sm text-primary italic">
                    {question.description}
                  </p>
                </div>
              ))}

              {/* Comments */}
              <div className="space-y-2 pt-4">
                <label className="font-medium">
                  Additional Comments (Optional)
                </label>
                <Textarea
                  placeholder="Share your thoughts, suggestions, or feature requests..."
                  className="min-h-[120px] bg-primary text-secondary border-zinc-800"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full gap-2"
                disabled={isSubmitting || !hasAnyRating()}
              >
                <SendIcon className="h-4 w-4" />
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}

      <div className="text-center text-zinc-500 text-sm mt-8">
        Your feedback is anonymous and will be used only to improve the AI
        Interviewer platform.
      </div>
    </div>
  );
}
