import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Comparison from '@/components/Comparison';
import InterviewTypes from '@/components/InterviewTypes';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WaveSeparator from '@/components/WaveSeparator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MockInterviewerAI – Land your dev job',
  description: 'Train, build confidence, and get hired with our AI-powered mock interview coach.',
  keywords: ['mock interview', 'junior developer', 'AI interview prep', 'tech jobs'],
  openGraph: {
    title: 'MockInterviewerAI – Your Dev Job Prep Assistant',
    description: 'Mock interviews tailored for junior developers.',
    url: 'https://mockinterviewerai.dev',
    siteName: 'MockInterviewerAI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MockInterviewerAI Preview',
      },
    ],
    type: 'website',
  },
};
export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20">
        <Hero />
        <WaveSeparator />
        <Features />
        <Comparison />
        <InterviewTypes />
      </div>
      <Footer />
    </main>
  );
}
