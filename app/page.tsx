import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Comparison from '@/components/Comparison';
import InterviewTypes from '@/components/InterviewTypes';
import StickyCTA from '@/components/StickyCTA';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20">
        <Hero />
        <Features />
        <Comparison />
        <InterviewTypes />
        <StickyCTA />
      </div>
      <Footer />
    </main>
  );
}
