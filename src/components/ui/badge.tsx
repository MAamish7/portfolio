import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] transition-colors',
  {
    variants: {
      variant: {
        default: 'border-white/12 bg-white/[0.04] text-white/70',
        accent: 'border-accent/35 bg-accent/10 text-accent',
        cyan: 'border-accent-cyan/35 bg-accent-cyan/10 text-accent-cyan',
        violet: 'border-accent-violet/35 bg-accent-violet/10 text-accent-violet',
        outline: 'border-white/20 text-white/60',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
