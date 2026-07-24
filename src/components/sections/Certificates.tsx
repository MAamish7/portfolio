'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, BadgeCheck, ExternalLink } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CERTIFICATES, type Certificate } from '@/constants/certificates';
import { ACCENT_CLASSES, ACCENT_HEX, cn } from '@/lib/utils';

/**
 * Certificate gallery. Each tile opens a modal preview; where the issuer
 * provides a public credential URL, the modal links straight out to it.
 */
export function Certificates() {
  const [selected, setSelected] = useState<Certificate | null>(null);

  return (
    <section id="certificates" className="section-padding relative">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          eyebrow="06 — Credentials"
          title="Certifications."
          description="Coursework and memberships that back up the toolset — from LLMs and FEA verification to industrial engineering."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {CERTIFICATES.map((cert, index) => {
            const accent = ACCENT_CLASSES[cert.accent];
            const hex = ACCENT_HEX[cert.accent];

            return (
              <motion.button
                key={cert.id}
                type="button"
                onClick={() => setSelected(cert)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                data-cursor="Open"
                className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 text-left backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-white/20"
              >
                {/* Generated "certificate plate" preview */}
                <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-white/[0.07] bg-ink-soft">
                  <div className="grid-backdrop absolute inset-0 opacity-40" aria-hidden />
                  <div
                    aria-hidden
                    className="absolute -left-10 -top-10 h-32 w-32 rounded-full opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
                    style={{ background: hex }}
                  />
                  <div className="relative flex h-full flex-col justify-between p-4">
                    <div className="flex items-start justify-between">
                      <BadgeCheck className={cn('h-5 w-5', accent.text)} />
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
                        {cert.date}
                      </span>
                    </div>
                    <div>
                      <p className="font-display text-[13px] font-semibold leading-tight text-white/90 line-clamp-2">
                        {cert.title}
                      </p>
                      <span
                        aria-hidden
                        className="mt-2 block h-px w-10 origin-left transition-transform duration-500 group-hover:scale-x-[3]"
                        style={{ background: hex }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-2">
                  <h3 className="font-display text-base font-semibold leading-snug text-white">
                    {cert.title}
                  </h3>
                  <p className="text-[12.5px] text-white/45">{cert.issuer}</p>
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.07] pt-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/30">
                    {cert.url ? 'Verifiable' : 'Completed'}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-white/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Modal preview */}
      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          {selected ? (
            <div>
              <div className="relative h-40 overflow-hidden border-b border-white/[0.08] bg-ink-soft sm:h-52">
                <div className="grid-backdrop absolute inset-0 opacity-40" aria-hidden />
                <div
                  aria-hidden
                  className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
                  style={{ background: ACCENT_HEX[selected.accent] }}
                />
                <div className="relative flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                  <BadgeCheck className={cn('h-8 w-8', ACCENT_CLASSES[selected.accent].text)} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">
                    {selected.issuer}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4 p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={selected.accent === 'blue' ? 'accent' : selected.accent}>
                    {selected.date}
                  </Badge>
                  {selected.skills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <DialogTitle className="font-display text-2xl font-bold tracking-tight text-white">
                  {selected.title}
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed text-white/55">
                  {selected.description}
                </DialogDescription>

                {selected.url ? (
                  <Button variant="accent" asChild className="mt-2 self-start">
                    <a href={selected.url} target="_blank" rel="noreferrer">
                      Verify credential
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                ) : (
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-white/30">
                    Certificate available on request
                  </p>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
