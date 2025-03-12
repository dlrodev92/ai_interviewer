import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AuthButton } from '@/components/AuthButton';
import Image from 'next/image'
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Image 
            src="/logo.svg" 
            alt="AI Interviewer Logo"
            width={120}
            height={120}
          />
          
          <div className="flex gap-4 items-center">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
          <h2 className="text-4xl font-bold mb-6">Practice Interviews with AI</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            Get real-time feedback on your interview skills. Paste any job description and practice with our AI interviewer.
          </p>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button size="lg">Try for Free</Button>
            </Link>
            <Button variant="outline" size="lg">Learn More</Button>
          </div>
        </section>

        <section className="bg-muted py-16">
          <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-card">
              <h3 className="text-lg font-semibold mb-2">5-Minute Sessions</h3>
              <p className="text-muted-foreground">Quick and effective practice interviews tailored to your needs.</p>
            </div>
            <div className="p-6 rounded-lg bg-card">
              <h3 className="text-lg font-semibold mb-2">Real-time Feedback</h3>
              <p className="text-muted-foreground">Get instant insights on your responses and areas for improvement.</p>
            </div>
            <div className="p-6 rounded-lg bg-card">
              <h3 className="text-lg font-semibold mb-2">Job-Specific Questions</h3>
              <p className="text-muted-foreground">Questions tailored to the exact role you're applying for.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
