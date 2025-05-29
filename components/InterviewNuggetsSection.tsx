'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';

const nuggets = [
  {
    id: 1,
    stat: '40%',
    title: 'Performance Boost',
    source: 'Journal of Applied Psychology',
    description: 'Structured mock interviews improve interview performance',
    explanation:
      'Familiarity reduces cognitive load under stress, making you sharper when it counts. The brain power you save on process goes straight to content.',
  },
  {
    id: 2,
    stat: '50%',
    title: 'Better Recall',
    source: 'Production Effect Study',
    description: 'Speaking answers out loud increases memory retention',
    explanation:
      'The production effect—speaking your answers out loud—has been shown to increase memory retention by up to 50%. AI mock interviews simulate this perfectly, helping answers stick when it counts.',
  },
  {
    id: 3,
    stat: '2x',
    title: 'Faster Learning',
    source: 'Feedback Intervention Theory',
    description: 'Real-time feedback cuts improvement time in half',
    explanation:
      "Real-time feedback activates what's known as the feedback intervention theory. It allows learners to correct errors faster and cut their improvement time in half, compared to those practicing without feedback.",
  },
  {
    id: 4,
    stat: '↓70%',
    title: 'Less Anxiety',
    source: 'Frontiers in Psychology, 2022',
    description: 'Virtual practice significantly reduces interview stress',
    explanation:
      'Participants who used virtual simulations before real interviews experienced significantly lower anxiety levels and increased performance under pressure.',
  },
  {
    id: 5,
    stat: '↑30%',
    title: 'Higher Offers',
    source: 'Glassdoor & LinkedIn Data',
    description: 'Structured practice leads to better job offers',
    explanation:
      'Candidates who prepared using structured, repeatable methods received more job offers and reported higher satisfaction in interviews.',
  },
];

export default function InterviewNuggets() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % nuggets.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-1 scroll-mt-24 overflow-hidden bg-foreground-2 px-4 flex flex-col gap-4 h-[350px] relative z-50">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-grid-primary/[0.02] -z-10" />
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto w-full relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-primary mb-4">
            Evidence-Based Interview Prep
          </h2>
          <p className="text-center text-primary/80 max-w-2xl mx-auto text-lg mb-8">
            The science behind why practice works, backed by research and
            real-world data
          </p>
        </motion.div>

        <div className="relative min-h-[200px]">
          {nuggets.map((nugget, index) => (
            <motion.div
              key={nugget.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{
                opacity: activeIndex === index ? 1 : 0,
                x: activeIndex === index ? 0 : 20,
              }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 gap-12 items-center flex justify-between px-4"
              style={{ pointerEvents: activeIndex === index ? 'auto' : 'none' }}
            >
              <div className="flex flex-col items-start gap-4 w-1/3">
                <span className="text-5xl font-bold text-primary/90 font-mono leading-none">
                  {nugget.stat}
                </span>
                <h3 className="text-2xl font-bold text-primary">
                  {nugget.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-primary/60">
                  <BookOpen className="w-4 h-4" />
                  <span>{nugget.source}</span>
                </div>
              </div>

              <div className="space-y-6 w-2/3 pl-8 border-l border-primary/20">
                <p className="text-2xl text-primary/90 font-bold">
                  {nugget.description}
                </p>
                <p className="text-lg text-primary/80 italic leading-relaxed">
                  {nugget.explanation}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
