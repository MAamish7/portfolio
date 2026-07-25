import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Tailwind-aware className joiner (the shadcn convention). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Base path the site is served from. Empty on Vercel (domain root), `/portfolio`
 * on GitHub Pages, which serves a project repo from a subdirectory.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/**
 * Prefixes a public-folder path with the base path.
 *
 * Next rewrites its own `_next/*` URLs automatically, but plain `href`s and
 * `next/image` sources for unoptimised images are left alone — without this
 * they resolve against the domain root and 404 on Pages.
 */
export const asset = (path: string) => `${BASE_PATH}${path}`;

/** Clamp a number into a range. */
export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/** Linear interpolation — used by the cursor and parallax easing. */
export const lerp = (start: number, end: number, amount: number) =>
  start * (1 - amount) + end * amount;

/** Map a value from one range onto another. */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) => outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin || 1);

export const ACCENT_HEX = {
  blue: '#4F8CFF',
  cyan: '#4FE3E3',
  violet: '#A46BFF',
} as const;

export type AccentName = keyof typeof ACCENT_HEX;

/** Tailwind class fragments per accent, kept here so the strings stay static
 *  and survive Tailwind's content scan. */
export const ACCENT_CLASSES: Record<
  AccentName,
  { text: string; border: string; bg: string; shadow: string; from: string }
> = {
  blue: {
    text: 'text-accent',
    border: 'border-accent/40',
    bg: 'bg-accent/10',
    shadow: 'shadow-[0_0_50px_-12px_rgba(79,140,255,0.55)]',
    from: 'from-accent/25',
  },
  cyan: {
    text: 'text-accent-cyan',
    border: 'border-accent-cyan/40',
    bg: 'bg-accent-cyan/10',
    shadow: 'shadow-[0_0_50px_-12px_rgba(79,227,227,0.5)]',
    from: 'from-accent-cyan/25',
  },
  violet: {
    text: 'text-accent-violet',
    border: 'border-accent-violet/40',
    bg: 'bg-accent-violet/10',
    shadow: 'shadow-[0_0_50px_-12px_rgba(164,107,255,0.5)]',
    from: 'from-accent-violet/25',
  },
};
