import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Tailwind-aware className joiner — the shadcn convention. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
