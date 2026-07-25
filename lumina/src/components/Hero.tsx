import { motion } from 'motion/react';
import { ArrowUpRight, Play } from 'lucide-react';

const MODES = ['Observe', 'Orbit', 'Drift'];

/**
 * Upper CTA block. Sits above the fixed video and is deliberately left-weighted
 * so the footage stays visible through the right half of the frame.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="flex min-h-[100svh] w-full flex-col justify-center px-5 pb-24 pt-32 sm:px-8 md:px-10"
      aria-label="Introduction"
    >
      <div className="flex w-full flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          {/* Release chip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="liquid-glass liquid-glass-pill inline-flex items-center gap-2.5 py-1.5 pl-1.5 pr-4"
          >
            <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-black">
              New
            </span>
            <span className="text-xs text-white/70">Lumina 2.0 is out now</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
            className="mt-7 text-[clamp(2.6rem,7vw,5.25rem)] leading-[0.95] tracking-[-0.04em] text-white"
          >
            Step into your
            <br />
            Personal Palace
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
            className="mt-6 max-w-md text-sm leading-relaxed text-white/60 md:text-base"
          >
            Premium clarity on global events and cosmic wonders — a fast, smooth surface that helps
            you move seamlessly between watching, working and resting.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href="#download"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black transition-colors duration-300 hover:bg-white/85"
            >
              Get Lumina free
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
            <a
              href="#stream"
              className="liquid-glass liquid-glass-pill group inline-flex items-center gap-3 py-2 pl-2 pr-5 text-sm text-white/80 transition-colors duration-300 hover:text-white"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors duration-300 group-hover:bg-white/20">
                <Play size={12} className="ml-0.5 fill-current" />
              </span>
              Watch the film
              <span className="text-white/40">1:35</span>
            </a>
          </motion.div>
        </div>

        {/* Mode switcher — echoes the vertical pill stack in the reference */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: 'easeOut' }}
          className="flex flex-row gap-2 md:flex-col md:items-end"
        >
          {MODES.map((mode, index) => (
            <button
              key={mode}
              type="button"
              className={
                index === 0
                  ? 'rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black transition-colors duration-300'
                  : 'liquid-glass liquid-glass-pill px-6 py-2.5 text-sm text-white/60 transition-colors duration-300 hover:text-white'
              }
            >
              {mode}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
