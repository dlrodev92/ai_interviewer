'use client';

import { motion } from 'framer-motion';

interface DashboardHeaderProps {
  title: string;
  description?: string;
}

export default function DashboardHeader({
  title,
  description,
}: DashboardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-12 text-center"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-primary">
        {title}
      </h2>
      {description && <p className="max-w-2xl mx-auto">{description}</p>}
    </motion.div>
  );
}
