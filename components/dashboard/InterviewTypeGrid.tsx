'use client';

import { MessageSquare, Code2, Network } from 'lucide-react';
import InterviewTypeCard from '@/components/dashboard/InterviewTypeCard';

// Interview type definitions
const interviewTypes = [
  {
    title: 'Behavioral',
    description: 'Master the art of sharing your experiences and soft skills effectively.',
    icon: MessageSquare,
    image: '/confidence_handraw.png',
    path: 'dashboard/interview/behavioral',
    shortDesc: 'STAR method and soft skills'
  },
  {
    title: 'Technical',
    description: 'Practice coding challenges with real-time feedback and explanations.',
    icon: Code2,
    image: '/train_handraw.png',
    path: 'dashboard/interview/technical',
    shortDesc: 'Coding and problem-solving'
  },
  {
    title: 'System Design',
    description: 'Learn to design scalable systems and explain your architectural decisions.',
    icon: Network,
    image: '/hired_handraw.png',
    path: 'dashboard/interview/system-design',
    shortDesc: 'Scalable architecture design'
  },
];

export default function InterviewTypeGrid() {
  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {interviewTypes.map((type, index) => (
        <InterviewTypeCard
          key={index}
          title={type.title}
          description={type.description}
          shortDesc={type.shortDesc}
          image={type.image}
          path={type.path}
          icon={type.icon}
          index={index}
        />
      ))}
    </div>
  );
}