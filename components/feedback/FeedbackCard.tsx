'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CalendarIcon,
  ClockIcon,
  ArrowRightIcon,
  Trash2Icon,
  AlertCircleIcon,
} from 'lucide-react';
import {
  formatDate,
  formatInterviewType,
  RatingStars,
} from '@/lib/feedbackHelpers';
import { deleteFeedback } from '@/services/client/feedbackService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface FeedbackCardProps {
  feedback: {
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
  };
  onDelete?: () => void;
}

export default function FeedbackCard({
  feedback,
  onDelete,
}: FeedbackCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Handle delete confirmation
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling
    setShowDeleteDialog(true);
  };

  // Handle actual deletion
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteFeedback(feedback.id);

      if (result.success) {
        toast('Feedback deleted', {
          description: 'The feedback has been successfully deleted.',
        });

        // Call the onDelete callback if provided
        if (onDelete) {
          onDelete();
        } else {
          // Refresh the page if no callback is provided
          router.refresh();
        }
      } else {
        toast.error('Error', {
          description: result.error || 'Failed to delete feedback',
        });
      }
    } catch (error) {
      console.error('Error in delete handler:', error);
      toast.error('Error', {
        description: 'An unexpected error occurred',
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer h-full flex flex-col hover:shadow-xl relative group">
        {/* Delete button - appears on hover */}
        <Button
          variant="destructive"
          size="icon"
          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 h-8 w-8"
          onClick={handleDeleteClick}
          disabled={isDeleting}
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>

        <CardHeader>
          <div className="flex justify-between items-start">
            <Badge
              variant="outline"
              className="bg-zinc-800 text-white border-zinc-700"
            >
              {formatInterviewType(feedback.type)}
            </Badge>
            <RatingStars score={feedback.overallScore} />
          </div>
          <CardTitle className="text-white mt-4">{feedback.title}</CardTitle>
          <div className="text-zinc-400 flex items-center gap-2 text-sm mt-1">
            <CalendarIcon className="w-4 h-4" />
            {formatDate(feedback.date)}
            <span className="mx-1">•</span>
            <ClockIcon className="w-4 h-4" />
            {feedback.duration} min
          </div>
        </CardHeader>

        <CardContent className="text-zinc-300 flex-grow">
          <div className="space-y-3">
            {feedback.categories.map((category) => (
              <div
                key={category.name}
                className="flex justify-between items-center"
              >
                <span className="text-sm">{category.name}</span>
                <div className="flex items-center">
                  <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(category.score / 5) * 100}%` }}
                    />
                  </div>
                  <span className="ml-2 text-xs">
                    {category.score.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        <div className="border-t border-zinc-800 p-4 flex justify-between">
          <div className="flex space-x-2">
            {feedback.hasTranscript && (
              <Badge variant="outline" className="bg-zinc-800 border-zinc-700">
                Transcript
              </Badge>
            )}
            {feedback.hasRecording && (
              <Badge variant="outline" className="bg-zinc-800 border-zinc-700">
                Recording
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" className="text-primary">
            View Details <ArrowRightIcon className="ml-1 w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircleIcon className="h-5 w-5 text-red-500" />
              Delete Feedback
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to delete this feedback? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700 hover:text-white"
              onClick={(e) => e.stopPropagation()}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
