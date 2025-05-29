import { apiHandler } from '@/core/apiHandler';

export const interviewService = {
  generatePrompt: (
    jobDescription: string,
    interviewType: string = 'behavioral'
  ) => {
    return apiHandler.post<{
      success: boolean;
      systemPrompt: string;
      interviewerName: string;
    }>('/api/llm/generate-interview-prompt', {
      jobDescription,
      interviewType,
    });
  },
};
