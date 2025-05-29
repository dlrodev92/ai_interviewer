'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CreditCardIcon } from 'lucide-react';

// Define form schema with validation
const formSchema = z.object({
  jobDescription: z.string().min(10, {
    message: 'Job description must be at least 10 characters.',
  }),
});

interface SystemDesignInterviewSettingsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { jobDescription: string }) => void;
  creditsAvailable: number;
}

export default function SystemDesignInterviewSettingsForm({
  isOpen,
  onClose,
  onSubmit,
  creditsAvailable,
}: SystemDesignInterviewSettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobDescription: '',
    },
  });

  // Handle form submission
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
      form.setError('root', {
        type: 'manual',
        message: 'Failed to start interview. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-50 text-xl">
            System Design Interview Setup
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Configure your system design interview by providing a job
            description
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">
                    Job Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste a job description or describe the system you want to design. For example: 'Design a scalable social media platform with messaging, content sharing, and real-time notifications.'"
                      className="h-40 bg-zinc-950 border-zinc-700 text-zinc-300 placeholder:text-zinc-500"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-zinc-500">
                    A more detailed description will result in a more customized
                    interview
                  </FormDescription>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="bg-zinc-800/50 rounded-md p-4 border border-zinc-700/50">
              <div className="flex items-center gap-2 mb-2">
                <CreditCardIcon className="w-5 h-5 text-primary" />
                <h3 className="text-zinc-50 font-medium">Interview Credits</h3>
              </div>
              <p className="text-sm text-zinc-400">
                You have{' '}
                <span className="text-primary font-medium">
                  {creditsAvailable}
                </span>{' '}
                interview credit{creditsAvailable !== 1 ? 's' : ''} remaining.
                This interview will use 1 credit.
              </p>
            </div>

            {form.formState.errors.root && (
              <div className="bg-red-900/20 text-red-400 p-3 rounded-md text-sm border border-red-900/30">
                {form.formState.errors.root.message}
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-50"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || creditsAvailable < 1}
                className={`${
                  creditsAvailable < 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Starting...' : 'Start Interview'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
