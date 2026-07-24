import dynamic from 'next/dynamic';

import { BackToTop } from '@/components/layout/BackToTop';
import { CustomCursor } from '@/components/layout/CustomCursor';
import { EasterEgg } from '@/components/layout/EasterEgg';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { Preloader } from '@/components/layout/Preloader';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { About } from '@/components/sections/About';
import { Hero } from '@/components/sections/Hero';

// Below-the-fold sections are split out of the initial JS payload.
const Skills = dynamic(() => import('@/components/sections/Skills').then((m) => m.Skills));
const Projects = dynamic(() => import('@/components/sections/Projects').then((m) => m.Projects));
const Timeline = dynamic(() => import('@/components/sections/Timeline').then((m) => m.Timeline));
const Education = dynamic(() => import('@/components/sections/Education').then((m) => m.Education));
const Certificates = dynamic(() =>
  import('@/components/sections/Certificates').then((m) => m.Certificates),
);
const Contact = dynamic(() => import('@/components/sections/Contact').then((m) => m.Contact));

export default function HomePage() {
  return (
    <>
      <Preloader />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />

      <main id="main">
        <Hero />
        <div className="hairline" />
        <About />
        <Skills />
        <Projects />
        <Timeline />
        <Education />
        <Certificates />
        <Contact />
      </main>

      <Footer />
      <BackToTop />
      <EasterEgg />
    </>
  );
}
