'use client';

import { Award, FlaskConical, GraduationCap, Milestone } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { SectionHeading } from '@/components/ui/SectionHeading';
import { TIMELINE, type TimelineEntry } from '@/constants/education';
import { EASE, gsap } from '@/lib/gsap';
import { cn } from '@/lib/utils';

const KIND_META: Record<
  TimelineEntry['kind'],
  { icon: typeof Award; label: string; className: string }
> = {
  education: {
    icon: GraduationCap,
    label: 'Education',
    className: 'text-accent border-accent/40 bg-accent/10',
  },
  project: {
    icon: FlaskConical,
    label: 'Project',
    className: 'text-accent-cyan border-accent-cyan/40 bg-accent-cyan/10',
  },
  credential: {
    icon: Award,
    label: 'Credential',
    className: 'text-accent-violet border-accent-violet/40 bg-accent-violet/10',
  },
  milestone: {
    icon: Milestone,
    label: 'Milestone',
    className: 'text-white border-white/25 bg-white/10',
  },
};

/**
 * Vertical GSAP timeline. The spine draws itself as the section scrolls and
 * each entry slides in from its side of the rail.
 */
export function Timeline() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set('[data-timeline-item], [data-timeline-spine]', { opacity: 1, x: 0, scaleY: 1 });
        return;
      }

      gsap.to('[data-timeline-spine]', {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-timeline-list]',
          start: 'top 72%',
          end: 'bottom 65%',
          scrub: 0.6,
        },
      });

      gsap.utils.toArray<HTMLElement>('[data-timeline-item]').forEach((item, index) => {
        gsap.from(item, {
          opacity: 0,
          x: index % 2 === 0 ? -36 : 36,
          y: 20,
          duration: 0.85,
          ease: EASE.expo,
          scrollTrigger: { trigger: item, start: 'top 88%', once: true },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="timeline" ref={root} className="section-padding relative overflow-hidden">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          eyebrow="04 — Timeline"
          title="How it has gone so far."
          description="Coursework, builds and credentials in the order they actually happened — the running log of an engineering degree in progress."
        />

        <div data-timeline-list className="relative mt-16 lg:mt-20">
          {/* Rail */}
          <div
            aria-hidden
            className="absolute left-[11px] top-2 h-[calc(100%-1rem)] w-px bg-white/[0.09] md:left-1/2 md:-translate-x-1/2"
          >
            <span
              data-timeline-spine
              className="block h-full w-full origin-top scale-y-0 bg-gradient-to-b from-accent via-accent-cyan to-accent-violet"
            />
          </div>

          <ol className="flex flex-col gap-8">
            {TIMELINE.map((entry, index) => {
              const meta = KIND_META[entry.kind];
              const Icon = meta.icon;
              const alignLeft = index % 2 === 0;

              return (
                <li
                  key={`${entry.year}-${entry.title}`}
                  data-timeline-item
                  className={cn(
                    'relative pl-10 md:w-1/2 md:pl-0',
                    alignLeft ? 'md:pr-12 md:text-right' : 'md:ml-auto md:pl-12',
                  )}
                >
                  {/* Node */}
                  <span
                    aria-hidden
                    className={cn(
                      'absolute left-0 top-5 flex h-6 w-6 items-center justify-center rounded-full border bg-ink md:left-auto',
                      alignLeft ? 'md:-right-3' : 'md:-left-3',
                      meta.className,
                    )}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  </span>

                  <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 backdrop-blur-xl transition-colors duration-500 hover:border-white/20">
                    <div
                      className={cn('flex items-center gap-3', alignLeft ? 'md:justify-end' : '')}
                    >
                      <span
                        className={cn(
                          'flex h-7 w-7 items-center justify-center rounded-lg border',
                          meta.className,
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                        {entry.year} · {meta.label}
                      </span>
                    </div>

                    <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-white">
                      {entry.title}
                    </h3>
                    <p className="mt-1 text-[13px] text-white/45">{entry.org}</p>
                    <p className="mt-3 text-[13.5px] leading-relaxed text-white/55">
                      {entry.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
