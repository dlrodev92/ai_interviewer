'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  DownloadIcon,
  Loader2,
  PauseIcon,
  PlayIcon,
  Printer,
  ShareIcon,
  StarIcon,
  Trash2Icon,
} from 'lucide-react';

import { deleteFeedbackById } from '@/services/client/deleteFeedback';
import { formatStars } from '@/lib/feedbackHelpers';
import type { ClientFeedbackDetailProps } from '@/types/feedback';

export default function ClientFeedbackDetail({
  feedback,
  formattedDate,
}: ClientFeedbackDetailProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleBack = () => router.back();

  const handleDeleteClick = () => setShowDeleteConfirmation(true);

  const handleDeleteConfirm = async () => {
    if (!feedback.id) return;

    try {
      setIsDeleting(true);
      setDeleteError(null);

      const result = await deleteFeedbackById(feedback.id);

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete feedback');
      }

      setShowDeleteConfirmation(false);
      router.push('/dashboard/feedback');
      router.refresh();
    } catch (err) {
      console.error('Error deleting feedback:', err);
      setDeleteError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const renderStars = (score: number) => {
    return (
      <div className="flex items-center">
        {formatStars(score).map(({ filled, star }) => (
          <StarIcon
            key={star}
            className={`w-3 h-3 sm:w-4 sm:h-4 ${
              filled ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-300'
            }`}
          />
        ))}
        <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-medium">
          {score.toFixed(1)}
        </span>
      </div>
    );
  };

  const togglePlayback = () => setIsPlaying(!isPlaying);
  return (
    <div className="container mx-auto py-4 px-4 sm:px-6 max-w-6xl">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeftIcon className="mr-2 w-4 h-4" /> Back
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="bg-red-900/20 hover:bg-red-900/30 text-red-500 border-red-900/20"
          onClick={handleDeleteClick}
        >
          <Trash2Icon className="mr-2 h-4 w-4" />
          <span>Delete Feedback</span>
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-h-full"
      >
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
                  {formattedDate}
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

        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="bg-zinc-800 border-zinc-700 p-1 w-full overflow-x-auto flex mb-4">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-zinc-700 flex-1"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="transcript"
              className="data-[state=active]:bg-zinc-700 flex-1"
            >
              Transcript
            </TabsTrigger>
            {feedback.hasRecording && (
              <TabsTrigger
                value="recording"
                className="data-[state=active]:bg-zinc-700 flex-1"
              >
                Recording
              </TabsTrigger>
            )}
          </TabsList>

          <div className="overflow-auto pb-6">
            <TabsContent value="overview" className="mt-0">
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
                          <div key={category.id || index}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-sm">
                                {category.name}
                              </span>
                              <div className="flex items-center">
                                {renderStars(category.score)}
                              </div>
                            </div>
                            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-1">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{
                                  width: `${(category.score / 5) * 100}%`,
                                }}
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
            </TabsContent>

            <TabsContent value="transcript" className="mt-0">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">
                    Interview Transcript
                  </CardTitle>
                  <CardDescription className="text-zinc-400 text-xs sm:text-sm">
                    Complete dialogue from your interview session
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-zinc-300 text-sm pt-0">
                  <div className="max-h-[60vh] overflow-y-auto pr-1">
                    <div className="space-y-6">
                      {feedback.transcript.map((entry, index) => (
                        <div key={entry.id || index} className="flex">
                          <div className="text-xs text-zinc-500 w-10 sm:w-14 pt-1 flex-shrink-0">
                            {entry.timestamp}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className={`font-medium text-xs sm:text-sm ${entry.speaker === 'Interviewer' ? 'text-primary' : 'text-white'}`}
                            >
                              {entry.speaker}
                            </div>
                            <div className="mt-1 text-xs sm:text-sm break-words">
                              {entry.text}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
      >
        <AlertDialogContent className="bg-zinc-900 border-zinc-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete this feedback?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              This action cannot be undone. This will permanently delete this
              feedback and remove it from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteError && (
            <div className="bg-red-900/20 border border-red-800 rounded-md p-3 text-sm text-red-200 my-2">
              {deleteError}
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-zinc-800 text-white hover:bg-zinc-700 border-zinc-700"
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
