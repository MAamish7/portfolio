'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { SITE } from '@/constants/site';

/**
 * Loading curtain. Progress is driven by a decaying random walk that finishes
 * as soon as the window `load` event fires, so it never stalls on a slow asset
 * or lingers after everything is ready.
 */
export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let raf = 0;
    let loaded = document.readyState === 'complete';
    const onLoad = () => {
      loaded = true;
    };
    window.addEventListener('load', onLoad);

    // Drive the bar from elapsed time, not frame count — the WebGL scene is
    // initialising behind the curtain and starves rAF, so a per-frame
    // increment would visibly crawl on slower machines.
    const MIN_DURATION = 1400;
    const started = performance.now();
    let current = 0;

    const tick = (now: number) => {
      const elapsed = now - started;
      // easeOutCubic up to a ceiling that only lifts once the page is loaded.
      const t = Math.min(elapsed / MIN_DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const ceiling = loaded ? 100 : 92;
      current = Math.max(current, Math.min(eased * 100, ceiling));
      setProgress(current);

      if (current >= 99.5) {
        setProgress(100);
        // Hold the completed bar for a beat before lifting the curtain.
        window.setTimeout(() => setDone(true), 380);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Hard cap so the site is never held hostage by a hanging resource.
    const failsafe = window.setTimeout(() => {
      loaded = true;
    }, 3000);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(failsafe);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = done ? '' : 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [done]);

  return (
    <AnimatePresence>
      {!done ? (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink"
          exit={{ opacity: 0, filter: 'blur(12px)' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          role="status"
          aria-live="polite"
          aria-label="Loading portfolio"
        >
          <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-40" />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative flex flex-col items-center gap-8 px-6"
          >
            <span className="font-display text-5xl font-bold tracking-tight text-white md:text-7xl">
              {SITE.shortName}
            </span>

            <div className="h-px w-56 overflow-hidden bg-white/10 md:w-80">
              <motion.div
                className="h-full bg-gradient-to-r from-accent via-accent-cyan to-accent-violet"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex w-56 items-center justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-white/40 md:w-80">
              <span>Initialising</span>
              <span className="tabular-nums text-white/70">{Math.round(progress)}%</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
