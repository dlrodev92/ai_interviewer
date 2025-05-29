import Hero from '@/components/HeroSection';
import MockZoomComponent from '@/components/MockZoomSection';
import Comparison from '@/components/ComparisonSection';
import InterviewTypes from '@/components/InterviewTypesSection';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WaveSeparator from '@/components/WaveSeparator';
import InterviewNuggets from '@/components/InterviewNuggetsSection';
import AppShowcase from '@/components/AppShowcaseSection';
import GradientSeparator from '@/components/GradientSeparator';
import CTASection from '@/components/CTASection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MockInterviewerAI – Land your dev job',
  description:
    'Train, build confidence, and get hired with our AI-powered mock interview coach.',
  keywords: [
    'mock interview',
    'junior developer',
    'AI interview prep',
    'tech jobs',
  ],
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
        <WaveSeparator
          bgUrl="/separator-1.svg"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: 'easeIn' }}
        />
        <MockZoomComponent />
        <WaveSeparator
          bgUrl="/separator-2.svg"
          initial={{ opacity: 0.8, y: -80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: 'easeIn' }}
        />
        <Comparison />
        <WaveSeparator
          bgUrl="/separator-3.svg"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 10 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: 'easeIn' }}
        />
        <InterviewNuggets />
        <WaveSeparator
          bgUrl="/separator-4.svg"
          initial={{ opacity: 0.8, y: -80 }}
          whileInView={{ opacity: 1, y: -10 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: 'easeIn' }}
        />
        <AppShowcase />
        <WaveSeparator
          bgUrl="/separator-3.svg"
          initial={{ opacity: 0.8, y: -80 }}
          whileInView={{ opacity: 1, y: -10 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: 'easeIn' }}
        />
        <GradientSeparator />
        <InterviewTypes />
        <CTASection />
      </div>
      <Footer />
    </main>
  );
}
