'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

type SoundName = 'hover' | 'click' | 'reveal';

type SoundContextValue = {
  enabled: boolean;
  toggle: () => void;
  play: (name: SoundName) => void;
};

const SoundContext = createContext<SoundContextValue>({
  enabled: false,
  toggle: () => {},
  play: () => {},
});

export const useSound = () => useContext(SoundContext);

/** Tone recipe per cue — kept tiny so no audio files ship with the site. */
const TONES: Record<
  SoundName,
  { freq: number; duration: number; type: OscillatorType; gain: number }
> = {
  hover: { freq: 880, duration: 0.05, type: 'sine', gain: 0.03 },
  click: { freq: 420, duration: 0.11, type: 'triangle', gain: 0.05 },
  reveal: { freq: 1320, duration: 0.16, type: 'sine', gain: 0.025 },
};

/**
 * Synthesises UI blips with the Web Audio API. Off by default — sound only
 * starts after an explicit user gesture, which is also what browsers require.
 */
export function SoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      if (next && !ctxRef.current && typeof window !== 'undefined') {
        const Ctor = window.AudioContext ?? (window as any).webkitAudioContext;
        if (Ctor) ctxRef.current = new Ctor();
      }
      void ctxRef.current?.resume();
      return next;
    });
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      const ctx = ctxRef.current;
      if (!enabled || !ctx) return;

      const { freq, duration, type, gain } = TONES[name];
      const osc = ctx.createOscillator();
      const amp = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      amp.gain.setValueAtTime(0, ctx.currentTime);
      amp.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.01);
      amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(amp).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration + 0.02);
    },
    [enabled],
  );

  const value = useMemo(() => ({ enabled, toggle, play }), [enabled, toggle, play]);
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}
