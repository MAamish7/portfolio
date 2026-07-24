'use client';

import SplitType from 'split-type';
import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

import { EASE, gsap, ScrollTrigger } from '@/lib/gsap';
import { cn } from '@/lib/utils';

type RevealTextProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** 'lines' reads best for paragraphs, 'chars' for short display headings. */
  split?: 'lines' | 'words' | 'chars';
  delay?: number;
  stagger?: number;
  start?: string;
};

/**
 * Scroll-triggered text reveal. SplitType shreds the copy into spans, GSAP
 * staggers them up behind a clipping mask, and the split is reverted on
 * unmount so the DOM (and screen readers) get the original text back.
 */
export function RevealText({
  children,
  as: Tag = 'p',
  className,
  split = 'lines',
  delay = 0,
  stagger = 0.08,
  start = 'top 85%',
}: RevealTextProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el, { opacity: 1 });
      return undefined;
    }

    const instance = new SplitType(el, {
      types: split === 'chars' ? 'words,chars' : split === 'words' ? 'words' : 'lines',
      lineClass: 'reveal-line',
    });

    const targets =
      split === 'chars' ? instance.chars : split === 'words' ? instance.words : instance.lines;
    if (!targets?.length) return undefined;

    // Each line gets its own overflow-hidden wrapper so the text slides in
    // from behind a hard mask instead of just fading.
    if (split === 'lines') {
      instance.lines?.forEach((line) => {
        line.style.overflow = 'hidden';
      });
    }

    gsap.set(el, { opacity: 1 });
    const tween = gsap.from(targets, {
      yPercent: 115,
      opacity: split === 'lines' ? 1 : 0,
      rotate: split === 'chars' ? 4 : 0,
      duration: 1,
      ease: EASE.expo,
      stagger,
      delay,
      scrollTrigger: { trigger: el, start, once: true },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      instance.revert();
    };
  }, [split, delay, stagger, start]);

  return (
    <Tag ref={ref as never} className={cn('opacity-0', className)}>
      {children}
    </Tag>
  );
}
