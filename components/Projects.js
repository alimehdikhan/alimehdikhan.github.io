import Link from 'next/link';
import { ArrowUpRight, Article, ChevronRight, Code } from '@/components/ui/icons';
import { SectionHead } from './ui/SectionHead';
import { Button } from './ui/button';
import { Magnetic } from './ui/magnetic';
import { SpotlightCard } from './ui/aceternity/spotlight-card';
import { CardContainer } from './ui/aceternity/3d-card';
import { SkillLogo } from './Skills';
import { VocalyShowcase } from './VocalyShowcase';
import { LatencyShowcase } from './LatencyShowcase';
import { ByteShowcase } from './ByteShowcase';
import { StarButton } from './StarRepo';
import { AskByte } from './AskByte';
import { Reveal } from './fx/Reveal';
import { cn } from '@/lib/utils';
import { RESUME } from '../data/resume';

/* The showcase grid: Vocaly AI as a wide featured card, the Skin Lesion
   Classifier and Byte side by side under it. Each card opens with its own
   live demo (Vocaly's word inspector and expert-agreement chart, a latency
   chart that runs in, a chat with Byte that plays out), then the result in
   one line and what to do next.

   The whole card opens the case study: the title's link stretches over it,
   so hover lift, cursor spotlight, border glow and the demo's slow zoom all
   answer something clickable. Buttons and Vocaly's word inspector sit above
   that link and keep their own actions.

   Layer ownership: CardContainer tilts (Motion), SpotlightCard lifts and
   glows (CSS hover-lift, Motion spotlight), .project-demo-inner zooms on
   hover (CSS), and each demo animates its own contents once on first sight. */

const STAR_URL = `https://github.com/${RESUME.starRepo.path}`;

function Demo({ proj }) {
  if (proj.showcase === 'vocaly') return <VocalyShowcase logo={proj.logo} />;
  if (proj.showcase === 'latency') return <LatencyShowcase />;
  if (proj.showcase === 'byte') return <ByteShowcase />;
  return null;
}

/* the result line, its key figure set in lime */
function Result({ text, highlight }) {
  const at = highlight ? text.indexOf(highlight) : -1;
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <em>{highlight}</em>
      {text.slice(at + highlight.length)}
    </>
  );
}

function CaseStudyButton({ proj, primary }) {
  const button = (
    <Button asChild variant={primary ? 'default' : 'outline'}>
      <Link href={`/projects/${proj.slug}`} aria-label={`Case study: how I built ${proj.title}`}>
        <Article aria-hidden="true" />
        Case study
        <ChevronRight className="case-chevron" aria-hidden="true" />
      </Link>
    </Button>
  );
  return primary ? <Magnetic>{button}</Magnetic> : button;
}

/* what to do next: try it if you can, then the case study, then the code */
function Actions({ proj }) {
  if (proj.showcase === 'byte') {
    return (
      <>
        <Magnetic>
          <AskByte label="Ask Byte" variant="default" />
        </Magnetic>
        <CaseStudyButton proj={proj} />
      </>
    );
  }
  if (proj.demo) {
    return (
      <>
        <Magnetic>
          <Button asChild>
            <a href={proj.demo} target="_blank" rel="noopener noreferrer" aria-label={`Live demo of ${proj.title}`}>
              Live demo
              <ArrowUpRight aria-hidden="true" />
            </a>
          </Button>
        </Magnetic>
        <CaseStudyButton proj={proj} />
        {proj.github === STAR_URL && <StarButton placement="project" />}
      </>
    );
  }
  return (
    <>
      <CaseStudyButton proj={proj} primary />
      <Button asChild variant="outline">
        <a href={proj.github} target="_blank" rel="noopener noreferrer" aria-label={`Code for ${proj.title} on GitHub`}>
          <Code aria-hidden="true" />
          Code
          <ArrowUpRight aria-hidden="true" />
        </a>
      </Button>
    </>
  );
}

function ProjectCard({ proj, index, featured }) {
  const titleId = `project-title-${index + 1}`;
  return (
    <CardContainer maxTilt={featured ? 1.5 : 3} containerClassName={cn(featured && 'lg:col-span-2')}>
      <SpotlightCard
        as="article"
        interactive
        borderGlow
        id={`project-${index + 1}`}
        aria-labelledby={titleId}
        className={cn('project-card group/card flex h-full flex-col bg-card', featured && 'lg:grid lg:grid-cols-[0.95fr_1.05fr]')}
      >
        {/* Vocaly's demo is interactive, so it sits above the card's link */}
        <div className={cn('project-demo relative overflow-hidden', proj.showcase === 'vocaly' ? 'z-10' : 'sm:aspect-[16/10]')}>
          <div className="project-demo-inner h-full">
            <Demo proj={proj} />
          </div>
        </div>

        <div className={cn('flex flex-1 flex-col p-6 md:p-8', featured && 'lg:justify-center lg:p-10')}>
          <h3 id={titleId} className={cn('leading-tight font-semibold tracking-[-0.025em]', featured ? 'text-[30px] md:text-[36px]' : 'text-[26px] md:text-[30px]')}>
            <Link
              href={`/projects/${proj.slug}`}
              className="outline-none after:absolute after:inset-0 after:z-[1] after:rounded-[inherit] after:content-[''] focus-visible:after:ring-[3px] focus-visible:after:ring-ring/50"
            >
              {proj.title}
            </Link>
          </h3>
          <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-muted-foreground">{proj.overview}</p>

          {/* side by side, the pair's results and buttons line up along the bottom */}
          <div className={cn(!featured && 'mt-auto')}>
            <p className="mt-5 max-w-[46ch] text-[17px] leading-snug font-medium tracking-[-0.01em] [&_em]:font-semibold [&_em]:text-link [&_em]:not-italic">
              <Result text={proj.outcome} highlight={proj.highlight} />
            </p>

            <div className="relative z-10 mt-6 flex flex-wrap gap-3">
              <Actions proj={proj} />
            </div>

            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
              {proj.tech.map((t) => (
                <li key={t} className="inline-flex min-h-8 items-center gap-2 rounded-full border border-border px-3 text-[13px] text-muted-foreground has-[.logo-plate]:pl-1.5">
                  <SkillLogo name={t} size={14} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SpotlightCard>
    </CardContainer>
  );
}

export function Projects() {
  return (
    <section id="projects" className="section-y" aria-labelledby="projects-title">
      <div className="container-page">
        <SectionHead
          title={
            <>
              Things I&apos;ve <em>built</em>
            </>
          }
          titleId="projects-title"
          intro={
            <>
              Each has a case study on how I built it, how I measured it and where it still falls short:{' '}
              <Link href="/projects/vocaly-ai" className="font-medium text-link underline decoration-current/40 underline-offset-4 hover:decoration-current">
                Vocaly AI
              </Link>
              ,{' '}
              <Link href="/projects/skin-lesion-classifier" className="font-medium text-link underline decoration-current/40 underline-offset-4 hover:decoration-current">
                the Skin Lesion Classifier
              </Link>{' '}
              and{' '}
              <Link href="/projects/byte" className="font-medium text-link underline decoration-current/40 underline-offset-4 hover:decoration-current">
                Byte
              </Link>
              , the robot in the corner.
            </>
          }
        />

        <Reveal stagger={0.08} className="grid gap-4 lg:grid-cols-2 lg:gap-6">
          {RESUME.projects.map((proj, i) => (
            <ProjectCard key={proj.slug} proj={proj} index={i} featured={i === 0} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
