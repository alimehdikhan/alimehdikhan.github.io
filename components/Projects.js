'use client';

import { SectionHead } from './ui/SectionHead';
import { RESUME } from '../data/resume';

/* Tailwind gradient tokens from the data file → layered row cover art,
   revealed BEHIND the row text on hover (never covering it). */
const ART = {
  'from-indigo-600 to-blue-500': ['#4f46e5', '#3b82f6'],
  'from-emerald-600 to-teal-500': ['#059669', '#14b8a6'],
};
const ART_FALLBACK = ['#7A5BFF', '#39D3E6'];

function coverArt(gradient) {
  const [a, b] = ART[gradient] || ART_FALLBACK;
  return [
    `radial-gradient(120% 100% at 12% 8%, rgba(255,255,255,0.30), transparent 42%)`,
    `radial-gradient(90% 90% at 88% 100%, rgba(6,7,12,0.85), transparent 60%)`,
    `conic-gradient(from 210deg at 68% 32%, ${a}, ${b} 40%, #06070C 78%, ${a})`,
  ].join(',');
}

export function Projects() {

  return (
    <section id="projects" className="sec work" aria-labelledby="projects-title">
      <SectionHead title="Featured Projects" index="04" label="Portfolio" titleId="projects-title" />

      <div className="rev">
        {RESUME.projects.map((proj, i) => (
          <div key={proj.title} className="row" style={{ '--art': coverArt(proj.gradient) }}>
            <div>
              <span className="tag">
                <i aria-hidden="true">{String(i + 1).padStart(2, '0')}</i> {proj.tag}
              </span>
              <h3>{proj.title}</h3>
              <ul className="chips">
                {proj.tech.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="facts">
              <div className="fact">
                <strong>Overview</strong>
                <p>{proj.overview}</p>
              </div>
              <div className="fact">
                <strong>Implementation</strong>
                <p>{proj.features}</p>
              </div>
              <div className="fact out">
                <strong>Results</strong>
                <p>{proj.outcome}</p>
              </div>
            </div>

            <div className="side">
              <a
                href={proj.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View code for ${proj.title} on GitHub`}
              >
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
                </svg>
                Code
              </a>
              {proj.demo && (
                <a
                  href={proj.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="demo"
                  aria-label={`View live demo of ${proj.title}`}
                >
                  Live Demo →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
