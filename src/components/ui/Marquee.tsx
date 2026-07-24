'use client';

import { type ReactNode } from 'react';

import { cn } from '@/lib/utils';

type MarqueeProps = {
  items: readonly (string | ReactNode)[];
  className?: string;
  /** Seconds for one full loop — lower is faster. */
  speed?: number;
  reverse?: boolean;
  separator?: ReactNode;
};

/**
 * Infinite CSS marquee. The track is duplicated once and translated by -50%,
 * which loops seamlessly without any JS running per frame.
 */
export function Marquee({
  items,
  className,
  speed = 40,
  reverse = false,
  separator,
}: MarqueeProps) {
  const track = [...items, ...items];

  return (
    <div
      className={cn('mask-fade-x group relative flex overflow-hidden', className)}
      style={{ ['--marquee-duration' as string]: `${speed}s` }}
      aria-hidden
    >
      <div
        className={cn(
          'flex w-max shrink-0 items-center gap-8 pr-8 group-hover:[animation-play-state:paused]',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee',
        )}
      >
        {track.map((item, index) => (
          <span key={index} className="flex items-center gap-8 whitespace-nowrap">
            {item}
            {separator ?? <span className="h-1.5 w-1.5 rounded-full bg-accent/60" aria-hidden />}
          </span>
        ))}
      </div>
    </div>
  );
}
