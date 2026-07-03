'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Card } from './ui/Card';
import { RESUME } from '../data/resume';

export function Timeline() {
  const containerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 0.9], ['0%', '100%']);

  const cardVariants = {
    hidden: (align) => ({
      x: prefersReducedMotion ? 0 : align === 'left' ? -30 : 30,
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 90,
        damping: 15,
        duration: 0.6,
      },
    },
  };

  return (
    <section id="experience" className="relative py-16 sm:py-24 md:py-32 bg-bg-primary border-t border-border-dim" ref={containerRef}>
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <motion.div
          className="text-center mb-20"
          initial={{ y: prefersReducedMotion ? 0 : 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2 inline-block">
            Work History
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Experience & Involvement
          </h2>
        </motion.div>

        <div className="relative flex flex-col gap-10 md:gap-16">
          <div className="absolute left-5 sm:left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-border-dim md:-translate-x-1/2 z-0" aria-hidden="true">
            <motion.div
              style={{ height: prefersReducedMotion ? '100%' : lineHeight }}
              className="w-full bg-gradient-to-b from-indigo-500 via-purple-500 to-emerald-500 origin-top rounded-full"
            />
          </div>

          {RESUME.experience.map((exp, idx) => {
            const isLeft = exp.align === 'left';
            return (
              <div key={idx} className={`relative flex ${isLeft ? 'md:justify-start' : 'md:justify-end'}`}>
                <div
                  className="absolute left-5 sm:left-6 md:left-1/2 w-3.5 h-3.5 rounded-full border-4 border-bg-primary bg-indigo-500 top-6 -translate-x-1/2 z-10 shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                  aria-hidden="true"
                />

                <motion.div
                  className="w-full pl-12 sm:pl-14 md:pl-0 md:w-[85%]"
                  custom={exp.align}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-100px' }}
                  variants={cardVariants}
                >
                  <Card hoverable className="p-5 sm:p-6 relative">
                    <span className="inline-block px-2.5 py-1 text-xs font-bold rounded-full bg-bg-elevated border border-border-dim text-text-secondary mb-3">
                      {exp.date}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-text-primary mb-1">{exp.role}</h3>
                    <div className="text-sm font-semibold text-indigo-400 mb-3">{exp.company}</div>

                    <ul className="list-none flex flex-col gap-2 text-sm text-text-secondary">
                      {exp.details.map((detail, dIdx) => (
                        <li key={dIdx} className="flex gap-2 items-start leading-relaxed">
                          <span className="text-indigo-400 mt-1 flex-shrink-0" aria-hidden="true">▹</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}