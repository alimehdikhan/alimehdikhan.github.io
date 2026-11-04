import Link from 'next/link';
import { ArrowUpRight, Article, ChevronRight, Code } from '@/components/ui/icons';
import { SectionHead } from './ui/SectionHead';
import { Button } from './ui/button';
import { Magnetic } from './ui/magnetic';
import { SkillLogo } from './Skills';
import { VocalyShowcase } from './VocalyShowcase';
import { LatencyShowcase } from './LatencyShowcase';
import { ByteShowcase } from './ByteShowcase';
import { StarButton } from './StarRepo';
import { AskByte } from './AskByte';
import { ReelMotion } from './fx/ReelMotion';
import { ReelRail } from './ReelRail';
import { ReelCursor } from './ReelCursor';
import { UNIT_VW, reelLength } from './fx/reel';
import { cn } from '@/lib/utils';
import { RESUME } from '../data/resume';
import { caseStudy } from '../data/caseStudies';

/* The project reel. On a wide screen the section pins and the scroll
   carries three full-screen scenes sideways (fx/ReelMotion.js): each title
   rises letter by letter, its case study's two headline numbers count up,
   the live demo swings from a turned frame to flat as it reaches the centre
   and turns away as it leaves, a giant outlined word drifts behind at its
   own pace, the light takes each project's colour, and a rail along the
   bottom tracks the way. A "View case study" tag trails the mouse over a
   scene (ReelCursor).

   Phones, short screens and reduced motion get the same scenes stacked down
   the page, everything visible from the start; the demos still play once
   when seen.

   The whole scene opens its case study: the title's link stretches over it.
   The buttons and Vocaly's word inspector sit above that link. */

const STAR_URL = `https://github.com/${RESUME.starRepo.path}`;

/* each project's giant word and light: tone tints the glow, the outlined
   word and the frame's shadow, and is the numbers' colour on the dark
   theme; inkLight is the same hue dark enough to read on the light theme */
const LOOKS = {
  'vocaly-ai': { word: 'VOCALY', tone: '#8cc2ff', inkLight: '#1f5fbf' },
  'skin-lesion-classifier': { word: 'LESION', tone: '#5eead4', inkLight: '#0f766e' },
  byte: { word: 'BYTE', tone: '#d5f66b', inkLight: '#4a6300' },
};
const look = (proj) => LOOKS[proj.slug] ?? { word: proj.title.split(' ')[0].toUpperCase(), tone: '#d5f66b', inkLight: '#4a6300' };

/* A case study figure, split so its number can count: "~20 ms" is "~", 20
   and "ms"; "0.51 → 0.70" counts from 0.51, anything else from 0. */
function figure(value) {
  const nums = [...value.matchAll(/\d+(?:\.\d+)?/g)];
  const last = nums.at(-1);
  if (!last) return { prefix: value, number: '', suffix: '' };
  const from = nums.length > 1 ? nums[0][0] : '0';
  return {
    prefix: value.slice(0, last.index),
    number: last[0],
    suffix: value.slice(last.index + last[0].length).trim(),
    from: Number(from) === Number(last[0]) ? null : from,
    decimals: (last[0].split('.')[1] ?? '').length,
  };
}

function Demo({ proj }) {
  if (proj.showcase === 'vocaly') return <VocalyShowcase logo={proj.logo} />;
  if (proj.showcase === 'latency') return <LatencyShowcase />;
  if (proj.showcase === 'byte') return <ByteShowcase />;
  return null;
}

function Metric({ stat }) {
  const f = figure(stat.value);
  return (
    <div className="flex flex-col-reverse justify-end gap-2" data-reel-fade>
      <dt className="max-w-[24ch] text-[13px] leading-snug text-muted-foreground">{stat.label}</dt>
      <dd className="font-semibold tracking-[-0.04em] text-[var(--tone-ink)]">
        <span className="sr-only">{stat.value}</span>
        <span aria-hidden="true" className="flex items-baseline text-[clamp(2.25rem,3.4vw,3rem)] leading-none whitespace-nowrap tabular-nums">
          {/* a "before →" stays small and a "~" muted, so the number itself leads */}
          {f.prefix && (
            <span className={cn('text-muted-foreground', f.prefix.includes('→') ? 'mr-1.5 text-[0.46em] font-medium tracking-[-0.01em]' : 'mr-0.5 text-[0.66em]')}>
              {f.prefix.trim()}
            </span>
          )}
          <span data-count={f.from === null ? undefined : f.number} data-from={f.from ?? undefined} data-decimals={f.decimals}>
            {f.number}
          </span>
          {f.suffix && <span className="ml-1.5 text-[0.46em] tracking-[-0.01em] text-foreground/75">{f.suffix}</span>}
        </span>
      </dd>
    </div>
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

function Scene({ proj, index }) {
  const { word, tone, inkLight } = look(proj);
  const stats = caseStudy(proj.slug)?.stats.slice(0, 2) ?? [];
  const titleId = `project-title-${index + 1}`;
  const words = proj.title.split(' ');
  return (
    <article id={`project-${index + 1}`} aria-labelledby={titleId} data-index={index} className="reel-scene" style={{ '--tone': tone, '--ink-light': inkLight }}>
      <span className="reel-word" aria-hidden="true">
        {word}
      </span>

      <div className="reel-inner">
        <div className="reel-copy">
          <h3 id={titleId} className="reel-title">
            <Link
              href={`/projects/${proj.slug}`}
              aria-label={proj.title}
              data-cursor="case"
              className="reel-link outline-none after:absolute after:-inset-3 after:z-[1] after:rounded-3xl after:content-[''] focus-visible:after:ring-[3px] focus-visible:after:ring-ring/50"
            >
              {/* one masked span per letter, so the title can rise in */}
              {words.map((w, i) => (
                <span key={i}>
                  <span className="reel-mask">
                    {[...w].map((c, k) => (
                      <span key={k} className="reel-char">
                        {c}
                      </span>
                    ))}
                  </span>
                  {i < words.length - 1 && ' '}
                </span>
              ))}
            </Link>
          </h3>
          <p className="mt-5 max-w-[48ch] text-[15px] leading-relaxed text-muted-foreground md:text-base" data-reel-fade>
            {proj.overview}
          </p>

          {stats.length > 0 && (
            <dl className="mt-7 grid max-w-[32rem] grid-cols-2 gap-x-8 gap-y-5">
              {stats.map((s) => (
                <Metric key={s.label} stat={s} />
              ))}
            </dl>
          )}

          <div className="relative z-10 mt-8 flex flex-wrap gap-3" data-reel-fade>
            <Actions proj={proj} />
          </div>

          <ul className="reel-tech mt-6 flex flex-wrap gap-2" aria-label="Technologies" data-reel-fade>
            {proj.tech.slice(0, 6).map((t) => (
              <li
                key={t}
                className="inline-flex min-h-8 items-center gap-2 rounded-full border border-border bg-background/70 px-3 text-[13px] text-muted-foreground has-[.logo-plate]:pl-1.5"
              >
                <SkillLogo name={t} size={14} />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Vocaly's demo is interactive, so its stage sits above the scene's link */}
        <div className={cn('reel-stage', proj.showcase === 'vocaly' && 'z-10')}>
          <div className="reel-frame" data-fit={proj.showcase === 'vocaly' ? undefined : ''}>
            <div className="reel-screen">
              <Demo proj={proj} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  const projects = RESUME.projects;
  return (
    <section id="projects" className="reel section-y" aria-labelledby="projects-title">
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
      </div>

      {/* the extra height the reel scrolls through (reel mode only, globals.css) */}
      <div className="reel-pin" style={{ '--reel-run': `${reelLength(projects.length) * UNIT_VW}vw` }}>
        <div className="reel-view">
          {projects.map((p) => (
            <span key={p.slug} className="reel-glow" aria-hidden="true" style={{ '--tone': look(p).tone }} />
          ))}
          <div className="reel-track">
            {projects.map((proj, i) => (
              <Scene key={proj.slug} proj={proj} index={i} />
            ))}
          </div>
          <ReelRail titles={projects.map((p) => p.title)} />
        </div>
      </div>

      <ReelMotion />
      <ReelCursor />
    </section>
  );
}
