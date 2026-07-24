'use client';

import type { ReactNode } from 'react';

import { SmoothScrollProvider } from '@/hooks/useSmoothScroll';
import { SoundProvider } from '@/hooks/useSound';

/** Client-side context providers, kept out of the server layout. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <SoundProvider>
      <SmoothScrollProvider>{children}</SmoothScrollProvider>
    </SoundProvider>
  );
}
