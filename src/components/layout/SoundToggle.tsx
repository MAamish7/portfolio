'use client';

import { Volume2, VolumeX } from 'lucide-react';

import { useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';

/** Toggles the synthesised UI sound cues. */
export function SoundToggle() {
  const { enabled, toggle } = useSound();

  return (
    <button
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? 'Mute interface sounds' : 'Enable interface sounds'}
      title={enabled ? 'Sound on' : 'Sound off'}
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300',
        enabled
          ? 'border-accent/45 bg-accent/12 text-accent shadow-glow'
          : 'border-white/12 bg-white/[0.04] text-white/50 hover:border-white/30 hover:text-white',
      )}
    >
      {enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      {/* Equaliser bars double as the on-state indicator */}
      {enabled ? (
        <span className="sr-only">Interface sounds are on</span>
      ) : (
        <span className="sr-only">Interface sounds are off</span>
      )}
    </button>
  );
}
