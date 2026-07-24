'use client';

import Lenis from 'lenis';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

import { gsap, ScrollTrigger } from '@/lib/gsap';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

type ScrollContextValue = {
  lenis: Lenis | null;
  /** Smooth-scrolls to an element id, accounting for the sticky navbar. */
  scrollTo: (target: string | number, offset?: number) => void;
};

const ScrollContext = createContext<ScrollContextValue>({ lenis: null, scrollTo: () => {} });

export const useSmoothScroll = () => useContext(ScrollContext);

/**
 * Owns the single Lenis instance and keeps GSAP's ScrollTrigger in lockstep
 * with it, so scroll-driven timelines and smooth scrolling never disagree.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [, force] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;
    force((n) => n + 1);

    // Drive Lenis from GSAP's ticker so both share one RAF loop.
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Lenis scrolls the window natively, so ScrollTrigger only needs to be
    // told when that happens — no scrollerProxy, which would make it read
    // stale positions and stop triggers from firing.
    lenis.on('scroll', ScrollTrigger.update);
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(raf);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  const scrollTo: ScrollContextValue['scrollTo'] = (target, offset = 0) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, { offset, duration: 1.2 });
      return;
    }
    // Reduced-motion (or pre-init) fallback.
    if (typeof target === 'number') {
      window.scrollTo({ top: target + offset });
      return;
    }
    const el = document.querySelector(target);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset });
  };

  return (
    <ScrollContext.Provider value={{ lenis: lenisRef.current, scrollTo }}>
      {children}
    </ScrollContext.Provider>
  );
}
