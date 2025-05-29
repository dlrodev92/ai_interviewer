'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRef } from 'react';

const messages = [
  {
    type: 'question',
    content: 'So tell me the difference between var, let, and const?',
  },
  {
    type: 'answer',
    content: `I guess... var is for functions 😬`,
  },
  {
    type: 'narrator',
    content: "Sound familiar? Here's what no one warns you about:",
  },
  {
    type: 'narrator',
    content: 'Well, we better wrap up here.',
  },
  {
    type: 'answer',
    content: '...',
  },
  {
    type: 'pain-point',
    title: '💥 The Ramble',
    content: 'No structure. No point. Just... words.',
  },
  {
    type: 'pain-point',
    title: '💥 The Mic Moment',
    content: 'You know the answer. But it comes out shaky and unsure.',
  },
];

const benefits = [
  'Speak with clarity and structure',
  'Handle follow-ups without freezing',
  'Sound like the expert you already are',
];

export default function MockZoomComponent() {
  return (
    <section className="py-24 bg-foreground-2 relative overflow-hidden z-50">
      <div className="max-w-4xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 40, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="text-4xl font-bold mb-6 text-primary"
        >
          This isWhy You Must Practice Before Talk Interviews?
        </motion.h2>
        <motion.p
          initial={{ opacity: 40, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="text-xl text-primary mb-16"
        >
          Because the difference between hoping you'll do well and knowing
          you'll crush it isn't talent—it's preparation.
        </motion.p>

        {/* Zoom Call Container */}
        <motion.div
          initial={{ y: 200, skewY: 10, opacity: 0 }}
          whileInView={{ y: 0, skewY: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.2 }}
          className="relative min-h-[450px] md-aspect-video md:h-[550px] bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-zinc-800"
        >
          {/* Zoom Header */}
          <div className="absolute top-0 w-full bg-zinc-800 px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-zinc-400 text-sm ml-2">
              Interview Meeting
            </span>
          </div>

          {/* Participants Grid */}
          <div className=" inset-0 mt-10 p-4 grid grid-cols-2 gap-4">
            {/* Interviewer */}
            <div className="relative">
              <div className="relative aspect-video bg-zinc-800 rounded-lg overflow-hidden">
                <Image
                  src="/interviewer.webp"
                  alt="Interviewer"
                  fill
                  className="object-cover"
                />
              </div>

              <motion.div
                className="bg-primary p-3 rounded-xl max-w-[200px] mt-4"
                whileInView={{ opacity: 1, y: 20 }}
                animate={{ opacity: 0, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
              >
                <p className="text-sm">{messages[0].content}</p>
              </motion.div>

              <motion.div
                className="bg-primary p-3 rounded-xl max-w-[200px] mt-4"
                whileInView={{ opacity: 1, y: 20 }}
                animate={{ opacity: 0, y: 0 }}
                transition={{ duration: 0.4, delay: 2 }}
              >
                <p className="text-sm">{messages[3].content}</p>
              </motion.div>
            </div>

            {/* Candidate */}
            <div className="relative">
              <div className="relative aspect-video bg-zinc-800 rounded-lg overflow-hidden">
                <Image
                  src="/candidate.webp"
                  alt="Candidate"
                  fill
                  className="object-cover"
                />
              </div>
              <motion.div
                whileInView={{ opacity: 1, y: 20 }}
                animate={{ opacity: 0, y: 0 }}
                transition={{ duration: 0.4, delay: 1.5 }}
                className="bg-primary p-3 rounded-xl max-w-[200px] mt-4"
              >
                <p className="text-sm">{messages[1].content}</p>
              </motion.div>

              <motion.div
                className="bg-primary p-3 rounded-xl max-w-[200px] mt-4"
                whileInView={{ opacity: 1, y: 20 }}
                animate={{ opacity: 0, y: 0 }}
                transition={{ duration: 0.4, delay: 2.5 }}
              >
                <p className="text-sm">{messages[4].content}</p>
              </motion.div>
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-0 w-full bg-zinc-800 px-4 py-2 flex items-center justify-center gap-4">
            <button className="p-2 bg-zinc-700 rounded-lg">
              <i className="fa-solid fa-microphone text-zinc-400" />
            </button>
            <button className="p-2 bg-zinc-700 rounded-lg">
              <i className="fa-solid fa-video text-zinc-400" />
            </button>
            <button className="px-4 py-2 bg-red-500 rounded-lg text-sm">
              End Call
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
