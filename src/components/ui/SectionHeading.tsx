'use client';

import type { ReactNode } from 'react';

import { RevealText } from '@/components/ui/RevealText';
import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
};

/** Shared eyebrow + headline + lede block used by every section. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-5',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span className="h-px w-10 bg-gradient-to-r from-accent to-transparent" aria-hidden />
        <span className="eyebrow">{eyebrow}</span>
      </div>
      {/* Solid fill, not a clipped gradient: SplitType moves the text into
          child spans, which have no background of their own to clip against. */}
      <RevealText
        as="h2"
        split="chars"
        stagger={0.02}
        className="heading-xl font-display font-bold text-white"
      >
        {title}
      </RevealText>
      {description ? (
        <RevealText
          className={cn(
            'max-w-2xl text-base leading-relaxed text-white/55 md:text-lg',
            align === 'center' && 'mx-auto',
          )}
        >
          {description}
        </RevealText>
      ) : null}
    </header>
  );
}
