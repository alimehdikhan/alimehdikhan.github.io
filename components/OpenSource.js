'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Card } from './ui/Card';
import { MagneticButton } from './ui/MagneticButton';
import { RESUME } from '../data/resume';

export function OpenSource() {
  const prefersReducedMotion = useReducedMotion();

  const stats = [
    { name: 'Repositories', value: `${RESUME.githubStats.publicRepos}` },
    { name: 'Primary Lang', value: RESUME.githubStats.primaryLang },
    { name: 'Focus Area', value: RESUME.githubStats.focusArea },
  ];

  const revealVariants = {
    hidden: { y: prefersReducedMotion ? 0 : 20, opacity: 0 },
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
    <section id="opensource" className="relative py-16 sm:py-24 md:py-32 bg-bg-primary border-t border-border-dim">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ y: prefersReducedMotion ? 0 : 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2 inline-block">
            Open Source
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            GitHub & Contributions
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          <motion.div variants={revealVariants} className="h-full">
            <Card className="h-full flex flex-col justify-between p-5 sm:p-8">
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2.5">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
                  </svg>
                  @alimehdikhan
                </h3>
                <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-6">
                  Open-source projects focused on AI/ML applications and Python backend APIs, including my AI Pronunciation Coach and Cancer Detection System.
                </p>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {stats.map((s) => (
                    <div key={s.name} className="flex flex-col p-4 rounded-lg bg-bg-elevated/40 border border-border-dim text-center">
                      <span className="text-lg sm:text-xl font-bold text-text-primary mb-0.5">{s.value}</span>
                      <span className="text-[10px] sm:text-xs text-text-secondary font-medium uppercase tracking-wider">{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <MagneticButton
                  variant="primary"
                  as="a"
                  href={RESUME.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View GitHub Profile"
                >
                  View GitHub Profile
                </MagneticButton>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={revealVariants} className="h-full">
            <Card className="h-full p-0 flex flex-col overflow-hidden border border-border-dim/80 bg-bg-elevated/60 shadow-2xl">
              <div className="flex items-center justify-between px-4 py-3 bg-bg-elevated border-b border-border-dim">
                <div className="flex gap-1.5" aria-hidden="true">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-text-secondary select-none">A.I-Pronunciation-Coach</span>
                <span className="w-12" aria-hidden="true" />
              </div>

              <div className="p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 font-mono text-xs text-text-secondary leading-relaxed bg-bg-elevated/80 select-text overflow-x-auto">
                <div className="flex gap-2">
                  <span className="text-emerald-400 select-none" aria-hidden="true">$</span>
                  <span className="text-text-primary">git log --oneline -5</span>
                </div>
                <div className="flex flex-col gap-1 pl-4 text-text-secondary border-l border-border-dim">
                  {RESUME.githubCommits.map((commit) => (
                    <div key={commit.sha}>
                      {commit.sha} {commit.message}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-2">
                  <span className="text-emerald-400 select-none" aria-hidden="true">$</span>
                  <span className="text-text-primary">echo $STATUS</span>
                </div>
                <div className="pl-4 text-emerald-400 font-semibold border-l border-border-dim">
                  Available for entry-level Software Engineering and AI/ML roles
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}