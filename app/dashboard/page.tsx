import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">AI Interviewer Dashboard</h1>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 rounded-lg border bg-card">
          <h2 className="text-xl font-semibold mb-4">Start New Interview</h2>
          <p className="text-muted-foreground mb-4">Paste a job description to begin your mock interview.</p>
          <Button className="w-full">Start Interview</Button>
        </div>
        
        <div className="p-6 rounded-lg border bg-card">
          <h2 className="text-xl font-semibold mb-4">Credits Available</h2>
          <p className="text-3xl font-bold mb-2">1</p>
          <p className="text-muted-foreground">Free interview token remaining</p>
        </div>
      </div>
    </div>
  );
} 