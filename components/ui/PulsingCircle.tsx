import { motion } from 'framer-motion';

interface PulsingCircleProps {
  size?: number;
  color?: string;
  position?: {
    bottom?: string;
    top?: string;
    left?: string;
    right?: string;
  };
  ringCount?: number;
}

export default function PulsingCircle({
  size = 16,
  color = 'red-500',
  position = { top: '11%', right: '25%' },
}: PulsingCircleProps) {
  return (
    <div className="absolute z-10" style={{ ...position }}>
      <motion.div
        className={`absolute bg-${color} rounded-full`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.9, 1, 0.9],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className={`absolute border border-red-400 rounded-full`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: 0,
          top: 0,
        }}
        initial={{ opacity: 0.7, scale: 1 }}
        animate={{ opacity: 0, scale: 4 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: 1.5,
          ease: 'easeOut',
        }}
      />
    </div>
  );
}
