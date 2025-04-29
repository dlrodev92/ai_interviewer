'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CreditsCardProps {
  creditsAvailable: number;
}

export default function CreditsCard({ creditsAvailable }: CreditsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="mt-16 max-w-6xl mx-auto"
    >
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">Credits Available</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-3xl font-bold mb-2">{creditsAvailable}</p>
            <p className="text-muted-foreground">Free interview tokens remaining</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}