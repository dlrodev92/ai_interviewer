'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageSquare,
  Code2,
  Network,
  Check,
  Lightbulb,
  Book,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';

const types = [
  {
    title: 'Behavioral',
    description:
      'Master the art of sharing your experiences and soft skills effectively. Learn to structure your answers using the STAR method and showcase your interpersonal abilities.',
    icon: MessageSquare,
    image: '/confidence_handraw.png',
    shortDesc: 'Perfect your storytelling and demonstrate your soft skills',
    highlights: [
      'STAR method mastery',
      'Conflict resolution scenarios',
      'Leadership examples',
      'Team collaboration stories',
    ],
    tips: [
      'Use specific examples from your experience',
      'Focus on measurable outcomes',
      'Keep responses concise and structured',
      'Practice active listening',
    ],
    preparation: [
      'Research common behavioral questions',
      'Prepare STAR stories for key competencies',
      'Practice with a friend or mentor',
      'Record yourself and analyze responses',
    ],
  },
  {
    title: 'Technical',
    description:
      'Practice coding challenges with real-time feedback and explanations. Get comfortable with live coding, system design discussions, and technical problem-solving.',
    icon: Code2,
    image: '/train_handraw.png',
    shortDesc: 'Ace your coding challenges and technical discussions',
    highlights: [
      'Data structures & algorithms',
      'Live coding practice',
      'Code optimization',
      'Problem-solving strategies',
    ],
    tips: [
      'Think aloud while solving problems',
      'Start with brute force, then optimize',
      'Consider edge cases early',
      'Ask clarifying questions',
    ],
    preparation: [
      'Practice on coding platforms',
      'Review core CS concepts',
      'Study time/space complexity',
      'Mock coding interviews',
    ],
  },
  {
    title: 'System Design',
    description:
      'Learn to design scalable systems and explain your architectural decisions. Practice breaking down complex problems and making informed technical choices.',
    icon: Network,
    image: '/hired_handraw.png',
    shortDesc: 'Design scalable systems with confidence',
    highlights: [
      'Architecture patterns',
      'Scalability principles',
      'Trade-off discussions',
      'Real-world scenarios',
    ],
    tips: [
      'Start with requirements gathering',
      'Draw clear system diagrams',
      'Discuss trade-offs explicitly',
      'Consider scalability from start',
    ],
    preparation: [
      'Study distributed systems',
      'Review real-world architectures',
      'Practice system estimations',
      'Learn about CAP theorem',
    ],
  },
];

export default function InterviewTypes() {
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  return (
    <section
      id="interview-types"
      className="py-24 scroll-mt-24  bg-background relative overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-primary">
          Choose Your Interview Type
        </h2>

        <div className="grid md:grid-cols-3 gap-8 perspective-1000">
          {types.map((type, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="relative h-[500px] cursor-pointer"
            >
              <motion.div
                className="absolute inset-0 preserve-3d duration-500 ease-out"
                animate={{ rotateY: flippedCard === index ? 180 : 0 }}
              >
                {/* Front of card */}
                <Card
                  onClick={() =>
                    setFlippedCard(flippedCard === index ? null : index)
                  }
                  className="absolute inset-0 backface-hidden border-border/50 group hover:shadow-xl transition-shadow duration-300"
                >
                  <CardHeader className="relative pb-0">
                    <div className="absolute top-2 right-2  text-4xl font-bold opacity-40 text-background">
                      {(index + 1).toString().padStart(2, '0')}
                    </div>
                    <div className="relative w-full h-52 mb-6 transition-transform duration-300 group-hover:scale-105">
                      <Image
                        src={type.image}
                        alt={type.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <type.icon className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-2xl text-primary">
                          {type.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-base">
                        {type.shortDesc}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardFooter className="absolute bottom-0 left-0 right-0 justify-center pb-6">
                    <Button
                      variant="outline"
                      className="group/btn relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Explore
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </span>
                      <div className="absolute inset-0 bg-primary opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                    </Button>
                  </CardFooter>
                </Card>

                {/* Back of card */}
                <Card className="absolute inset-0 backface-hidden rotate-y-180 border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{type.title} Interview</span>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {type.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="highlights" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="highlights">Highlights</TabsTrigger>
                        <TabsTrigger value="tips">Tips</TabsTrigger>
                        <TabsTrigger value="prep">Prep</TabsTrigger>
                      </TabsList>
                      <TabsContent
                        value="highlights"
                        className="space-y-2 mt-4"
                      >
                        {type.highlights.map((highlight, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-2 text-primary/80"
                          >
                            <Check className="w-4 h-4" />
                            {highlight}
                          </motion.div>
                        ))}
                      </TabsContent>
                      <TabsContent value="tips" className="space-y-2 mt-4">
                        {type.tips.map((tip, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-2 text-primary/80"
                          >
                            <Lightbulb className="w-4 h-4" />
                            {tip}
                          </motion.div>
                        ))}
                      </TabsContent>
                      <TabsContent value="prep" className="space-y-2 mt-4">
                        {type.preparation.map((prep, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-2 text-primary/80"
                          >
                            <Book className="w-4 h-4" />
                            {prep}
                          </motion.div>
                        ))}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  <CardFooter className="absolute bottom-0 left-0 right-0 justify-center pb-4">
                    <Button
                      variant="ghost"
                      onClick={() => setFlippedCard(null)}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Flip Back
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
