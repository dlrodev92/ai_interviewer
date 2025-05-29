'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

const showcases = [
  {
    title: 'Start an Interview',
    description: 'Choose your type and hit "Start" to begin.',
    image: '/videos/choose_interview.webp', // Convert to WebP animation
    alt: 'Choose interview type demonstration',
  },
  {
    title: 'Answer Questions',
    description: 'Respond like you would in a real interview scenario.',
    image: '/videos/video_prompt.webp', // Convert to WebP animation
    alt: 'Answering interview questions demonstration',
  },
  {
    title: 'Get Feedback',
    description: 'Receive instant feedback to improve fast.',
    image: '/videos/gather_feedback.webp', // Convert to WebP animation
    alt: 'Getting feedback demonstration',
  },
];

export default function AppShowcase() {
  const [index, setIndex] = useState(0);
  const current = showcases[index];

  const next = () => setIndex((i) => (i + 1) % showcases.length);
  const prev = () =>
    setIndex((i) => (i - 1 + showcases.length) % showcases.length);

  return (
    <section
      id="demo"
      className="py-24 scroll-mt-24 relative overflow-hidden min-h-[600px] bg-background"
    >
      {/* Optional background grid */}
      <div className="absolute inset-0 bg-grid-primary/[0.02] -z-10" />

      <div className="max-w-7xl mx-auto px-4 flex flex-col gap-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Experience Our Platform
          </h2>
          <p className="text-lg text-primary/80">
            Practice interviews on any device, anytime. Get real-time feedback
            and improve with every session.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-12">
          <div className="relative w-full md:w-2/3 aspect-[16/10] rounded-2xl overflow-hidden shadow-lg bg-muted">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.image}
                className="w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Image
                  src={current.image}
                  alt={current.alt}
                  fill
                  className="object-contain"
                  priority={index === 0} // Only prioritize first image
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="w-full md:w-1/3 flex flex-col items-start gap-6">
            <Card className="bg-card w-full">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-primary leading-tight">
                  {current.title}
                </h3>
                <p className="text-muted-foreground text-base">
                  {current.description}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prev}
                    aria-label="Previous showcase"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={next}
                    aria-label="Next showcase"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-1 mt-2">
                  {showcases.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        i === index ? 'bg-primary' : 'bg-muted-foreground/40'
                      }`}
                      aria-label={`Go to showcase ${i + 1}`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
