'use client';

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

const fieldStyles =
  'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder:text-white/25 backdrop-blur-xl transition-all duration-300 hover:border-white/20 focus:border-accent/60 focus:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-accent/25 disabled:opacity-50 aria-[invalid=true]:border-destructive/60 aria-[invalid=true]:ring-destructive/20';

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(fieldStyles, className)} {...props} />
  ),
);
Input.displayName = 'Input';

const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(fieldStyles, 'min-h-[140px] resize-y', className)}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';

export { Input, Textarea };
