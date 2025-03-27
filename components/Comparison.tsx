'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const benefits = [
  {
    id: 'confidence',
    title: 'Real Confidence, Not Just Pep Talks',
    icon: 'fa-solid fa-shield',
    description:
      'You don’t need another “you got this” from a friend. You need reps. Practicing with our AI gives you the kind of confidence that comes from doing—not guessing. Show up knowing you’re interview-proof.',
    image: '/confidece_logo.png',
  },
  {
    id: 'feedback',
    title: 'Instant Feedback = Faster Growth',
    icon: 'fa-solid fa-arrow-trend-up',
    description:
      'No more waiting for someone’s “notes.” Our AI gives you real-time, actionable feedback—so every answer becomes a stepping stone, not a mystery. Think of it as your personal interview coach on demand.',
    image: '/feedback_logo.png',
  },
  {
    id: 'patterns',
    title: 'Crack the Interview Code',
    icon: 'fa-solid fa-brain',
    description:
      'Interviews aren’t random—they follow patterns. Learn how to spot them and respond with structured, confident answers. Frameworks > freestyling. Practice turns confusion into clarity.',
    image: '/pattern_logo.png',
  },
  {
    id: 'stress',
    title: 'Train Without the Sweat',
    icon: 'fa-solid fa-heart-pulse',
    description:
      'Interviews are stressful. Practicing shouldn’t be. Our AI lets you rehearse in a zero-pressure zone—so when it’s game time, your brain doesn’t freeze, it flows.',
    image: '/stress_logo.png',
  },
];

export default function Comparison() {
  const [selectedBenefit, setSelectedBenefit] = useState(benefits[0].id);

  return (
    <section className="py-24 bg-background relative overflow-hidden flex flex-col items-center gap-16 z-50">
      {/* Background Decoration */}
      <div className="absolute inset-0" />

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="text-center mb-16">
          <motion.h2 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'linear' }}
          className="text-3xl md:text-4xl font-bold mb-4 text-primary">
            This is what you get when you practice with our AI Agent
          </motion.h2>
        </div>

        <div className="flex flex-col md:flex-row gap-8 relative">
          {/* Left Column - Content Display */}
          <motion.div 
            initial={{ y: 200, skewY: 10, opacity: 0 }}
            whileInView={{ y: 0, skewY: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.2 }}
          className="flex-[2] flex items-center justify-center relative">
            <div className="absolute" />
            <Card className="w-[50%] aspect-square backdrop-blur-sm relative bg-background ">
              <CardContent className="p-8">
                <AnimatePresence mode="wait">
                  {benefits.map(
                    (benefit) =>
                      benefit.id === selectedBenefit && (
                        <motion.div
                          key={`image-${benefit.id}`}
                          initial={{
                            scale: 0.7,
                            opacity: 0,
                            x: '25%',
                            y: '-25%',
                            rotate: -15,
                          }}
                          animate={{
                            scale: 1,
                            opacity: 1,
                            x: '35%',
                            y: '-35%',
                            rotate: 0,
                          }}
                          exit={{
                            scale: 0.7,
                            opacity: 0,
                            x: '25%',
                            y: '-25%',
                            rotate: 15,
                          }}
                          transition={{
                            type: 'spring',
                            stiffness: 200,
                            damping: 20,
                            duration: 0.6,
                          }}
                          className="absolute top-0 -right-6 w-1/2 aspect-square"
                        >
                          <Image
                            src={benefit.image}
                            alt={benefit.title}
                            width={300}
                            height={300}
                            className="object-contain"
                          />
                        </motion.div>
                      )
                  )}

                  {benefits.map(
                    (benefit, index) =>
                      benefit.id === selectedBenefit && (
                        <motion.div
                          key={benefit.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex items-center gap-6 mb-8">
                            <CardTitle className="text-2xl">
                              {' '}
                              <span
                                className={cn(
                                  'font-mono text-4xl font-bold transition-colors text-primary/30 mr-1'
                                )}
                              >
                                {(index + 1).toString().padStart(2, '0')} 
                              </span>
                              {benefit.title}
                            </CardTitle>
                          </div>
                          <p className="text-lg text-foreground leading-relaxed">
                             - {benefit.description}
                          </p>
                        </motion.div>
                      )
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Center Divider */}
          <div className="hidden md:block w-px bg-gradient-to-b from-primary/30 via-primary/10 to-transparent self-stretch" />

          {/* Right Column - Interactive List */}
          <div className="flex-1 flex flex-col gap-8 py-4">
            {benefits.map((benefit, index) => (
              <motion.button
                key={benefit.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedBenefit(benefit.id)}
                className={cn(
                  'w-full text-left group flex items-center gap-6 px-4 py-2 rounded-lg transition-all relative',
                  selectedBenefit === benefit.id && 'bg-primary/5'
                )}
              >
                <span
                  className={cn(
                    'font-mono text-4xl font-bold transition-colors',
                    selectedBenefit === benefit.id
                      ? 'text-primary'
                      : 'text-primary/30'
                  )}
                >
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <h3
                    className={cn(
                      'text-xl font-semibold transition-colors',
                      selectedBenefit === benefit.id
                        ? 'text-primary'
                        : 'text-foreground/80',
                      'group-hover:text-primary'
                    )}
                  >
                    {benefit.title}
                  </h3>
                </div>
                {selectedBenefit === benefit.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-primary"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
