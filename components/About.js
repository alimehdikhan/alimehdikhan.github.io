import { SectionHead } from './ui/SectionHead';
import { Card } from './ui/card';
import { Reveal } from './fx/Reveal';
import { Counter } from './fx/Counter';
import { RESUME } from '../data/resume';

const stats = [
  { label: 'Certifications', value: `${RESUME.certifications.length} Credentials` },
  { label: 'Currently', value: 'Junior Developer · IMAPRO' },
  { label: 'Teaching', value: '30+ Students Mentored' },
  { label: 'Education', value: 'B.Tech CSE (2026)' },
];

const focusAreas = [
  'LLM Apps & Agentic AI',
  'RAG & Vector Databases',
  'Backend APIs (FastAPI)',
  'Machine Learning',
];

/* Large figure where the value leads with a number, plain text otherwise.
   The counter eases up once the card is on screen. */
function StatValue({ value, delay }) {
  const m = value.match(/^(\d+)(\+?)\s+(.*)$/);
  if (!m) {
    return <div className="text-lg leading-snug font-semibold tracking-[-0.02em] sm:text-xl md:text-2xl">{value}</div>;
  }
  const [, num, plus, unit] = m;
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <span className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl [&_em]:not-italic">
        <Counter to={Number(num)} suffix={plus} delay={delay} />
      </span>
      <span className="text-muted-foreground">{unit}</span>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="section-y" aria-labelledby="about-title">
      <div className="container-page">
        <SectionHead
          title={
            <>
              Academic &amp; Technical <em>Overview</em>
            </>
          }
          index="01"
          label="Background"
          titleId="about-title"
        />

        <Reveal stagger={0.06} className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
          {stats.map((stat, i) => (
            <Card key={stat.label} className="flex min-h-32 flex-col justify-between gap-4 p-5 sm:min-h-40 sm:gap-6 sm:p-6">
              <span className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">{stat.label}</span>
              <StatValue value={stat.value} delay={0.25 + i * 0.06} />
            </Card>
          ))}
        </Reveal>

        <div className="mt-4 grid gap-4 lg:mt-6 lg:grid-cols-[1.5fr_1fr] lg:gap-6">
          <Reveal>
            <Card className="h-full p-6 md:p-10">
              <h3 className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">Summary</h3>
              <p className="mt-4 text-lg leading-relaxed font-medium tracking-[-0.01em] md:text-xl">{RESUME.summary}</p>
              <p className="mt-6 text-muted-foreground">
                Right now that means a junior developer role at IMAPRO, migrating a production frontend to SvelteKit 5. Before that: an ML internship at GrasTech training medical-imaging models, and three months teaching programming with Tech for Good.
              </p>

              <div className="mt-8 grid gap-6 border-t border-border pt-8 sm:grid-cols-2 sm:gap-8">
                <div>
                  <h4 className="text-[17px] font-semibold tracking-[-0.015em]">Software Development</h4>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                    REST APIs in Python and FastAPI, frontend work in SvelteKit and Next.js. Comfortable in Java, OOP, and SQL.
                  </p>
                </div>
                <div>
                  <h4 className="text-[17px] font-semibold tracking-[-0.015em]">Machine Learning</h4>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                    CNN classifiers, Whisper speech pipelines, and prompt-driven LLM feedback loops — TensorFlow and Keras, tuned by hand.
                  </p>
                </div>
              </div>
            </Card>
          </Reveal>

          <Reveal stagger={0.08} className="grid gap-4 lg:gap-6">
            <Card className="p-6 md:p-8">
              <h3 className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">Core Focus Areas</h3>
              <ul className="mt-4 divide-y divide-border">
                {focusAreas.map((area) => (
                  <li key={area} className="py-3 font-medium">
                    {area}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Google Cloud badges for Gemini, Imagen, and Vertex AI prompt design — plus Deloitte&apos;s technology job simulation.
              </p>
            </Card>

            <Card className="p-6 md:p-8">
              <h3 className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">Awards &amp; Honors</h3>
              {RESUME.awards.map((award) => (
                <p key={award.title} className="mt-4 text-muted-foreground">
                  <strong className="font-semibold text-foreground">{award.title}</strong>
                  {' — '}
                  {award.detail}
                </p>
              ))}
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
