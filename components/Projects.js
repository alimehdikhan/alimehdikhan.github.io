import { ArrowUpRight, Code } from 'lucide-react';
import { SectionHead } from './ui/SectionHead';
import { Button } from './ui/button';
import { Magnetic } from './ui/magnetic';
import { SpotlightCard } from './ui/aceternity/spotlight-card';
import { CardContainer } from './ui/aceternity/3d-card';
import { Counter } from './fx/Counter';
import { ProjectSequence } from './fx/ProjectSequence';
import { RESUME } from '../data/resume';

/* Layer ownership, so GSAP and Motion never drive the same element:
   .project-slot      sticky stacking position (CSS) + entrance (GSAP)
   .project-scaler    scale/dim as the next card stacks over it (GSAP)
   CardContainer      cursor tilt (Motion)
   SpotlightCard      spotlight + border glow (Motion), hover lift (CSS)
   .project-art-wrap  wipe reveal (GSAP); .project-art-inner scale (GSAP);
   .project-art       hover zoom (CSS)
   .project-reveal>*  staggered detail reveal (GSAP) */
export function Projects() {
  return (
    <section id="projects" className="section-y" aria-labelledby="projects-title">
      <div className="container-page">
        <SectionHead
          title={
            <>
              Featured <em>Projects</em>
            </>
          }
          index="04"
          label="Portfolio"
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
                        <img
                          className="project-art aspect-[16/10] h-full w-full object-cover lg:aspect-auto"
                          src={`/assets/images/project-${i + 1}.svg`}
                          alt=""
                          width="800"
                          height="500"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>

                    {/* scan order: what it is, what it achieved, where to see it,
                        then the detail */}
                    <div className="project-reveal flex flex-col p-6 md:p-8 lg:p-10">
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                        <span aria-hidden="true" className="h-px w-6 bg-border-strong" />
                        <span>{proj.tag}</span>
                      </p>
                      <h3
                        id={`project-title-${i + 1}`}
                        className="mt-3 text-[28px] leading-tight font-semibold tracking-[-0.025em] md:text-[32px]"
                      >
                        {proj.title}
                      </h3>

                      <div className="mt-4 rounded-2xl border border-border bg-secondary/60 px-4 py-3">
                        <h4 className="text-xs font-semibold tracking-[0.08em] text-link uppercase">Results</h4>
                        <p className="mt-1 text-[15px] leading-snug font-medium [&_em]:font-semibold [&_em]:text-link [&_em]:not-italic">
                          {proj.outcome.startsWith('90%+') ? (
                            <>
                              <Counter to={90} suffix="%+" delay={0} />
                              {proj.outcome.slice(4)}
                            </>
                          ) : (
                            proj.outcome
                          )}
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
                        {proj.demo ? (
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

                      <div className="mt-6 border-t border-border pt-6">
                        <h4 className="sr-only">Overview</h4>
                        <p className="text-[15px] leading-relaxed text-foreground/90">{proj.overview}</p>
                        <h4 className="mt-4 text-sm font-semibold">Implementation</h4>
                        <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{proj.features}</p>
                      </div>

                      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
                        {proj.tech.map((t) => (
                          <li key={t} className="rounded-full border border-border px-3 py-1 text-[13px] text-muted-foreground">
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
