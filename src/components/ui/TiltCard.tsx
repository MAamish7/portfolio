'use client';

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

import { useIsTouch } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees on each axis. */
  intensity?: number;
  /** Renders a cursor-tracking sheen over the card. */
  glare?: boolean;
};

/**
 * 3D tilt on pointer move, driven by springs so it settles rather than snaps.
 * The animated border/glare follow the same pointer values.
 */
export function TiltCard({ children, className, intensity = 8, glare = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouch();

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const springConfig = { stiffness: 180, damping: 20, mass: 0.6 };
  const rotateX = useSpring(useMotionValue(0), springConfig);
  const rotateY = useSpring(useMotionValue(0), springConfig);

  const xPct = useTransform(x, (v) => `${(v * 100).toFixed(2)}%`);
  const yPct = useTransform(y, (v) => `${(v * 100).toFixed(2)}%`);
  const glareBackground = useMotionTemplate`radial-gradient(420px circle at ${xPct} ${yPct}, rgba(255,255,255,0.09), transparent 65%)`;

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    x.set(px);
    y.set(py);
    rotateY.set((px - 0.5) * intensity * 2);
    rotateX.set(-(py - 0.5) * intensity * 2);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className={cn('group relative preserve-3d will-change-transform', className)}
    >
      {children}
      {glare && !isTouch ? (
        <motion.span
          aria-hidden
          style={{ background: glareBackground }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      ) : null}
    </motion.div>
  );
}
