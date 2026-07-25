'use client';

import { useEffect, useRef } from 'react';

import { SectionHeading } from '@/components/ui/SectionHeading';
import { TiltCard } from '@/components/ui/TiltCard';
import { SKILL_GROUPS } from '@/constants/skills';
import { EASE, gsap, ScrollTrigger } from '@/lib/gsap';
import { ACCENT_CLASSES, cn } from '@/lib/utils';

export function Skills() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set('[data-skill-card], [data-skill-meter]', { opacity: 1, y: 0, scaleX: 1 });
        return;
      }

      // Cards rise in a stagger as the grid enters.
      gsap.from('[data-skill-card]', {
        y: 48,
        opacity: 0,
        duration: 0.9,
        ease: EASE.expo,
        stagger: { each: 0.08, from: 'start' },
        scrollTrigger: { trigger: '[data-skill-grid]', start: 'top 78%', once: true },
      });

      // Each meter fills to its own data-level once its card is visible.
      ScrollTrigger.batch('[data-skill-meter]', {
        start: 'top 92%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            scaleX: (i, target: HTMLElement) => Number(target.dataset.level) / 100,
            duration: 1.3,
            ease: EASE.expo,
            stagger: 0.05,
          }),
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={root} className="section-padding relative">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          eyebrow="02 — Skills"
          title="Tools and systems."
          description="The stack I design, analyse and build with — grouped by where each tool sits in the workflow, from first sketch to working prototype."
        />

        <div data-skill-grid className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {SKILL_GROUPS.map((group) => {
            const accent = ACCENT_CLASSES[group.accent];
            const Icon = group.icon;

            return (
              <TiltCard key={group.id} intensity={6} className="h-full">
                <div
                  data-skill-card
                  className="group/card relative flex h-full flex-col gap-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl transition-colors duration-500 hover:border-white/20"
                >
                  {/* Accent wash on hover */}
                  <div
                    aria-hidden
                    className={cn(
                      'pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-500 group-hover/card:opacity-100',
                      accent.from,
                    )}
                  />
                  {/* Top hairline that draws across on hover */}
                  <span
                    aria-hidden
                    className={cn(
                      'absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-current to-transparent transition-transform duration-500 group-hover/card:scale-x-100',
                      accent.text,
                    )}
                  />

                  <div className="relative flex items-start justify-between gap-4">
                    <div
                      className={cn(
                        'flex h-11 w-11 items-center justify-center rounded-xl border',
                        accent.border,
                        accent.bg,
                        accent.text,
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
                      {group.code}
                    </span>
                  </div>

                  <div className="relative">
                    <h3 className="font-display text-xl font-semibold tracking-tight text-white">
                      {group.title}
                    </h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-white/50">
                      {group.blurb}
                    </p>
                  </div>

                  <ul className="relative mt-auto flex flex-col gap-3 pt-2">
                    {group.skills.map((skill) => (
                      <li key={skill.name} className="flex flex-col gap-1.5">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-[13px] text-white/75">{skill.name}</span>
                          <span className="font-mono text-[10px] tabular-nums text-white/30">
                            {skill.level}
                          </span>
                        </div>
                        <div
                          className="h-[3px] w-full overflow-hidden rounded-full bg-white/[0.07]"
                          role="meter"
                          aria-valuenow={skill.level}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${skill.name} proficiency`}
                        >
                          <span
                            data-skill-meter
                            data-level={skill.level}
                            className={cn(
                              'block h-full origin-left scale-x-0 rounded-full bg-gradient-to-r',
                              group.accent === 'blue' && 'from-accent to-accent-cyan',
                              group.accent === 'cyan' && 'from-accent-cyan to-accent',
                              group.accent === 'violet' && 'from-accent-violet to-accent',
                            )}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
