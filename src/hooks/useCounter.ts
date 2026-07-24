'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Counts from 0 to `target` once the element scrolls into view.
 * Uses rAF rather than a GSAP tween so the value stays a React state that
 * screen readers can announce.
 */
export function useCounter(target: number, { duration = 1800, decimals = 0 } = {}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setValue(target);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;

        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          // easeOutExpo — fast start, gentle settle.
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          setValue(Number((target * eased).toFixed(decimals)));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [target, duration, decimals]);

  return { ref, value };
}
