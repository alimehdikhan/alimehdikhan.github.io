'use client';

import { SectionHead } from './ui/SectionHead';
import { RESUME } from '../data/resume';

export function Timeline() {
  return (
    <section id="experience" className="sec" aria-labelledby="experience-title">
      <SectionHead title="Experience & Involvement" index="03" label="Work History" titleId="experience-title" />

      <div className="rail rev">
        {RESUME.experience.map((exp) => (
          <article key={exp.role} className="rail-item">
            <div className="rail-head">
              <h3>{exp.role}</h3>
              <span className="rail-date">{exp.date}</span>
            </div>
            <div className="rail-co">{exp.company}</div>
            <ul className="rail-list">
              {exp.details.map((detail, dIdx) => (
                <li key={dIdx}>{detail}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
