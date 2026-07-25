'use client';

import { useRef, type ReactNode } from 'react';

import { useIsTouch } from '@/hooks/useMediaQuery';
import { useSound } from '@/hooks/useSound';
import { gsap } from '@/lib/gsap';
import { cn } from '@/lib/utils';

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  /** How far the element is allowed to chase the cursor, in px. */
  strength?: number;
  as?: 'div' | 'span';
};

/**
 * Wraps any control and pulls it toward the pointer. Disabled on touch
 * devices, where there is no hover to respond to.
 */
export function MagneticButton({
  children,
  className,
  strength = 22,
  as: Tag = 'div',
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouch();
  const { play } = useSound();

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    gsap.to(ref.current, {
      x: (x / rect.width) * strength * 2,
      y: (y / rect.height) * strength * 2,
      duration: 0.5,
      ease: 'power3.out',
    });
  };

  const reset = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
  };

  return (
    <Tag
      ref={ref as never}
      className={cn('inline-flex will-change-transform', className)}
      onMouseMove={handleMove}
      onMouseEnter={() => play('hover')}
      onMouseLeave={reset}
    >
      {children}
    </Tag>
  );
}
