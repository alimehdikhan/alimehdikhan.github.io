import Link from 'next/link';
import { ArrowUpRight, ChevronRight, Code } from '@/components/ui/icons';
import { SectionHead } from './ui/SectionHead';
import { Button } from './ui/button';
import { Magnetic } from './ui/magnetic';
import { SpotlightCard } from './ui/aceternity/spotlight-card';
import { CardContainer } from './ui/aceternity/3d-card';
import { SkillLogo } from './Skills';
import { VocalyShowcase } from './VocalyShowcase';
import { ProjectSequence } from './fx/ProjectSequence';
import { StarButton } from './StarRepo';
import { RESUME } from '../data/resume';

/* Layer ownership, so GSAP and Motion never drive the same element:
   .project-slot      sticky stacking position (CSS) + entrance (GSAP)
   .project-scaler    scale/dim as the next card stacks over it (GSAP)
   CardContainer      cursor tilt (Motion)
   SpotlightCard      spotlight + border glow (Motion), hover lift (CSS)
   .project-art-wrap  wipe reveal (GSAP); .project-art-inner scale (GSAP);
   .project-art       hover zoom (CSS)
   .project-reveal>*  staggered detail reveal (GSAP) */

/* the project whose repo visitors are asked to star trades its Code button
   for a Star one (both open the same repo): one clear ask, with its reason */
const STAR_URL = `https://github.com/${RESUME.starRepo.path}`;

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
        />

        <ProjectSequence />
        <div className="project-stack flex flex-col gap-6">
          {RESUME.projects.map((proj, i) => (
            <div key={proj.title} className="project-slot" style={{ '--i': i, zIndex: i + 1 }}>
              <span className="project-marker block h-0" aria-hidden="true" />
              <div className="project-scaler origin-top">
                <CardContainer maxTilt={3}>
                  <SpotlightCard
                    as="article"
                    interactive
                    borderGlow
                    id={`project-${i + 1}`}
                    aria-labelledby={`project-title-${i + 1}`}
                    tabIndex={-1}
                    className="group grid scroll-mt-24 overflow-hidden bg-card lg:grid-cols-[0.95fr_1.05fr]"
                  >
                    <div className="project-art-wrap relative overflow-hidden bg-[#111214] lg:h-full">
                      <div className="project-art-inner h-full">
                        {proj.logo ? (
                          /* a product with its own brand gets a showcase: its real
                             mark, the README demo and its measured accuracy */
                          <VocalyShowcase logo={proj.logo} />
                        ) : (
                          <img
                            className="project-art aspect-[16/10] h-full w-full object-cover lg:aspect-auto"
                            src={`/assets/images/project-${i + 1}.svg`}
                            alt=""
                            width="800"
                            height="500"
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                      </div>
                    </div>

                    {/* scan order: what it is, what it achieved, where to see it,
                        then the detail */}
                    <div className="project-reveal flex flex-col p-6 md:p-8 lg:p-10">
                      <p className="text-sm text-muted-foreground">{proj.tag}</p>
                      <h3
                        id={`project-title-${i + 1}`}
                        className="mt-3 text-[28px] leading-tight font-semibold tracking-[-0.025em] md:text-[32px]"
                      >
                        {proj.title}
                      </h3>

                      {/* the result reads as the lead line, set by type rather than boxed */}
                      <div className="mt-4">
                        <h4 className="text-xs font-semibold tracking-[0.08em] text-link uppercase">Results</h4>
                        <p className="mt-1.5 max-w-[46ch] text-[17px] leading-snug font-medium tracking-[-0.01em] [&_em]:font-semibold [&_em]:text-link [&_em]:not-italic">
                          {proj.outcome}
                        </p>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3">
                        {proj.demo && (
                          <Magnetic>
                            <Button asChild>
                              <a href={proj.demo} target="_blank" rel="noopener noreferrer" aria-label={`View live demo of ${proj.title}`}>
                                Live Demo
                                <ArrowUpRight aria-hidden="true" />
                              </a>
                            </Button>
                          </Magnetic>
                        )}
                        {proj.github === STAR_URL ? (
                          <StarButton placement="project" />
                        ) : proj.demo ? (
                          <Button asChild variant="outline">
                            <a href={proj.github} target="_blank" rel="noopener noreferrer" aria-label={`View code for ${proj.title} on GitHub`}>
                              <Code aria-hidden="true" />
                              Code
                              <ArrowUpRight aria-hidden="true" />
                            </a>
                          </Button>
                        ) : (
                          <Magnetic>
                            <Button asChild>
                              <a href={proj.github} target="_blank" rel="noopener noreferrer" aria-label={`View code for ${proj.title} on GitHub`}>
                                <Code aria-hidden="true" />
                                Code
                                <ArrowUpRight aria-hidden="true" />
                              </a>
                            </Button>
                          </Magnetic>
                        )}
                      </div>
                      {proj.github === STAR_URL && (
                        <p className="mt-3 text-[13px] text-muted-foreground">Free and open source. A star helps more learners find it.</p>
                      )}
                      {proj.slug && (
                        <Link
                          href={`/projects/${proj.slug}`}
                          className="group/case mt-4 inline-flex items-center gap-1.5 self-start rounded-sm text-[15px] font-medium text-link underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/40"
                        >
                          How I built it: the case study
                          <ChevronRight className="size-4 transition-transform group-hover/case:translate-x-0.5 motion-reduce:transition-none" />
                        </Link>
                      )}

                      <div className="mt-6 border-t border-border pt-6">
                        <h4 className="sr-only">Overview</h4>
                        <p className="text-[15px] leading-relaxed text-foreground/90">{proj.overview}</p>
                        <h4 className="mt-4 text-sm font-semibold">How it works</h4>
                        <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{proj.features}</p>
                      </div>

                      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
                        {proj.tech.map((t) => (
                          <li
                            key={t}
                            className="inline-flex min-h-9 items-center gap-2 rounded-full border border-border px-3 text-[13px] text-muted-foreground has-[.logo-plate]:pl-1.5"
                          >
                            <SkillLogo name={t} size={14} />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </SpotlightCard>
                </CardContainer>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
