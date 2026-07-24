'use client';

import { useEffect, useRef } from 'react';

export type Pointer = { x: number; y: number; nx: number; ny: number };

/**
 * Pointer tracking as a ref rather than state — consumers read it inside
 * animation frames, so re-rendering on every mousemove would be wasteful.
 * `nx`/`ny` are normalised to -1…1 around the viewport centre.
 */
export function useMousePosition() {
  const pointer = useRef<Pointer>({ x: 0, y: 0, nx: 0, ny: 0 });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = event.clientX;
      pointer.current.y = event.clientY;
      pointer.current.nx = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.ny = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return pointer;
}
