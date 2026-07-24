'use client';

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useState } from 'react';

import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useSound } from '@/hooks/useSound';

/** Floating scroll-to-top control with a circular progress ring. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const { scrollYProgress } = useScroll();
  const { scrollTo } = useSmoothScroll();
  const { play } = useSound();

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    setVisible(value > 0.12);
    setProgress(value);
  });

  const circumference = 2 * Math.PI * 20;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => {
            play('click');
            scrollTo(0);
          }}
          aria-label="Back to top"
          data-cursor="Top"
          className="group fixed bottom-6 right-6 z-[110] flex h-12 w-12 items-center justify-center rounded-full border border-white/12 bg-black/60 text-white backdrop-blur-xl transition-colors hover:border-accent/60 hover:text-accent md:bottom-8 md:right-8"
        >
          <svg
            className="absolute inset-0 h-full w-full -rotate-90"
            viewBox="0 0 48 48"
            aria-hidden
          >
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1.5"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="url(#btt-gradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
            />
            <defs>
              <linearGradient id="btt-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4F8CFF" />
                <stop offset="100%" stopColor="#A46BFF" />
              </linearGradient>
            </defs>
          </svg>
          <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
