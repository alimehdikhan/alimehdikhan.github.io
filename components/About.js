'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Card } from './ui/Card';
import { RESUME } from '../data/resume';

export function About() {
  const prefersReducedMotion = useReducedMotion();

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

  const revealVariants = {
    hidden: { y: prefersReducedMotion ? 0 : 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
        duration: 0.6,
      },
    },
  };

  return (
    <section id="about" className="relative py-16 sm:py-24 md:py-32 bg-bg-primary border-t border-border-dim">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={revealVariants}
        >
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-2 inline-block">
            Background
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Academic & Technical Overview
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 md:gap-8 mb-10 sm:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.06 },
            },
          }}
        >
          {stats.map((stat, i) => (
            <motion.div key={i} variants={revealVariants} className="h-full w-full">
              <Card hoverable dynamicGlow className="p-4 sm:p-8 text-center flex flex-col justify-center h-full w-full">
                <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                  {stat.label}
                </div>
                <div className="text-sm sm:text-base font-bold text-text-primary leading-tight">
                  {stat.value}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
          <motion.div
            className="md:col-span-8 h-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={revealVariants}
          >
            <Card className="p-6 sm:p-8 h-full flex flex-col justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-indigo-400 mb-4">Summary</h3>
                <p className="text-text-secondary leading-relaxed mb-4 text-sm sm:text-base">
                  {RESUME.summary}
                </p>
                <p className="text-text-secondary leading-relaxed text-sm sm:text-base">
                  Practical experience includes building skin cancer detection and diabetes prediction models during my ML internship, engineering FastAPI audio processing pipelines, and delivering programming training to underprivileged students through Tech for Good.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card hoverable className="p-4 bg-bg-elevated/20 border border-border-dim">
                  <h4 className="font-semibold text-sm text-text-primary mb-2 flex items-center gap-2">
                    <span className="text-indigo-400" aria-hidden="true">▹</span> Software Development
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Experience building RESTful APIs using Python and FastAPI. Proficient in Java, OOP principles, and SQL.
                  </p>
                </Card>
                <Card hoverable className="p-4 bg-bg-elevated/20 border border-border-dim">
                  <h4 className="font-semibold text-sm text-text-primary mb-2 flex items-center gap-2">
                    <span className="text-purple-400" aria-hidden="true">▹</span> Machine Learning
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Supervised learning, binary classification, Keras deep learning architectures, feature engineering, and Whisper NLP pipelines.
                  </p>
                </Card>
              </div>

              <div className="pt-2 border-t border-border-dim/60">
                <h4 className="font-semibold text-sm text-text-primary mb-3">Awards & Honors</h4>
                {RESUME.awards.map((award) => (
                  <div key={award.title} className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    <span className="font-semibold text-text-primary">{award.title}</span>
                    <span className="text-text-tertiary"> — {award.detail}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            className="md:col-span-4 h-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={revealVariants}
          >
            <Card className="p-6 sm:p-8 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-purple-400 mb-6">Core Focus Areas</h3>
                <ul className="flex flex-col gap-3">
                  {focusAreas.map((area) => (
                    <li
                      key={area}
                      className="flex items-center gap-2 text-sm text-text-secondary px-3 py-2 rounded-lg bg-bg-elevated/20 border border-border-dim"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" aria-hidden="true" />
                      {area}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-border-dim/60 text-xs text-text-secondary leading-relaxed">
                Certified in Google Cloud (Gemini, Imagen, Vertex AI Prompt Design) and Deloitte Technology Job Simulation.
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}