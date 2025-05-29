'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import UserStartSigningButton from './UserStartSigningButton';

export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-foreground-2 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-primary/[0.02] -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-float-slow" />
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl -z-10 animate-float-medium" />

      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center space-y-12"
        >
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center gap-2 text-primary/80 mb-4"
            >
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wider uppercase">
                Ready to level up?
              </span>
              <Sparkles className="w-5 h-5" />
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 gradient-hero-text">
              Stop Hoping.
              <br />
              Start Knowing.
            </h2>

            <p className="text-xl md:text-2xl text-primary/80 max-w-3xl mx-auto leading-relaxed">
              Try our beta version of MockInterviewerAI, the only AI-powered
              interview practice platform.
              <br />
              <span className="font-semibold text-primary">
                Practice today. Get hired tomorrow.
              </span>
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <UserStartSigningButton text="Start Your First Interview Now" />
          </motion.div>

         
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="pt-8 border-t border-primary/10"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-primary/60">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Free to try</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Practice immediately</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
