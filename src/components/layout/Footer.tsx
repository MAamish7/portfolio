'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';

import { Marquee } from '@/components/ui/Marquee';
import { NAV_ITEMS } from '@/constants/navigation';
import { SITE } from '@/constants/site';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

const SOCIALS = [
  { icon: Github, href: SITE.socials.github, label: 'GitHub' },
  { icon: Linkedin, href: SITE.socials.linkedin, label: 'LinkedIn' },
  { icon: Mail, href: `mailto:${SITE.email}`, label: 'Email' },
];

export function Footer() {
  const { scrollTo } = useSmoothScroll();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.07] bg-ink">
      {/* Oversized wordmark bleeding off the bottom edge */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 select-none overflow-hidden"
        aria-hidden
      >
        <span className="block translate-y-[22%] text-center font-display text-[clamp(4rem,19vw,17rem)] font-bold leading-none tracking-tighter text-white/[0.035]">
          {SITE.name.toUpperCase()}
        </span>
      </div>

      <Marquee
        items={[
          'Available for internships',
          'Design · Simulate · Build',
          'CAD · FEA · Embedded',
          'Let’s make something',
        ]}
        speed={34}
        reverse
        className="border-b border-white/[0.06] py-4 font-display text-lg font-semibold uppercase tracking-tight text-white/25 md:text-2xl"
      />

      <div className="relative mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-14">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="flex flex-col gap-5 md:col-span-5">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="max-w-sm font-display text-2xl font-semibold leading-tight tracking-tight text-white md:text-3xl"
            >
              Let&apos;s build something that holds up under load.
            </motion.p>
            <a
              href={`mailto:${SITE.email}`}
              className="group inline-flex w-fit items-center gap-2 border-b border-white/15 pb-1 text-sm text-white/60 transition-colors hover:border-accent hover:text-white"
            >
              {SITE.email}
            </a>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <span className="eyebrow">Navigate</span>
            <ul className="mt-4 flex flex-col gap-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollTo(`#${item.id}`, -80)}
                    className="text-[13.5px] text-white/50 transition-colors hover:text-white"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <span className="eyebrow">Elsewhere</span>
            <div className="mt-4 flex gap-2.5">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/55 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:text-accent"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-white/40">
              Based in {SITE.location} · {SITE.timezone}
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/[0.07] pt-6 font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {SITE.name}. All rights reserved.
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-accent-cyan" />
            Built with Next.js, GSAP &amp; Three.js
          </span>
        </div>
      </div>
    </footer>
  );
}
