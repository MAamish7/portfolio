'use client';

import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TiltCard } from '@/components/ui/TiltCard';
import { EDUCATION } from '@/constants/education';

export function Education() {
  return (
    <section id="education" className="section-padding relative">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          eyebrow="05 — Education"
          title="Academic record."
          description="Four years of mechanical engineering at VTU, built on a PCM pre-university foundation."
        />

        <div className="mt-14 grid gap-5 lg:mt-20 lg:grid-cols-3">
          {EDUCATION.map((entry, index) => (
            <motion.div
              key={entry.degree}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <TiltCard intensity={6} className="h-full">
                <div className="relative flex h-full flex-col gap-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl transition-colors duration-500 hover:border-white/20">
                  {entry.current ? (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/20 blur-3xl"
                    />
                  ) : null}

                  <div className="relative flex items-center justify-between gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-white/[0.04] text-white/70">
                      <GraduationCap className="h-4.5 w-4.5" />
                    </span>
                    {entry.current ? (
                      <Badge variant="accent" className="gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        In progress
                      </Badge>
                    ) : (
                      <Badge variant="outline">Completed</Badge>
                    )}
                  </div>

                  <div className="relative">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-cyan/80">
                      {entry.period}
                    </span>
                    <h3 className="mt-2.5 font-display text-lg font-semibold leading-snug text-white">
                      {entry.degree}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-white/45">
                      {entry.institution}
                    </p>
                  </div>

                  <p className="relative text-[13.5px] leading-relaxed text-white/55">
                    {entry.detail}
                  </p>

                  <div className="relative mt-auto flex items-baseline justify-between border-t border-white/[0.07] pt-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/30">
                      {entry.scoreLabel}
                    </span>
                    <span className="font-display text-xl font-bold tabular-nums text-white">
                      {entry.score}
                    </span>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
