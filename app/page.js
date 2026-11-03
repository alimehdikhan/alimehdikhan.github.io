import { MotionProvider } from '../components/fx/MotionProvider';
import { ScrollProgress } from '../components/fx/ScrollProgress';
import { BackToTop } from '../components/fx/BackToTop';
import { ConsoleHello } from '../components/fx/ConsoleHello';
import { Ticker } from '../components/fx/Ticker';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Skills } from '../components/Skills';
import { Timeline } from '../components/Timeline';
import { Projects } from '../components/Projects';
import { Certifications } from '../components/Certifications';
import { OpenSource } from '../components/OpenSource';
import { StarRepo } from '../components/StarRepo';
import { KineticBand } from '../components/KineticBand';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { RESUME } from '../data/resume';

export default function Home() {
  return (
    <MotionProvider>
      <a href="#main-content" className="skip">
        Skip to main content
      </a>

      <ScrollProgress />
      <BackToTop />
      <ConsoleHello />
      <Navbar />

      <main id="main-content" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <Ticker items={RESUME.skills.technical} />
        <Skills />
        <Timeline />
        <Projects />
        <Certifications />
        <OpenSource />
        <StarRepo />
        <KineticBand />
        <Contact />
      </main>

      <Footer />
    </MotionProvider>
  );
}
