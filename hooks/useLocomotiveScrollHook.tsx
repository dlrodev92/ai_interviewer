'use client';

import { useEffect, useRef, createContext, useContext, RefObject } from 'react';
import 'locomotive-scroll/dist/locomotive-scroll.css';

type ScrollRef = RefObject<HTMLDivElement | null>;

const LocomotiveScrollContext = createContext<ScrollRef | null>(null);

export function LocomotiveProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import('locomotive-scroll')).default;

      if (!scrollRef.current) return;

      const scroll = new LocomotiveScroll({
        el: scrollRef.current,
        smooth: true,
        multiplier: 0.8,
        reloadOnContextChange: true,
        touchMultiplier: 2,
        smoothMobile: true,
      });

      return () => scroll.destroy();
    })();
  }, []);

  return (
    <LocomotiveScrollContext.Provider value={scrollRef}>
      <div ref={scrollRef} data-scroll-container>
        {children}
      </div>
    </LocomotiveScrollContext.Provider>
  );
}
export function useLocomotiveScrollRef() {
  const context = useContext(LocomotiveScrollContext);
  if (context === null) {
    throw new Error(
      'useLocomotiveScrollRef must be used within a LocomotiveScrollProvider'
    );
  }
  return context;
}
