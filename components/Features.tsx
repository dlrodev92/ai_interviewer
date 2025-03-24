'use client';
;import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRef } from 'react';

const messages = [
  {
    type: 'question',
    content: 'So tell me the difference between var, let, and const?',
  },
  {
    type: 'answer',
    content: 'Cue: `I guess... I\'ve never used var` 😬',
  },
  {
    type: 'narrator',
    content: 'Sound familiar? Here\'s what no one warns you about:',
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

export default function Features() {
  return (
    <section className="py-24 bg-foreground-2 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-4xl font-bold mb-6">
          Why Practice Talk Interviewing?
        </h2>
        <h3 className="text-2xl text-muted-foreground mb-16">
          Because your keyboard can't help you in a Zoom call.
        </h3>

        {/* Zoom Call Container */}
        <div className="relative min-h-[450px] md-aspect-video md:h-[550px] bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
          {/* Zoom Header */}
          <div className="absolute top-0 w-full bg-zinc-800 px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"/>
            <div className="w-3 h-3 rounded-full bg-yellow-500"/>
            <div className="w-3 h-3 rounded-full bg-green-500"/>
            <span className="text-zinc-400 text-sm ml-2">Interview Meeting</span>
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
                  transition={{ duration: 0.4, delay: 2}}
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
                  transition={{ duration: 0.4, delay: 1.5}}
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
              <i className="fa-solid fa-microphone text-zinc-400"/>
            </button>
            <button className="p-2 bg-zinc-700 rounded-lg">
              <i className="fa-solid fa-video text-zinc-400"/>
            </button>
            <button className="px-4 py-2 bg-red-500 rounded-lg text-sm">
              End Call
            </button>
          </div>
        </div>

        {/* Pain Points Section */}
        <div className="mt-24 relative">
          {/* Background Accent */}
          <div className="absolute -inset-x-full h-full bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
          
          <div className="relative">
            <h4 className="text-3xl md:text-4xl font-bold mb-4 text-center">
              Interview 
              <span className="relative inline-block mx-2">
                Mistakes
                <div className="absolute -bottom-2 left-0 w-full h-2 bg-primary/20" />
              </span>
              to Avoid
            </h4>

            <div className="mt-16 space-y-16">
              {messages.slice(3).map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="flex items-start gap-8 group"
                >
                  {/* Number */}
                  <div className="relative hidden md:block w-24 shrink-0">
                    <span className="absolute -left-4 top-1/2 -translate-y-1/2 text-[120px] font-bold text-primary/10 group-hover:text-primary/20 transition-colors duration-500">
                      {index + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 relative">
                    <div className="relative z-10 bg-card/50 backdrop-blur-sm rounded-lg p-8 border border-border/50 group-hover:border-primary/20 transition-colors duration-500">
                      <h5 className="text-2xl font-bold mb-4 flex items-center gap-4">
                        <span className="text-3xl">{message.title?.split(' ')[0]}</span>
                        <span className="text-foreground/80">{message.title?.split(' ').slice(1).join(' ')}</span>
                      </h5>
                      <p className="text-lg text-muted-foreground">
                        {message.content}
                      </p>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-lg blur-2xl group-hover:opacity-100 opacity-0 transition-opacity duration-500" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}