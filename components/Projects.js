'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Card } from './ui/Card';
import { RESUME } from '../data/resume';

export function Projects() {
  const prefersReducedMotion = useReducedMotion();

  const revealVariants = {
    hidden: { y: prefersReducedMotion ? 0 : 25, opacity: 0 },
    visible: {
      y: 0,
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
    <section id="projects" className="relative py-16 sm:py-24 md:py-32 bg-bg-primary border-t border-border-dim">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <motion.div
          className="text-center mb-16"
          initial={{ y: prefersReducedMotion ? 0 : 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-2 inline-block">
            Portfolio
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Featured Projects
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {RESUME.projects.map((proj) => (
            <motion.div key={proj.title} className="flex h-full" variants={revealVariants}>
              <Card hoverable dynamicGlow className="w-full flex flex-col p-0 overflow-hidden">
                <div className="relative aspect-video overflow-hidden w-full group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${proj.gradient} transition-transform duration-500 group-hover:scale-105`} />
                  <div className="absolute inset-0 bg-bg-elevated/20" />
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
                    <span className="text-[10px] font-mono tracking-wider uppercase text-text-primary/80 mb-1">{proj.tag}</span>
                    <h4 className="text-base font-extrabold text-text-primary tracking-tight drop-shadow">{proj.title}</h4>
                  </div>
                </div>

                <div className="p-5 sm:p-8 flex flex-col flex-1 justify-between gap-5 sm:gap-8">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3">
                      <div className="text-xs text-text-secondary">
                        <strong className="block text-text-primary mb-0.5 text-[11px] uppercase tracking-wider">Overview</strong>
                        <span className="leading-relaxed">{proj.overview}</span>
                      </div>
                      <div className="text-xs text-text-secondary">
                        <strong className="block text-text-primary mb-0.5 text-[11px] uppercase tracking-wider">Implementation</strong>
                        <span className="leading-relaxed">{proj.features}</span>
                      </div>
                      <div className="text-xs text-text-secondary">
                        <strong className="block text-text-primary mb-0.5 text-[11px] uppercase tracking-wider">Results</strong>
                        <span className="leading-relaxed text-emerald-400 font-semibold">{proj.outcome}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {proj.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 text-[10px] font-semibold bg-bg-elevated border border-border-dim text-text-secondary rounded-md"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-border-dim/80">
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
                      aria-label={`View code for ${proj.title} on GitHub`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
                      </svg>
                      Code
                    </a>
                    {proj.demo && (
                      <a
                        href={proj.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                        aria-label={`View live demo of ${proj.title}`}
                      >
                        Live Demo →
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}