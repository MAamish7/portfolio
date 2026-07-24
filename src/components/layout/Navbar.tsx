'use client';

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { SoundToggle } from '@/components/layout/SoundToggle';
import { Button } from '@/components/ui/button';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { NAV_ITEMS, SECTION_IDS } from '@/constants/navigation';
import { SITE } from '@/constants/site';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const active = useActiveSection(SECTION_IDS);
  const { scrollTo } = useSmoothScroll();
  const { play } = useSound();

  useMotionValueEvent(scrollY, 'change', (value) => setScrolled(value > 40));

  // Lock the page while the mobile sheet is open.
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const go = (id: string) => {
    play('click');
    setOpen(false);
    // Offset by the navbar height so headings don't hide behind it.
    scrollTo(`#${id}`, -80);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed inset-x-0 top-0 z-[100] transition-all duration-500',
          scrolled ? 'py-3' : 'py-5',
        )}
      >
        <div
          className={cn(
            'mx-auto flex max-w-[1440px] items-center justify-between gap-6 rounded-full px-4 transition-all duration-500 sm:px-6',
            scrolled
              ? 'mx-3 border border-white/[0.08] bg-black/55 py-2.5 shadow-glass backdrop-blur-2xl sm:mx-6'
              : 'border border-transparent py-2',
          )}
        >
          {/* Wordmark */}
          <button
            onClick={() => go('hero')}
            className="group flex items-center gap-2.5 text-left"
            aria-label="Back to top"
          >
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] font-display text-[11px] font-bold text-white">
              {SITE.initials}
              <span className="absolute inset-0 rounded-full bg-accent/25 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
            </span>
            <span className="hidden font-display text-sm font-semibold tracking-tight text-white sm:block">
              {SITE.name}
            </span>
          </button>

          {/* Desktop links */}
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  onMouseEnter={() => play('hover')}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'relative rounded-full px-4 py-2 text-[13px] transition-colors duration-300',
                    isActive ? 'text-white' : 'text-white/50 hover:text-white',
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.07]"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                  <span className="relative">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <SoundToggle />
            <MagneticButton className="hidden sm:inline-flex" strength={12}>
              <Button
                size="sm"
                variant="accent"
                onClick={() => go('contact')}
                className="h-10 px-5"
              >
                Let&apos;s talk
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </MagneticButton>

            <button
              onClick={() => setOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white transition-colors hover:border-white/30 lg:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[95] bg-ink/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="grid-backdrop absolute inset-0 opacity-30" />
            <nav
              aria-label="Mobile"
              className="relative flex h-full flex-col justify-center gap-2 px-8 pb-16 pt-24"
            >
              {NAV_ITEMS.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{
                    delay: 0.05 + index * 0.055,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onClick={() => go(item.id)}
                  className="group flex items-baseline gap-4 border-b border-white/[0.07] py-4 text-left"
                >
                  <span className="font-mono text-[10px] tracking-[0.2em] text-accent/70">
                    {item.index}
                  </span>
                  <span
                    className={cn(
                      'font-display text-3xl font-semibold tracking-tight transition-colors',
                      active === item.id ? 'text-white' : 'text-white/55 group-hover:text-white',
                    )}
                  >
                    {item.label}
                  </span>
                  <ArrowUpRight className="ml-auto h-5 w-5 self-center text-white/25 transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                </motion.button>
              ))}

              <motion.a
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                href={`mailto:${SITE.email}`}
                className="mt-8 font-mono text-xs tracking-[0.12em] text-white/45"
              >
                {SITE.email}
              </motion.a>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
