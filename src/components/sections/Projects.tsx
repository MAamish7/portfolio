'use client';

import { AnimatePresence, motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TiltCard } from '@/components/ui/TiltCard';
import {
  PROJECTS,
  PROJECT_FILTERS,
  type Project,
  type ProjectCategory,
} from '@/constants/projects';
import { ACCENT_CLASSES, ACCENT_HEX, cn } from '@/lib/utils';

/**
 * One full-height panel in the stacked case-study reel.
 *
 * Panels are sticky and scale/rotate away as the next one arrives, so the
 * section reads like a deck of cards being dealt.
 */
function CaseStudy({
  project,
  index,
  total,
  progress,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const transitions = Math.max(total - 1, 1);
  const enterStart = (index - 1) / transitions;
  const enterEnd = index / transitions;
  const exitStart = index / transitions;
  const exitEnd = (index + 1) / transitions;

  const isFirst = index === 0;
  const isLast = index === total - 1;

  // Hooks must run unconditionally, so build the full keyframe list and pick
  // the range that applies to this panel's position in the stack.
  const scale = useTransform(
    progress,
    isFirst
      ? [exitStart, exitEnd]
      : isLast
        ? [enterStart, enterEnd]
        : [enterStart, enterEnd, exitStart, exitEnd],
    isFirst ? [1, 0.86] : isLast ? [0.86, 1] : [0.86, 1, 1, 0.86],
  );
  const rotate = useTransform(
    progress,
    isFirst
      ? [exitStart, exitEnd]
      : isLast
        ? [enterStart, enterEnd]
        : [enterStart, enterEnd, exitStart, exitEnd],
    isFirst ? [0, -3.5] : isLast ? [3.5, 0] : [3.5, 0, 0, -3.5],
  );

  const accent = ACCENT_CLASSES[project.accent];
  const hex = ACCENT_HEX[project.accent];

  return (
    <motion.article
      style={{ scale, rotate }}
      className="sticky top-0 flex h-[100svh] items-center overflow-hidden"
      aria-label={`${project.title} case study`}
    >
      <div className="absolute inset-4 rounded-[2rem] border border-white/[0.08] bg-ink-soft/90 backdrop-blur-2xl sm:inset-6" />
      {/* Ambient accent glow keyed to the project */}
      <div
        aria-hidden
        className="absolute -right-24 top-1/3 h-[28rem] w-[28rem] rounded-full opacity-[0.18] blur-[120px]"
        style={{ background: hex }}
      />
      <div
        className="grid-backdrop absolute inset-4 rounded-[2rem] opacity-30 sm:inset-6"
        aria-hidden
      />

      <div className="relative mx-auto grid w-full max-w-[1280px] gap-10 px-9 py-10 sm:px-14 lg:grid-cols-12 lg:gap-14">
        <div className="flex flex-col justify-between gap-8 lg:col-span-7">
          <div className="flex items-center justify-between gap-4">
            <Badge variant={project.accent === 'blue' ? 'accent' : project.accent}>
              {project.categoryLabel}
            </Badge>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/30">
              {project.index} / {String(total).padStart(2, '0')}
            </span>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/35">
              {project.year} — {project.role}
            </p>
            <h3 className="mt-4 font-display text-[clamp(2rem,5.2vw,4.25rem)] font-bold leading-[0.95] tracking-tight text-white">
              {project.title}
            </h3>
            <p className={cn('mt-2 font-display text-lg', accent.text)}>{project.subtitle}</p>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/60">
              {project.summary}
            </p>

            <ul className="mt-6 flex flex-col gap-2.5">
              {project.highlights.map((point) => (
                <li key={point} className="flex gap-3 text-[13.5px] leading-relaxed text-white/50">
                  <span
                    aria-hidden
                    className="mt-[7px] h-1 w-1 shrink-0 rounded-full"
                    style={{ background: hex }}
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {project.links.github ? (
              <MagneticButton strength={12}>
                <Button variant="outline" size="sm" asChild>
                  <a href={project.links.github} target="_blank" rel="noreferrer">
                    <Github className="h-3.5 w-3.5" />
                    Source
                  </a>
                </Button>
              </MagneticButton>
            ) : null}
            {project.links.demo ? (
              <MagneticButton strength={12}>
                <Button variant="accent" size="sm" asChild>
                  <a href={project.links.demo} target="_blank" rel="noreferrer">
                    Live demo
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </MagneticButton>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col justify-end gap-8 lg:col-span-5">
          {/* Key figures */}
          <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06]">
            {project.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1 bg-ink-soft p-4">
                <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/30">
                  {stat.label}
                </dt>
                <dd className="font-display text-sm font-semibold text-white">{stat.value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/** Compact card used by the filterable index below the reel. */
function ProjectCard({ project }: { project: Project }) {
  const accent = ACCENT_CLASSES[project.accent];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <TiltCard intensity={7}>
        <div className="group/card relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition-colors duration-500 hover:border-white/20">
          <div
            aria-hidden
            className={cn(
              'pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-500 group-hover/card:opacity-100',
              accent.from,
            )}
          />
          <div className="relative flex items-center justify-between">
            <span className={cn('font-mono text-[11px] tracking-[0.18em]', accent.text)}>
              P-{project.index}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/25">
              {project.year}
            </span>
          </div>
          <h3 className="relative font-display text-lg font-semibold leading-snug text-white">
            {project.title}
          </h3>
          <p className="relative text-[13px] leading-relaxed text-white/50">{project.summary}</p>
          <div className="relative mt-auto flex flex-wrap gap-1.5 pt-2">
            {project.tech.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="outline" className="px-2.5 py-0.5 text-[9.5px]">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

export function Projects() {
  const reel = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<ProjectCategory | 'all'>('all');
  const { scrollYProgress } = useScroll({ target: reel, offset: ['start start', 'end end'] });

  const filtered = useMemo(
    () => (filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.category === filter)),
    [filter],
  );

  return (
    <section id="projects" className="relative">
      <div className="section-padding pb-0">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeading
            eyebrow="03 — Selected work"
            title="Three builds, end to end."
            description="Embedded hardware, finite-element validation and mechanism design. Scroll through the case studies, or filter the index below."
          />
        </div>
      </div>

      {/* Sticky stacked case studies */}
      <div ref={reel} className="relative mt-14" style={{ height: `${PROJECTS.length * 100}svh` }}>
        {PROJECTS.map((project, index) => (
          <CaseStudy
            key={project.id}
            project={project}
            index={index}
            total={PROJECTS.length}
            progress={scrollYProgress}
          />
        ))}
      </div>

      {/* Filterable index */}
      <div className="section-padding pt-16">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <span className="eyebrow">Project index</span>
            <div
              role="tablist"
              aria-label="Filter projects by discipline"
              className="flex flex-wrap gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] p-1.5 backdrop-blur-xl"
            >
              {PROJECT_FILTERS.map((item) => {
                const selected = filter === item.id;
                return (
                  <button
                    key={item.id}
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setFilter(item.id)}
                    className={cn(
                      'relative rounded-full px-4 py-2 text-xs transition-colors duration-300',
                      selected ? 'text-ink' : 'text-white/50 hover:text-white',
                    )}
                  >
                    {selected ? (
                      <motion.span
                        layoutId="filter-pill"
                        className="absolute inset-0 rounded-full bg-white"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                    <span className="relative">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
