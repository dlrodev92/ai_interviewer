// components/interview/InterviewSettingsForm.tsx
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Briefcase, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

const settingsSchema = z.object({
  jobDescription: z
    .string()
    .min(10, 'Please enter a job description with at least 10 characters'),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface InterviewSettingsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SettingsFormData) => void;
  creditsAvailable: number;
}

export default function InterviewSettingsForm({
  isOpen,
  onClose,
  onSubmit,
  creditsAvailable,
}: InterviewSettingsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      jobDescription: '',
    },
  });

  const onFormSubmit = async (data: SettingsFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <CardTitle>Interview Settings</CardTitle>
        </div>
        <CardDescription>
          Configure your behavioral interview by providing details about the job
          you're applying for.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="settings-form" onSubmit={handleSubmit(onFormSubmit)}>
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="jobDescription"
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Job Description
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                Paste the job description to personalize your interview
                questions.
              </p>
              <Textarea
                id="jobDescription"
                placeholder="Paste job description here..."
                className="min-h-[150px] max-h-[150px] resize-none overflow-y-scroll"
                {...register('jobDescription')}
              />
              {errors.jobDescription && (
                <p className="text-sm text-destructive mt-1">
                  {errors.jobDescription.message}
                </p>
              )}
            </div>

            <div className="bg-muted p-3 rounded-md mt-4">
              <p className="text-sm font-medium">Credit Information</p>
              <p className="text-xs text-muted-foreground">
                Starting this interview will use 1 credit. You currently have{' '}
                {creditsAvailable} credit(s) remaining.
              </p>
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" form="settings-form" disabled={isSubmitting}>
          {isSubmitting ? 'Starting...' : 'Start Interview'}
        </Button>
      </CardFooter>
    </Card>
  );
}
