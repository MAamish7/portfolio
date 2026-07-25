import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

import { LuminaMark } from '@/components/LuminaMark';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '#discover', label: 'Discover' },
  { href: '#mission', label: 'Mission' },
  { href: '#stream', label: 'Stream' },
];

/**
 * Floating navigation. Centre pill on desktop, sheet on mobile — both use the
 * same liquid-glass rim as the footer so the chrome reads as one material.
 */
export function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 px-5 py-5 sm:px-8 md:px-10"
      >
        <a
          href="#top"
          className="liquid-glass liquid-glass-pill flex h-10 w-10 shrink-0 items-center justify-center text-white"
          aria-label="Lumina — home"
        >
          <LuminaMark className="h-[18px] w-[18px]" />
        </a>

        {/* Desktop pill */}
        <nav
          aria-label="Primary"
          className="liquid-glass liquid-glass-pill absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 p-1 md:flex"
        >
          {NAV_LINKS.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-full px-5 py-2 text-sm transition-colors duration-300',
                index === 0 ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white',
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href="#beta"
            className="liquid-glass liquid-glass-pill hidden px-5 py-2.5 text-sm text-white/80 transition-colors duration-300 hover:text-white sm:block"
          >
            Sign up for beta
          </a>
          <a
            href="#download"
            className="hidden rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-colors duration-300 hover:bg-white/85 sm:block"
          >
            Download
          </a>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="lumina-menu"
            className="liquid-glass liquid-glass-pill relative flex h-10 w-10 items-center justify-center text-white md:hidden"
          >
            <Menu
              size={18}
              className={cn(
                'absolute transition-all duration-300',
                open ? 'scale-50 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100',
              )}
            />
            <X
              size={18}
              className={cn(
                'absolute transition-all duration-300',
                open ? 'scale-100 rotate-0 opacity-100' : 'scale-50 -rotate-90 opacity-0',
              )}
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open ? (
          <motion.div
            id="lumina-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xl md:hidden"
          >
            <nav
              aria-label="Mobile"
              className="flex h-full flex-col justify-center gap-1 px-8 pb-16 pt-24"
            >
              {NAV_LINKS.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ delay: 0.06 + index * 0.06, duration: 0.45, ease: 'easeOut' }}
                  className="border-b border-white/10 py-5 text-3xl text-white/80 transition-colors hover:text-white"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.45 }}
                className="mt-10 flex flex-col gap-3"
              >
                <a
                  href="#beta"
                  onClick={() => setOpen(false)}
                  className="liquid-glass liquid-glass-pill px-6 py-3 text-center text-sm text-white/80"
                >
                  Sign up for beta
                </a>
                <a
                  href="#download"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-white px-6 py-3 text-center text-sm font-medium text-black"
                >
                  Download
                </a>
              </motion.div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
