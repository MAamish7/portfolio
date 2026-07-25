'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

/**
 * Konami-code easter egg: enter the sequence (or press `M` three times) and
 * the page runs a short "stress test" flourish.
 */
export function EasterEgg() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let index = 0;

    const onKey = (event: KeyboardEvent) => {
      // Ignore keystrokes aimed at the contact form.
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;

      const expected = SEQUENCE[index];
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

      if (key === expected) {
        index += 1;
        if (index === SEQUENCE.length) {
          index = 0;
          setActive(true);
          window.setTimeout(() => setActive(false), 4200);
        }
      } else {
        index = key === SEQUENCE[0] ? 1 : 0;
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!active) return undefined;
    // Tint the whole page like an FEA stress plot while the egg runs.
    document.documentElement.style.filter = 'hue-rotate(200deg) saturate(1.5)';
    document.documentElement.style.transition = 'filter 900ms ease';
    return () => {
      document.documentElement.style.filter = '';
    };
  }, [active]);

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="fixed bottom-24 left-1/2 z-[130] -translate-x-1/2 rounded-2xl border border-accent-cyan/40 bg-black/80 px-6 py-4 text-center backdrop-blur-2xl"
          role="status"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-accent-cyan">
            Load case applied
          </p>
          <p className="mt-1.5 font-display text-lg font-semibold text-white">
            Stress plot engaged — factor of safety: ∞
          </p>
          <div
            className="mt-3 h-1.5 w-56 rounded-full"
            style={{
              background: 'linear-gradient(90deg,#2b59d8,#34b1c9,#41c46a,#e7d24a,#e8731f,#d6443a)',
            }}
            aria-hidden
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
