'use client';

import { motion } from 'framer-motion';
import { Reveal } from '../fx/Reveal';
import { EASE, EASE_FADE } from '../fx/motion';

/* Section heads speak the hero's language: the display title rises out of a
   line mask, the mono index settles a beat later, and the hairline rule
   draws in from the left. Every animated child keeps `rev-i` so the
   reduced-motion stylesheet pins it visible. */
const title = { hidden: { y: '105%' }, visible: { y: 0, transition: { duration: 0.9, ease: EASE } } };
const idx = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.4, ease: EASE_FADE } },
};
const rule = { hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 1, ease: EASE } } };

export function SectionHead({ title: text, index, label, titleId }) {
  return (
    <Reveal className="head" rise={false}>
      <span className="line">
        <motion.h2 id={titleId} className="rev-i" variants={title}>
          {text}
        </motion.h2>
      </span>
      <motion.span className="idx rev-i" variants={idx}>
        {index} — {label}
      </motion.span>
      <motion.i className="rule rev-i" aria-hidden="true" variants={rule} style={{ originX: 0 }} />
    </Reveal>
  );
}
