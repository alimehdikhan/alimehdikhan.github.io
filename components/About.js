'use client';

import { SectionHead } from './ui/SectionHead';
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

/* Big display number where the value leads with one, editorial text otherwise. */
function StatValue({ value }) {
  const m = value.match(/^(\d+)(\+?)\s+(.*)$/);
  if (!m) {
    return <div className="n n-text">{value}</div>;
  }
  const [, num, plus, unit] = m;
  return (
    <div className="n">
      <em data-to={num} data-suffix={plus}>
        {num}
        {plus}
      </em>
      <span className="unit">{unit}</span>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="sec" aria-labelledby="about-title">
      <SectionHead title="Academic & Technical Overview" index="01" label="Background" titleId="about-title" />

      <div className="hair hair-4 stats bleed rev">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="l">{stat.label}</div>
            <StatValue value={stat.value} />
          </div>
        ))}
      </div>

      <div className="hair hair-split rev" style={{ marginTop: 'clamp(38px, 5vw, 60px)' }}>
        <div>
          <span className="eyebrow">Summary</span>
          <p className="p-body" style={{ marginTop: 16 }}>
            {RESUME.summary}
          </p>
          <p className="p-body">
            Right now that means a junior developer role at IMAPRO, migrating a production frontend to SvelteKit 5. Before that: an ML internship at GrasTech training medical-imaging models, and three months teaching programming with Tech for Good.
          </p>

          <div className="sub-hair">
            <div>
              <h4 className="mini-title">
                <i aria-hidden="true">▹</i> Software Development
              </h4>
              <p className="mini-body">
                REST APIs in Python and FastAPI, frontend work in SvelteKit and Next.js. Comfortable in Java, OOP, and SQL.
              </p>
            </div>
            <div>
              <h4 className="mini-title">
                <i aria-hidden="true">▹</i> Machine Learning
              </h4>
              <p className="mini-body">
                CNN classifiers, Whisper speech pipelines, and prompt-driven LLM feedback loops — TensorFlow and Keras, tuned by hand.
              </p>
            </div>
          </div>

          <hr className="rule" />
          <span className="eyebrow">Awards &amp; Honors</span>
          {RESUME.awards.map((award) => (
            <p key={award.title} className="p-body" style={{ marginTop: 12 }}>
              <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>{award.title}</strong>
              {' — '}
              {award.detail}
            </p>
          ))}
        </div>

        <div>
          <span className="eyebrow">Core Focus Areas</span>
          <ul className="list-rule" style={{ marginTop: 16 }}>
            {focusAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>

          <hr className="rule" />
          <p className="mini-body">
            Google Cloud badges for Gemini, Imagen, and Vertex AI prompt design — plus Deloitte&apos;s technology job simulation.
          </p>
        </div>
      </div>
    </section>
  );
}
