import { MotionProvider } from '../components/fx/MotionProvider';
import { ScrollProgress } from '../components/fx/ScrollProgress';
import { BackToTop } from '../components/fx/BackToTop';
import { ChatWidget } from '../components/ChatWidget';
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
import { Faq } from '../components/Faq';
import { KineticBand } from '../components/KineticBand';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { RESUME } from '../data/resume';
import { compact, contributions } from '../lib/github';

export default async function Home() {
  /* the hero names the best-known project a pull request was merged into
     (the same request the GitHub section makes, so it is fetched once) */
  const best = (await contributions()).filter((pr) => pr.merged).sort((a, b) => b.repo.stars - a.repo.stars)[0];
  const merged = best && { name: best.repo.path.split('/')[1], stars: compact(best.repo.stars), url: best.url };

  return (
    <MotionProvider>
      <a href="#main-content" className="skip">
        Skip to main content
      </a>

      <ScrollProgress />
      <BackToTop />
      <ChatWidget />
      <ConsoleHello />
      <Navbar />

      <main id="main-content" tabIndex={-1} className="outline-none">
        <Hero merged={merged} />
        <About />
        <Ticker items={RESUME.skills.technical} />
        <Skills />
        <Timeline />
        <Projects />
        <Certifications />
        <OpenSource />
        <StarRepo />
        <Faq />
        <KineticBand />
        <Contact />
      </main>

      <Footer />
    </MotionProvider>
  );
}
