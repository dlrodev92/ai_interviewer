'use client';

import { motion, type MotionProps } from 'framer-motion';

interface WaveSeparatorProps extends MotionProps {
  bgUrl: string;
}

export default function WaveSeparator({ bgUrl, ...motionProps }: WaveSeparatorProps) {
  return (
    <motion.div
      className="bg-wave relative h-96 aspect-[960/30] w-full bg-repeat bg-cover bg-center z-5"
      style={{ backgroundImage: `url(${bgUrl})` }}
      {...motionProps}
    />
  );
}
