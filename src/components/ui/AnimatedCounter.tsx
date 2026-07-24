'use client';

import { useCounter } from '@/hooks/useCounter';
import { cn } from '@/lib/utils';

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
};

/** Number that counts up the first time it enters the viewport. */
export function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  className,
}: AnimatedCounterProps) {
  const { ref, value: current } = useCounter(value, { decimals });

  return (
    <span
      ref={ref}
      className={cn('font-display tabular-nums', className)}
      // Announce the final figure rather than every intermediate frame.
      aria-label={`${prefix}${value}${suffix}`}
    >
      <span aria-hidden>
        {prefix}
        {current.toFixed(decimals)}
        {suffix}
      </span>
    </span>
  );
}
