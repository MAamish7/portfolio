import { motion } from 'motion/react';

import { SparklesCore } from '@/components/ui/sparkles';

/**
 * Transitional band between the hero and the footer.
 *
 * The particle field is masked at its edges so it dissolves into the video
 * rather than ending on a hard rectangle.
 */
export function SparklesBand() {
  return (
    <section
      id="discover"
      className="relative flex w-full flex-col items-center px-5 pb-10 pt-24 text-center sm:px-8 md:pt-40"
      aria-label="Cosmic wonders"
    >
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-[10px] uppercase tracking-[0.32em] text-white/40"
      >
        Cosmic wonders, nightly
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
        className="mt-5 max-w-3xl text-[clamp(2rem,5.5vw,3.75rem)] leading-[1.02] tracking-[-0.035em] text-white"
      >
        Everything above you,
        <br className="hidden sm:block" /> in one clear view
      </motion.h2>

      {/* Particle field with hairline light sources above it */}
      <div className="relative mt-10 h-40 w-full max-w-[40rem]">
        <div className="absolute inset-x-16 top-0 h-[2px] w-3/4 bg-gradient-to-r from-transparent via-white/70 to-transparent blur-sm" />
        <div className="absolute inset-x-16 top-0 h-px w-3/4 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        <div className="absolute inset-x-48 top-0 h-[5px] w-1/4 bg-gradient-to-r from-transparent via-sky-400 to-transparent blur-sm" />
        <div className="absolute inset-x-48 top-0 h-px w-1/4 bg-gradient-to-r from-transparent via-sky-400 to-transparent" />

        {/* The demo hides the field's edges under an opaque plate, which would
            punch a black rectangle through the video here. Masking the field
            itself keeps the same falloff and leaves the footage visible. */}
        <SparklesCore
          id="lumina-sparkles"
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={900}
          className="h-full w-full [mask-image:radial-gradient(420px_190px_at_top,black_15%,transparent_85%)] [-webkit-mask-image:radial-gradient(420px_190px_at_top,black_15%,transparent_85%)]"
          particleColor="#FFFFFF"
          speed={2}
        />
      </div>
    </section>
  );
}
