'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import PulsingCircle from '@/components/ui/PulsingCircle';

export default function AppShowcase() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-background to-background via-foreground-2">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-primary/[0.02] -z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent -z-10" />
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center gap-8">
          <div className="text-center max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Experience Our Platform
            </h2>
            <p className="text-lg text-primary/80">
              Practice interviews on any device, anytime. Get real-time feedback and improve with every session.
            </p>
          </div>

          <div className="relative w-full max-w-[1000px] aspect-[16/10] scale-125 mt-16">
            {/* Image container */}
            <motion.div 
              className="relative w-full h-full"
              initial={{ y: 200, skewY: 10, opacity: 0 }}
              whileInView={{ y: 0, skewY: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <Image
                src="/app_mockup.png"
                alt="Application Interface Mockup"
                fill
                className="object-contain"
                quality={95}
                priority
              />

              <PulsingCircle />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 