'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/** Hairline progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[120] h-[2px] origin-left bg-gradient-to-r from-accent via-accent-cyan to-accent-violet"
    />
  );
}
