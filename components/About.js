'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Card } from './ui/Card';

export function About() {
  const prefersReducedMotion = useReducedMotion();

  const stats = [
    { label: 'Certification', value: 'Google Cloud Certified' },
    { label: 'Experience', value: 'Machine Learning Internship' },
    { label: 'Leadership', value: '30+ Students Mentored' },
    { label: 'Education', value: 'B.Tech CSE (2026)' },
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
        duration: 0.6
      }
    }
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

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 md:gap-8 mb-10 sm:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.06 }
            }
          }}
        >
          {stats.map((stat, i) => (
            <motion.div key={i} variants={revealVariants} className="h-full w-full">
              <Card 
                hoverable 
                dynamicGlow
                className="p-4 sm:p-8 text-center flex flex-col justify-center h-full w-full"
              >
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
          <motion.div 
            className="md:col-span-8 h-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={revealVariants}
          >
            <Card className="p-6 sm:p-8 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-indigo-400 mb-4">
                  Summary
                </h3>
                <p className="text-text-secondary leading-relaxed mb-4 text-sm sm:text-base">
                  B.Tech Computer Science graduate (2026) skilled in Python, Java, Machine Learning, and AI application development. Google Cloud and Deloitte certified. Seeking an entry-level Software Engineering or AI/ML role to deliver impactful, data-driven solutions.
                </p>
                <p className="text-text-secondary leading-relaxed mb-6 text-sm sm:text-base">
                  Practical experience includes building skin cancer detection and diabetes prediction models, FastAPI audio processing integrations, and delivering programming training to underprivileged students to improve digital literacy.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card hoverable className="p-4 bg-bg-elevated/20 border border-border-dim">
                  <h4 className="font-semibold text-sm text-text-primary mb-2 flex items-center gap-2">
                    <span className="text-indigo-400">▹</span> Software Development
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Experience building RESTful APIs using Python and FastAPI. Familiar with Java, OOP principles, and SQL databases.
                  </p>
                </Card>
                <Card hoverable className="p-4 bg-bg-elevated/20 border border-border-dim">
                  <h4 className="font-semibold text-sm text-text-primary mb-2 flex items-center gap-2">
                    <span className="text-purple-400">▹</span> Machine Learning
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Implementation experience with supervised learning, binary classification models, Keras deep learning architectures, and Whisper NLP pipelines.
                  </p>
                </Card>
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
                <h3 className="text-lg font-bold text-purple-400 mb-6">Focus Areas</h3>
                
                <div className="flex flex-col gap-5">
                  {[
                    { name: 'Artificial Intelligence', width: '90%', label: 'Focus Area', color: 'bg-purple-500' },
                    { name: 'Backend APIs (FastAPI)', width: '85%', label: 'Focus Area', color: 'bg-indigo-500' },
                    { name: 'Python Development', width: '95%', label: 'Core Lang', color: 'bg-emerald-500' },
                    { name: 'Machine Learning', width: '88%', label: 'Focus Area', color: 'bg-blue-500' }
                  ].map((focus) => (
                    <div key={focus.name} className="flex flex-col">
                      <div className="flex justify-between text-xs sm:text-sm mb-1.5 text-text-secondary">
                        <span>{focus.name}</span>
                        <span className="text-text-secondary text-xs">{focus.label}</span>
                      </div>
                      <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full ${focus.color} rounded-full`}
                          initial={{ width: 0 }}
                          whileInView={{ width: focus.width }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-border-dim/60 text-xs text-text-secondary leading-relaxed">
                Currently exploring: <strong>Agentic AI</strong>, <strong>Prompt Engineering</strong>, and <strong>Cloud Deployments</strong>.
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
