// /components/feedback/detail/TranscriptView.tsx

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

interface TranscriptEntry {
  speaker: string;
  text: string;
  timestamp: string;
}

interface TranscriptViewProps {
  transcript: TranscriptEntry[];
}

export default function TranscriptView({ transcript }: TranscriptViewProps) {
  return (
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
          <div className="space-y-4">
            {transcript.map((entry, index) => (
              <div key={index} className="flex">
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
  );
}
