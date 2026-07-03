'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Card } from './ui/Card';

export function Timeline() {
  const containerRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // useScroll for timeline line draw-in
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end']
  });

  const lineHeight = useTransform(scrollYProgress, [0, 0.9], ['0%', '100%']);

  const experiences = [
    {
      role: 'Machine Learning Intern',
      company: 'BBD University · Lucknow',
      date: 'Jun 2025 – Jul 2025',
      details: [
        'Built skin cancer detection and diabetes prediction models using supervised learning and deep learning in Python.',
        'Applied feature engineering and hyperparameter tuning to maximize model accuracy on medical datasets.',
        'Tested inference scripts for batch processing of clinical inputs.'
      ],
      align: 'left'
    },
    {
      role: 'Volunteer Mentor',
      company: 'Tech for Good Initiative',
      date: 'Jun 2024 – Sep 2024',
      details: [
        'Delivered programming training to 30+ underprivileged students over 3 months.',
        'Improved digital literacy and enabled participants to build and deploy their first functional applications.',
        'Covered foundational Python scripting, OOP principles, and Git version control.'
      ],
      align: 'right'
    }
  ];

  const cardVariants = {
    hidden: (align) => ({
      x: prefersReducedMotion ? 0 : align === 'left' ? -30 : 30,
      opacity: 0
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 90,
        damping: 15,
        duration: 0.6
      }
    }
  };

  return (
    <section id="experience" className="relative py-24 bg-[#0A0A0A] border-t border-neutral-900" ref={containerRef}>
      <div className="container mx-auto px-6 max-w-5xl">
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
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Experience & Involvement
          </h2>
        </motion.div>

        <div className="relative flex flex-col md:grid md:grid-cols-2 gap-10">
          {/* Vertical scroll-drawn line (desktop only) */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-neutral-900 -translate-x-1/2 z-0 hidden md:block">
            <motion.div 
              style={{ height: prefersReducedMotion ? '100%' : lineHeight }}
              className="w-full bg-gradient-to-b from-indigo-500 via-purple-500 to-emerald-500 origin-top rounded-full"
            />
          </div>

          {experiences.map((exp, idx) => {
            const isLeft = exp.align === 'left';
            return (
              <div 
                key={idx}
                className={`relative flex flex-col md:grid md:grid-cols-2 md:col-span-2 ${isLeft ? 'md:text-right' : ''}`}
              >
                {/* Visual marker dot (desktop only) */}
                <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full border-4 border-[#0a0a0a] bg-indigo-500 top-6 -translate-x-1/2 z-10 hidden md:block shadow-[0_0_12px_rgba(99,102,241,0.5)]" />

                {/* Content Card Wrapper */}
                <motion.div 
                  className={`w-full md:w-[90%] md:col-span-1 ${isLeft ? 'md:mr-auto md:col-start-1' : 'md:ml-auto md:col-start-2'}`}
                  custom={exp.align}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-100px' }}
                  variants={cardVariants}
                >
                  <Card hoverable className="p-6 relative">
                    <span className="inline-block px-2.5 py-1 text-xs font-bold rounded-full bg-neutral-950 border border-neutral-800 text-neutral-400 mb-4">
                      {exp.date}
                    </span>
                    <h3 className="text-lg font-bold text-white mb-1">{exp.role}</h3>
                    <div className="text-sm font-semibold text-indigo-400 mb-4">{exp.company}</div>
                    
                    <ul className={`list-none flex flex-col gap-2 text-sm text-neutral-400 text-left ${isLeft ? 'md:items-end' : ''}`}>
                      {exp.details.map((detail, dIdx) => (
                        <li key={dIdx} className="flex gap-2 items-start leading-relaxed">
                          <span className="text-indigo-400 mt-1">▹</span>
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
