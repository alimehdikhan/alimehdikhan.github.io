'use client';

import { Preloader } from '../components/fx/Preloader';
import { FluidBackdrop } from '../components/fx/FluidBackdrop';
import { Cursor } from '../components/fx/Cursor';
import { ScrollProgress } from '../components/fx/ScrollProgress';
import { Ticker } from '../components/fx/Ticker';
import { RevealManager } from '../components/fx/RevealManager';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Skills } from '../components/Skills';
import { Timeline } from '../components/Timeline';
import { Projects } from '../components/Projects';
import { Certifications } from '../components/Certifications';
import { OpenSource } from '../components/OpenSource';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { RESUME } from '../data/resume';

export default function Home() {
  return (
    <>
      <a href="#main-content" className="skip">
        Skip to main content
      </a>

      <Preloader />
      <Cursor />
      <ScrollProgress />
      <FluidBackdrop />
      <Navbar />
      <RevealManager />

      <div className="wrap">
        <main id="main-content">
          <div className="pad">
            <Hero />
          </div>

          <Ticker items={RESUME.skills.technical} />

          <div className="pad">
            <About />
            <Skills />
            <Timeline />
            <Projects />
            <Certifications />
            <OpenSource />
            <Contact />
          </div>
        </main>

        <div className="pad">
          <Footer />
        </div>
      </div>
    </>
  );
}
