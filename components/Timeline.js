'use client';

import { motion } from 'framer-motion';
import { SectionHead } from './ui/SectionHead';
import { Reveal } from './fx/Reveal';
import { EASE, ITEM, STAGGER } from './fx/motion';
import { RESUME } from '../data/resume';

/* the vertical rail draws down as the entries land beside it */
const line = { hidden: { scaleY: 0 }, visible: { scaleY: 1, transition: { duration: 1.1, ease: EASE } } };

export function Timeline() {
  return (
    <section id="experience" className="sec" aria-labelledby="experience-title">
      <SectionHead title="Experience & Involvement" index="03" label="Work History" titleId="experience-title" />

      <Reveal className="rail" stagger={STAGGER.item}>
        <motion.i className="rail-line rev-i" aria-hidden="true" variants={line} style={{ originY: 0 }} />
        {RESUME.experience.map((exp) => (
          <motion.article key={exp.role} className="rail-item rev-i" variants={ITEM}>
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
          </motion.article>
        ))}
      </Reveal>
    </section>
  );
}
