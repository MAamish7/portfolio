'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-ink',
  {
    variants: {
      variant: {
        default:
          'bg-white text-ink hover:bg-white/90 shadow-[0_10px_40px_-12px_rgba(255,255,255,0.4)]',
        accent: 'bg-accent text-white hover:bg-accent/90 shadow-glow hover:shadow-glow-lg',
        outline:
          'border border-white/15 bg-white/[0.03] text-white backdrop-blur-xl hover:border-white/35 hover:bg-white/[0.07]',
        ghost: 'text-white/70 hover:bg-white/[0.06] hover:text-white',
        link: 'text-accent underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-12 px-6',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-14 px-8 text-base',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
