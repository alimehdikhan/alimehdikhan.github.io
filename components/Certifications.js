'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Card } from './ui/Card';
import { RESUME } from '../data/resume';

export function Certifications() {
  const prefersReducedMotion = useReducedMotion();

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
    <section id="certifications" className="relative py-16 sm:py-24 md:py-32 bg-bg-primary border-t border-border-dim">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ y: prefersReducedMotion ? 0 : 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2 inline-block">
            Credentials
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Certifications
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {RESUME.certifications.map((cert) => (
            <motion.div key={cert.title} variants={revealVariants} className="h-full">
              <Card hoverable className="p-5 sm:p-6 h-full flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-bold text-text-primary leading-snug">{cert.title}</h3>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary whitespace-nowrap">
                    {cert.date}
                  </span>
                </div>
                <p className="text-sm text-indigo-400 font-semibold">{cert.issuer}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}