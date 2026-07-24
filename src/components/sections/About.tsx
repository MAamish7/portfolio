'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { GraduationCap, MapPin, Radio, Wrench } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';

import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Badge } from '@/components/ui/badge';
import { RevealText } from '@/components/ui/RevealText';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CORE_TOOLS } from '@/constants/skills';
import { OBJECTIVE, SITE, STATS } from '@/constants/site';

const FACTS = [
  { icon: GraduationCap, label: 'Degree', value: 'B.E. Mechanical Engineering' },
  { icon: MapPin, label: 'Based in', value: SITE.location },
  { icon: Wrench, label: 'Focus', value: 'CAD · FEA · Embedded' },
  { icon: Radio, label: 'Status', value: SITE.availability },
];

export function About() {
  const root = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: root, offset: ['start end', 'end start'] });
  const portraitY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);

  return (
    <section id="about" ref={root} className="section-padding relative">
      <div className="mx-auto max-w-[1440px]">
        <SectionHeading
          eyebrow="01 — About"
          title="Modeling, simulating, and building."
          description={OBJECTIVE}
        />

        <div className="mt-16 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          {/* Portrait */}
          <motion.div style={{ y: portraitY }} className="lg:col-span-5">
            <div className="group relative overflow-hidden rounded-3xl border border-white/[0.08]">
              <Image
                src="/images/headshot-a.jpg"
                alt={`Portrait of ${SITE.name}`}
                width={1000}
                height={1000}
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="aspect-square w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.03]"
              />
              {/* Duotone wash that lifts on hover */}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-accent/25 via-transparent to-accent-violet/20 mix-blend-color opacity-80 transition-opacity duration-700 group-hover:opacity-0"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent"
                aria-hidden
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                <div>
                  <p className="font-display text-lg font-semibold text-white">{SITE.name}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                    {SITE.role}
                  </p>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-cyan">
                  {SITE.timezone}
                </span>
              </div>
            </div>

            {/* Spec sheet */}
            <dl className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.05] sm:grid-cols-2">
              {FACTS.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col gap-1.5 bg-ink p-4">
                  <dt className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </dt>
                  <dd className="text-sm text-white/85">{value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* Narrative */}
          <div className="flex flex-col gap-10 lg:col-span-7">
            <div className="space-y-5">
              <RevealText className="text-lg leading-relaxed text-white/70 md:text-xl">
                I am a B.E. Mechanical Engineering student at St. Joseph Engineering College,
                Mangaluru, working through the full arc of a part — modelling it in SolidWorks,
                validating it in ANSYS, then building the prototype and making it talk to a screen.
              </RevealText>
              <RevealText className="text-base leading-relaxed text-white/50 md:text-lg">
                What I like most is the connective tissue between those stages: the moment a
                simulation result changes a design decision, or a sensor reading proves the model
                was right. That loop is why my projects span FEA studies, mechanism design and
                microcontroller builds rather than sitting in one lane.
              </RevealText>
            </div>

            {/* Animated statistics */}
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.05] sm:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1.5 bg-ink p-5">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    decimals={'decimals' in stat ? (stat.decimals as number) : 0}
                    className="text-3xl font-bold text-white md:text-4xl"
                  />
                  <span className="text-[13px] leading-tight text-white/60">{stat.label}</span>
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/25">
                    {stat.hint}
                  </span>
                </div>
              ))}
            </div>

            {/* Toolbelt */}
            <div className="flex flex-col gap-4">
              <span className="eyebrow">Daily drivers</span>
              <div className="flex flex-wrap gap-2">
                {CORE_TOOLS.map((tool) => (
                  <Badge key={tool} className="px-3.5 py-1.5 text-[11px]">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <span className="eyebrow">Languages</span>
              <p className="text-sm text-white/55">{SITE.languages.join('  ·  ')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
