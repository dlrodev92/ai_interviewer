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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CreditCardIcon } from 'lucide-react';

// Define form schema with validation
const formSchema = z.object({
  programmingLanguage: z.string().min(1, {
    message: 'Please select a programming language',
  }),
});

// Supported programming languages
const PROGRAMMING_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
];

interface InterviewSettingsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { programmingLanguage: string }) => void;
  creditsAvailable: number;
}

export default function TechnicalInterviewSettingsForm({
  isOpen,
  onClose,
  onSubmit,
  creditsAvailable,
}: InterviewSettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      programmingLanguage: '',
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
      <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-zinc-50 text-xl">
            Technical Interview Setup
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Configure your technical coding interview session
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="programmingLanguage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-300">
                    Programming Language
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-zinc-950 border-zinc-700 text-zinc-300">
                        <SelectValue placeholder="Select a programming language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-950 border-zinc-700">
                      {PROGRAMMING_LANGUAGES.map((language) => (
                        <SelectItem
                          key={language.value}
                          value={language.value}
                          className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-50"
                        >
                          {language.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-zinc-500">
                    Choose the programming language for your technical interview
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
