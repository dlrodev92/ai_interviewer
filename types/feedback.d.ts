export interface FeedbackCategory {
    id?: string;
    name: string;
    score: number;
    description: string;
  }
  
  export interface TranscriptEntry {
    id?: string;
    speaker: string;
    text: string;
    timestamp: string;
  }
  
  export interface FeedbackData {
    id: string;
    title: string;
    type: string;
    date: Date;
    duration: number;
    overallScore: number;
    summary: string;
    strengths: string[];
    improvements: string[];
    categories: FeedbackCategory[];
    hasRecording: boolean;
    hasTranscript: boolean;
    recordingUrl?: string | null;
    transcript: TranscriptEntry[];
    interviewId?: string;
  }
  
  export interface ClientFeedbackDetailProps {
    feedback: FeedbackData;
    formattedDate: string;
  }

  export type MappedFeedback = {
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