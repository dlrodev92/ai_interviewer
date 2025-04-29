'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface InterviewTypeCardProps {
  title: string;
  description: string;
  shortDesc: string;
  image: string;
  path: string;
  icon: LucideIcon;
  index: number;
}

export default function InterviewTypeCard({
  title,
  description,
  shortDesc,
  image,
  path,
  icon: Icon,
  index,
}: InterviewTypeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="relative aspect-square"
    >
      <Card className="border-border/50 flex flex-col group hover:shadow-xl hover:-translate-y-10 transition-all duration-500">
        <CardHeader className="pb-0 flex-shrink-0">
          <div className="absolute top-2 right-2 text-4xl font-bold opacity-40 text-background">
            {(index + 1).toString().padStart(2, '0')}
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl text-primary">{title}</CardTitle>
          </div>
          <CardDescription className="text-base font-medium">
            {shortDesc}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-4 flex-grow flex items-center justify-center">
          <div className="relative w-full h-40 transition-transform duration-300 group-hover:scale-105">
            <Image
              src={image}
              alt={title}
              fill
              className="object-contain"
            />
          </div>
        </CardContent>
        
        <CardFooter className="mt-auto pb-6">
          <Link href={path} className="w-full">
            <Button 
              className="w-full group/btn relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Start Interview
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-primary opacity-0 group-hover/btn:opacity-10 transition-opacity" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}