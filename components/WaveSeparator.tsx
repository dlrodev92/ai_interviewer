'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function WaveSeparator() {
  const waveRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(waveRef, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={waveRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8, ease: 'easeIn' }}
      className="bg-wave relative h-96 aspect-[960/30] w-full bg-[url('/separator-1.svg')] bg-repeat bg-cover bg-center"
    />
  );
}
