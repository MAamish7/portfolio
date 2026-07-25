'use client';

import { useEffect, useState } from 'react';

/** SSR-safe media query subscription. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

export const useIsMobile = () => useMediaQuery('(max-width: 768px)');
export const useIsTouch = () => useMediaQuery('(hover: none), (pointer: coarse)');
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
