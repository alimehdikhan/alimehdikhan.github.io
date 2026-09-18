import { MotionProvider } from '../components/fx/MotionProvider';
import { ClientEffects } from '../components/fx/ClientEffects';
import { ScrollMotion } from '../components/fx/ScrollMotion';
import { MicroInteractions } from '../components/fx/MicroInteractions';
import { ScrollProgress } from '../components/fx/ScrollProgress';
import { Ticker } from '../components/fx/Ticker';
import { InputMode } from '../components/fx/InputMode';
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
    <MotionProvider>
      <a href="#main-content" className="skip">
        Skip to main content
      </a>

      <ScrollProgress />
      <ClientEffects />
      <ScrollMotion />
      <MicroInteractions />
      <Navbar />
      <InputMode />

      <div className="wrap">
        <main id="main-content" tabIndex={-1}>
          <div className="pad">
            <Hero />
          </div>

          <div className="pad">
            <About />
            <Ticker items={RESUME.skills.technical} />
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
    </MotionProvider>
  );
}
