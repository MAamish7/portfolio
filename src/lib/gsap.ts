/**
 * Central GSAP entry point.
 *
 * Importing from here (rather than from 'gsap' directly) guarantees the
 * plugins are registered exactly once and only in the browser.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  // registerPlugin is idempotent, so a repeat import is harmless.
  gsap.registerPlugin(ScrollTrigger);

  // Animations are transform/opacity only, so let GSAP batch its reads/writes.
  gsap.defaults({ ease: 'power3.out', duration: 0.9 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** Shared easing curves so section timelines feel like one system. */
export const EASE = {
  out: 'power3.out',
  inOut: 'power2.inOut',
  expo: 'expo.out',
  soft: 'sine.inOut',
} as const;

export { gsap, ScrollTrigger };
