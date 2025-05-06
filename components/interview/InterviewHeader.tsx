'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Info, Check, Lightbulb } from 'lucide-react';

interface InterviewHeaderProps {
  title: string;
  type: 'behavioral' | 'technical' | 'system-design';
}

const typeInfo = {
  'behavioral': {
    title: 'Behavioral Interview',
    description: 'Focus on your past experiences and soft skills. Use the STAR method to structure your answers.',
    tips: [
      'Use the STAR method (Situation, Task, Action, Result)',
      'Prepare stories showcasing leadership and teamwork',
      'Be specific and quantify outcomes when possible',
      'Listen carefully to questions before answering'
    ]
  },
  'technical': {
    title: 'Technical Interview',
    description: 'Prepare to solve coding problems and discuss technical concepts related to your expertise.',
    tips: [
      'Think out loud as you solve problems',
      'Ask clarifying questions before diving in',
      'Consider edge cases in your solutions',
      'Explain your approach before coding'
    ]
  },
  'system-design': {
    title: 'System Design Interview',
    description: 'Demonstrate your ability to design scalable systems and explain architectural decisions.',
    tips: [
      'Clarify requirements and constraints first',
      'Discuss trade-offs in your design decisions',
      'Start with high-level architecture, then get specific',
      'Consider scalability, reliability, and performance'
    ]
  }
};

export default function InterviewHeader({ title, type }: InterviewHeaderProps) {
  const [showTips, setShowTips] = useState(false);
  const info = typeInfo[type];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12 flex flex-col items-center relative"
    >
      <div className="flex items-center justify-between w-full mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-primary">{info.title}</h1>
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-12 w-12 rounded-full"
            onMouseEnter={() => setShowTips(true)}
            onMouseLeave={() => setShowTips(false)}
          >
            <Info size={24} className="text-primary" />
          </Button>
          
          {showTips && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-12 top-2 z-50 w-72"
            >
              <Card className="border-border/50 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb size={20} className="text-yellow-500" />
                    {type.charAt(0).toUpperCase() + type.slice(1)} Interview Tips
                  </CardTitle>
                  <CardDescription>
                    Quick tips to help you succeed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {info.tips.map((tip, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0,  x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + (index * 0.1) }}
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
          )}
        </div>
      </div>
      
      <p className="text-muted-foreground max-w-2xl text-center mb-6">
        {info.description}
      </p>
    </motion.div>
  );
}