import { SectionHead } from './ui/SectionHead';
import { Reveal } from './fx/Reveal';
import { STAGGER } from './fx/motion';
import { RESUME } from '../data/resume';

export function Timeline() {
  return (
    <section id="experience" className="sec" aria-labelledby="experience-title">
      <SectionHead title="Experience & Involvement" index="03" label="Work History" titleId="experience-title" />

      <Reveal className="rail" stagger={STAGGER.item}>
        <i className="rail-line rev-i" aria-hidden="true" />
        {RESUME.experience.map((exp) => (
          <article key={exp.role} className="rail-item rev-i">
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
      </Reveal>
    </section>
  );
}
