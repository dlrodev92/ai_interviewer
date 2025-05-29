'use client';

import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check, Lightbulb } from 'lucide-react';

interface InterviewTipsProps {
  type: 'behavioral' | 'technical' | 'system-design';
}

const typeMap = {
  behavioral: {
    title: 'Behavioral Interview Tips',
    tips: [
      'Use the STAR method (Situation, Task, Action, Result)',
      'Prepare stories showcasing leadership and teamwork',
      'Be specific and quantify outcomes when possible',
      'Listen carefully to questions before answering',
    ],
  },
  technical: {
    title: 'Technical Interview Tips',
    tips: [
      'Think out loud as you solve problems',
      'Ask clarifying questions before diving in',
      'Consider edge cases in your solutions',
      'Explain your approach before coding',
    ],
  },
  'system-design': {
    title: 'System Design Tips',
    tips: [
      'Clarify requirements and constraints first',
      'Discuss trade-offs in your design decisions',
      'Start with high-level architecture, then get specific',
      'Consider scalability, reliability, and performance',
    ],
  },
};

export default function InterviewTips({ type }: InterviewTipsProps) {
  const { title, tips } = typeMap[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb size={16} className="text-yellow-500" />
            {title}
          </CardTitle>
          <CardDescription>Quick tips to help you succeed</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {tips.map((tip, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-start gap-2"
              >
                <Check size={16} className="mt-1 text-primary" />
                <span className="text-sm">{tip}</span>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
