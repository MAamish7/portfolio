'use client';

import { useEffect, useRef, useState } from 'react';

import { useIsTouch, usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { lerp } from '@/lib/utils';

/**
 * Two-part cursor: a crisp dot that tracks the pointer exactly, and a ring
 * that lags behind it. Written straight to the DOM inside a rAF loop — no
 * React state per frame.
 */
export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const isTouch = useIsTouch();
  const reduced = usePrefersReducedMotion();
  const disabled = isTouch || reduced;

  useEffect(() => {
    if (disabled) return undefined;

    document.documentElement.classList.add('has-custom-cursor');

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...pos };
    let hovering = false;
    let visible = false;
    let raf = 0;

    const onMove = (event: PointerEvent) => {
      pos.x = event.clientX;
      pos.y = event.clientY;
      if (!visible) {
        visible = true;
        if (dot.current) dot.current.style.opacity = '1';
        if (ring.current) ring.current.style.opacity = '1';
      }

      const target = (event.target as HTMLElement)?.closest<HTMLElement>(
        'a, button, [role="button"], input, textarea, select, [data-cursor]',
      );
      const nextHovering = Boolean(target);
      const nextLabel = target?.dataset.cursor ?? null;
      if (nextHovering !== hovering) hovering = nextHovering;
      setLabel((prev) => (prev === nextLabel ? prev : nextLabel));
    };

    const onLeave = () => {
      visible = false;
      if (dot.current) dot.current.style.opacity = '0';
      if (ring.current) ring.current.style.opacity = '0';
    };

    const render = () => {
      ringPos.x = lerp(ringPos.x, pos.x, 0.16);
      ringPos.y = lerp(ringPos.y, pos.y, 0.16);

      if (dot.current) {
        dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      if (ring.current) {
        const scale = hovering ? 1.9 : 1;
        ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%) scale(${scale})`;
        ring.current.style.borderColor = hovering
          ? 'rgba(79,140,255,0.9)'
          : 'rgba(255,255,255,0.35)';
      }
      raf = requestAnimationFrame(render);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[150]">
      <div
        ref={ring}
        className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border opacity-0 transition-[opacity,background-color] duration-300"
        style={{ borderColor: 'rgba(255,255,255,0.35)' }}
      >
        {label ? (
          <span className="whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.16em] text-white">
            {label}
          </span>
        ) : null}
      </div>
      <div
        ref={dot}
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-accent opacity-0 shadow-[0_0_12px_rgba(79,140,255,0.9)] transition-opacity duration-300"
      />
    </div>
  );
}
