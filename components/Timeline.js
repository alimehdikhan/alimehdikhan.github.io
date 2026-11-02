import { SectionHead } from './ui/SectionHead';
import { Card } from './ui/card';
import { Reveal } from './fx/Reveal';
import { TimelineMotion } from './fx/TimelineMotion';
import { cn } from '@/lib/utils';
import { RESUME } from '../data/resume';

export function Timeline() {
  return (
    <section id="experience" className="section-y overflow-x-clip" aria-labelledby="experience-title">
      <div className="container-page">
        <SectionHead
          title={
            <>
              Where I&apos;ve <em>worked</em>
            </>
          }
          titleId="experience-title"
        />

        <TimelineMotion />
        <div className="timeline-list relative">
          <span
            aria-hidden="true"
            className="timeline-line absolute top-2 bottom-2 left-[7px] w-px origin-top bg-gradient-to-b from-primary via-border-strong to-border-strong md:left-[calc(25%-0.5px)]"
          />
          <Reveal stagger={0.14} x={28} y={0} className="flex flex-col gap-6 md:gap-8">
            {RESUME.experience.map((exp, i) => (
              <article key={exp.role} className="relative grid gap-4 pl-8 md:grid-cols-[25%_1fr] md:gap-0 md:pl-0">
                <span
                  aria-hidden="true"
                  className={cn(
                    'timeline-node absolute top-2 left-0 size-[15px] rounded-full border-[3px] border-background md:left-[calc(25%-7.5px)]',
                    i === 0 ? 'bg-primary shadow-[0_0_12px_rgb(var(--glow)/0.9)]' : 'bg-border-strong'
                  )}
                />

                <div className="md:pr-10 md:text-right">
                  <p className="text-sm font-semibold tabular-nums">{exp.date}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{exp.company}</p>
                </div>

                <Card className="p-6 md:ml-10 md:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
                    <h3 className="text-xl font-semibold tracking-[-0.02em] md:text-2xl">{exp.role}</h3>
                    {/* the company's real logo, on the plate its colours were made for */}
                    {exp.logo && (
                      <span
                        className={cn(
                          'inline-flex h-10 shrink-0 items-center rounded-xl px-3.5 ring-1',
                          exp.logo.plate === 'dark' ? 'bg-[#0b0b0b] ring-white/10' : 'bg-white ring-black/10'
                        )}
                      >
                        <img
                          src={exp.logo.src}
                          alt=""
                          width={exp.logo.width}
                          height={exp.logo.height}
                          className="h-[18px] w-auto"
                          loading="lazy"
                          decoding="async"
                        />
                      </span>
                    )}
                  </div>
                  <ul className="mt-4 space-y-3">
                    {exp.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex gap-3 text-muted-foreground">
                        <span className="mt-[0.75em] size-1 shrink-0 rounded-full bg-muted-foreground" aria-hidden="true" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </Card>
              </article>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
