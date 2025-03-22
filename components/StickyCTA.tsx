'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const showThreshold = window.innerHeight * 0.5; // Show after 50% of viewport height
      setIsVisible(scrollPosition > showThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 w-full bg-card shadow-lg transform transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <i className="fa-solid fa-robot text-2xl text-primary"></i>
          <span className="font-bold text-card-foreground">
            Ready to ace your interview?
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-primary hover:underline cursor-pointer">
            Watch Sample
          </span>
          <Button variant="default">Get Your Free Interview Now</Button>
        </div>
      </div>
    </div>
  );
}
