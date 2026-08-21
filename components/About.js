'use client';

import { SectionHead } from './ui/SectionHead';
import { RESUME } from '../data/resume';

const stats = [
  { label: 'Certifications', value: `${RESUME.certifications.length} Credentials` },
  { label: 'Experience', value: 'Machine Learning Internship' },
  { label: 'Leadership', value: '30+ Students Mentored' },
  { label: 'Education', value: 'B.Tech CSE (2026)' },
];

const focusAreas = [
  'Artificial Intelligence',
  'Backend APIs (FastAPI)',
  'Python Development',
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
            <StatValue value={stat.value} />
            <div className="l">{stat.label}</div>
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
            Practical experience includes building skin cancer detection and diabetes prediction models during my ML internship, engineering FastAPI audio processing pipelines, and delivering programming training to underprivileged students through Tech for Good.
          </p>

          <div className="sub-hair">
            <div>
              <h4 className="mini-title">
                <i aria-hidden="true">▹</i> Software Development
              </h4>
              <p className="mini-body">
                Experience building RESTful APIs using Python and FastAPI. Proficient in Java, OOP principles, and SQL.
              </p>
            </div>
            <div>
              <h4 className="mini-title">
                <i aria-hidden="true">▹</i> Machine Learning
              </h4>
              <p className="mini-body">
                Supervised learning, binary classification, Keras deep learning architectures, feature engineering, and Whisper NLP pipelines.
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
            Certified in Google Cloud (Gemini, Imagen, Vertex AI Prompt Design) and Deloitte Technology Job Simulation.
          </p>
        </div>
      </div>
    </section>
  );
}
