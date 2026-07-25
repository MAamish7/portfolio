'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Download, Github, Linkedin } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { Marquee } from '@/components/ui/Marquee';
import { MARQUEE_WORDS, SITE } from '@/constants/site';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { EASE, gsap } from '@/lib/gsap';
import { asset } from '@/lib/utils';

// The WebGL bundle is heavy and purely decorative — keep it out of the
// critical path and off the server.
const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => null,
});

/** Cycles through job titles one character at a time. */
function Typewriter({ words, className }: { words: readonly string[]; className?: string }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index % words.length];
    const complete = text === word;
    const empty = text === '';

    const delay = deleting ? 40 : complete ? 1900 : 85;
    const timer = window.setTimeout(() => {
      if (!deleting && complete) {
        setDeleting(true);
      } else if (deleting && empty) {
        setDeleting(false);
        setIndex((prev) => prev + 1);
      } else {
        setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1));
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [text, deleting, index, words]);

  return (
    <span className={className}>
      {/* Screen readers get the full list; sighted users get the animation. */}
      <span className="sr-only">{words.join(', ')}</span>
      <span aria-hidden>
        {text}
        <span className="ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[0.1em] animate-blink bg-accent" />
      </span>
    </span>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { scrollTo } = useSmoothScroll();
  const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end start'] });

  // Parallax: the portrait and headline leave at different rates.
  const figureY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-22%']);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set('[data-hero-anim]', { opacity: 1, y: 0 });
        return;
      }

      // Curtain-up sequence, held back so it plays after the preloader lifts.
      gsap
        .timeline({ delay: 0.85, defaults: { ease: EASE.expo } })
        .from('[data-hero-anim="eyebrow"]', { y: 24, opacity: 0, duration: 0.9 })
        .from(
          '[data-hero-anim="line1"] .hero-word',
          { yPercent: 118, opacity: 0, duration: 1.15, stagger: 0.07 },
          '-=0.6',
        )
        .from(
          '[data-hero-anim="line2"] .hero-word',
          { yPercent: 118, opacity: 0, duration: 1.15, stagger: 0.07 },
          '-=0.95',
        )
        .from('[data-hero-anim="figure"]', { opacity: 0, scale: 1.06, duration: 1.4 }, '-=1.1')
        .from('[data-hero-anim="sub"]', { y: 26, opacity: 0, duration: 0.9 }, '-=0.85')
        .from('[data-hero-anim="cta"]', { y: 24, opacity: 0, duration: 0.8 }, '-=0.65')
        .from('[data-hero-anim="meta"]', { opacity: 0, duration: 0.8, stagger: 0.08 }, '-=0.6');
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={root}
      className="noise-overlay relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden pb-28 pt-28 md:pb-32"
      aria-label="Introduction"
    >
      {/* WebGL backdrop */}
      <HeroScene className="pointer-events-none absolute inset-0 -z-10 h-full w-full" />
      <div className="grid-backdrop pointer-events-none absolute inset-0 -z-10 opacity-50" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-64 bg-gradient-to-t from-ink to-transparent" />

      <motion.div
        style={{ opacity: fade }}
        className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-14"
      >
        {/* Portrait cutout. On desktop it sits between the two headline lines;
            on mobile there is no room to flank it, so it drops behind the copy
            at reduced opacity with a scrim to keep the text legible. */}
        <motion.div
          style={{ y: figureY }}
          data-hero-anim="figure"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center opacity-40 md:bottom-auto md:top-1/2 md:z-10 md:-translate-y-[46%] md:opacity-100"
        >
          <div className="relative">
            <div
              className="absolute left-1/2 top-1/2 h-[62vh] w-[62vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/12 blur-[110px]"
              aria-hidden
            />
            <Image
              src={asset('/images/figure-a.png')}
              alt={`${SITE.name}, ${SITE.role}`}
              width={900}
              height={2000}
              priority
              sizes="(max-width: 768px) 55vw, 34vw"
              className="mask-fade-b relative h-[38vh] w-auto object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.65)] md:h-[58vh] lg:h-[64vh]"
            />
            {/* Grounding shadow so the figure dissolves into the page */}
            <div
              className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink via-ink/80 to-transparent"
              aria-hidden
            />
          </div>
        </motion.div>

        {/* Mobile-only scrim: the WebGL scene and the figure both sit behind the
            copy on narrow screens, so darken everything under the text. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-ink/45 via-ink/70 to-ink/45 md:hidden"
        />

        <motion.div style={{ y: contentY }} className="relative z-20">
          <div
            data-hero-anim="eyebrow"
            className="mb-6 flex flex-wrap items-center justify-center gap-3 text-center"
          >
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 backdrop-blur-xl">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-cyan opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-cyan" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/65">
                {SITE.availability}
              </span>
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-white/35 sm:inline">
              SJEC Mangaluru · Class of {SITE.graduation}
            </span>
          </div>

          {/* Kinetic headline — solid top line, outlined bottom line */}
          <h1 className="text-center font-display font-bold leading-[0.82] tracking-[-0.045em]">
            <span data-hero-anim="line1" className="block overflow-hidden">
              <span className="hero-word inline-block text-[clamp(3rem,13.5vw,13rem)] text-white">
                {SITE.headline.line1}
              </span>
            </span>
            <span data-hero-anim="line2" className="block overflow-hidden">
              <span className="hero-word inline-block text-[clamp(3rem,13.5vw,13rem)] text-outline">
                {SITE.headline.line2}
              </span>
            </span>
          </h1>

          {/* Split sub-row that flanks the portrait: copy and actions sit in the
              outer columns so nothing lands on top of the figure. */}
          <div className="mt-8 grid gap-10 md:mt-10 md:grid-cols-12 md:items-end md:gap-8">
            <div data-hero-anim="sub" className="flex flex-col gap-7 md:col-span-4 md:pr-4">
              <p className="max-w-xs text-sm leading-relaxed text-white/55 md:text-[15px]">
                {SITE.intro}
              </p>

              {/* Primary actions */}
              <div data-hero-anim="cta" className="flex flex-wrap items-center gap-3">
                <MagneticButton>
                  <Button
                    variant="accent"
                    size="lg"
                    onClick={() => scrollTo('#projects', -70)}
                    data-cursor="View"
                  >
                    See the work
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </MagneticButton>
                <MagneticButton>
                  <Button variant="outline" size="lg" asChild>
                    <a href={asset(SITE.resume)} download data-cursor="PDF">
                      Résumé
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                </MagneticButton>
                <MagneticButton strength={14}>
                  <Button variant="ghost" size="icon" asChild className="border border-white/10">
                    <a
                      href={SITE.socials.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub profile"
                    >
                      <Github className="h-4.5 w-4.5" />
                    </a>
                  </Button>
                </MagneticButton>
                <MagneticButton strength={14}>
                  <Button variant="ghost" size="icon" asChild className="border border-white/10">
                    <a
                      href={SITE.socials.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn profile"
                    >
                      <Linkedin className="h-4.5 w-4.5" />
                    </a>
                  </Button>
                </MagneticButton>
              </div>
            </div>

            {/* Centre column stays empty — the portrait occupies it. */}
            <div className="hidden md:col-span-4 md:block" aria-hidden />

            <div
              data-hero-anim="sub"
              className="flex flex-col gap-3 md:col-span-4 md:items-end md:text-right"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-white/35">
                Currently
              </span>
              <Typewriter
                words={SITE.roles}
                className="font-display text-xl font-semibold tracking-tight text-white md:text-2xl"
              />
              <span className="font-mono text-[11px] tracking-[0.14em] text-accent-cyan/80">
                {SITE.tagline}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Tool ticker + scroll cue */}
      <div className="absolute inset-x-0 bottom-0 z-20">
        <div className="hairline" />
        <Marquee
          items={MARQUEE_WORDS}
          speed={48}
          className="border-y border-white/[0.06] bg-black/30 py-3 font-mono text-[11px] uppercase tracking-[0.24em] text-white/40 backdrop-blur-sm"
        />
        <div className="flex items-center justify-between px-5 py-4 sm:px-8 lg:px-14">
          <button
            data-hero-anim="meta"
            onClick={() => scrollTo('#about', -70)}
            className="group flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-white/40 transition-colors hover:text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/12 transition-colors group-hover:border-accent/60">
              <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
            </span>
            Scroll
          </button>
          <span
            data-hero-anim="meta"
            className="hidden font-mono text-[10px] uppercase tracking-[0.24em] text-white/30 sm:block"
          >
            {SITE.location}
          </span>
        </div>
      </div>
    </section>
  );
}
