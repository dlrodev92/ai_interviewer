import { StarIcon } from 'lucide-react';

export function formatDate(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(date).toLocaleDateString('en-US', options);
}

export function formatInterviewType(type: string): string {
  switch (type) {
    case 'behavioral':
      return 'Behavioral';
    case 'technical':
      return 'Technical';
    case 'systemdesign':
    case 'system-design':
      return 'System Design';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
}

export function RatingStars({ score }: { score: number }) {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={`w-4 h-4 ${
            star <= Math.round(score)
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-zinc-300'
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-medium">{score.toFixed(1)}</span>
    </div>
  );
}

export function formatStars(score: number) {
  return [1, 2, 3, 4, 5].map((star) => ({
    filled: star <= Math.round(score),
    star,
  }));
}
