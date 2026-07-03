'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Card } from './ui/Card';

export function Skills() {
  const prefersReducedMotion = useReducedMotion();

  const categories = [
    {
      title: 'Languages',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      skills: ['Python', 'Java', 'C', 'C++', 'JavaScript', 'SQL', 'HTML', 'CSS'],
      colorClass: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5',
      accentColor: 'rgb(129, 140, 248)'
    },
    {
      title: 'Backend & Tools',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      ),
      skills: ['FastAPI', 'REST APIs', 'Git', 'GitHub'],
      colorClass: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
      accentColor: 'rgb(52, 211, 153)'
    },
    {
      title: 'AI & Machine Learning',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      skills: ['Machine Learning', 'NLP', 'TensorFlow', 'Keras', 'Feature Engineering'],
      colorClass: 'text-purple-400 border-purple-500/20 bg-purple-500/5',
      accentColor: 'rgb(192, 132, 252)'
    },
    {
      title: 'Professional Soft Skills',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      skills: ['Communication', 'Problem Solving', 'Team Collaboration', 'Adaptability', 'Time Management'],
      colorClass: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
      accentColor: 'rgb(251, 191, 36)'
    }
  ];

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: prefersReducedMotion ? 0 : 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 85,
        damping: 15
      }
    }
  };

  const pillVariants = {
    hidden: { scale: prefersReducedMotion ? 1 : 0.85, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 10
      }
    }
  };

  return (
    <section id="skills" className="relative py-16 sm:py-24 md:py-32 bg-bg-primary">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            hidden: { y: prefersReducedMotion ? 0 : 20, opacity: 0 },
            visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
          }}
        >
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2 inline-block">
            Technical Expertise
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Skills & Abilities
          </h2>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {categories.map((cat, i) => (
            <motion.div key={i} variants={cardVariants} className="h-full">
              <Card className="p-5 sm:p-8 h-full flex flex-col justify-start">
                <div className="flex items-center gap-3 mb-8">
                  <div className={`p-2.5 rounded-lg border ${cat.colorClass}`}>
                    {cat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-text-primary">
                    {cat.title}
                  </h3>
                </div>
                
                <motion.div 
                  className="flex flex-wrap gap-2.5"
                  variants={{
                    visible: { transition: { staggerChildren: 0.04 } }
                  }}
                >
                  {cat.skills.map((skill, idx) => (
                    <motion.span 
                      key={idx} 
                      className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-bg-elevated border border-border-dim text-text-secondary transition-colors hover:text-text-primary select-none cursor-default"
                      variants={pillVariants}
                      whileHover={prefersReducedMotion ? {} : { 
                        scale: 1.05, 
                        y: -1,
                        boxShadow: `0 4px 12px rgba(0,0,0,0.5)`,
                        borderColor: cat.accentColor
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
