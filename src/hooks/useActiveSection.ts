'use client';

import { useEffect, useState } from 'react';

/**
 * Scroll-spy built on IntersectionObserver — cheaper than measuring offsets on
 * every scroll frame, and it stays correct when sections resize.
 */
export function useActiveSection(sectionIds: string[], rootMargin = '-45% 0px -50% 0px') {
  const [active, setActive] = useState(sectionIds[0] ?? '');

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin, threshold: [0, 0.2, 0.5, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds, rootMargin]);

  return active;
}
