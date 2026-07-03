'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Card } from './ui/Card';
import { MagneticButton } from './ui/MagneticButton';

export function OpenSource() {
  const prefersReducedMotion = useReducedMotion();

  const stats = [
    { name: 'Repositories', value: '10+' },
    { name: 'Primary Lang', value: 'Python' },
    { name: 'Focus Area', value: 'AI/ML' }
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
        duration: 0.6
      }
    }
  };

  return (
    <section id="opensource" className="relative py-16 md:py-20 bg-bg-primary border-t border-border-dim">
      <div className="container mx-auto px-6 max-w-6xl">
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
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            GitHub & Contributions
          </h2>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            visible: { transition: { staggerChildren: 0.08 } }
          }}
        >
          {/* GitHub Details Card */}
          <motion.div variants={revealVariants} className="h-full">
            <Card className="h-full flex flex-col justify-between p-8">
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-3 flex items-center gap-2.5">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>
                  @alimehdikhan
                </h3>
                <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-6">
                  Building open-source tools and contributing to the developer community. Focused on AI/ML applications, backend APIs, and developer tooling.
                </p>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {stats.map((s, idx) => (
                    <div key={idx} className="flex flex-col p-4 rounded-lg bg-bg-elevated/40 border border-border-dim text-center">
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
                  href="https://github.com/alimehdikhan" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="View GitHub Profile"
                >
                  View GitHub Profile
                </MagneticButton>
              </div>
            </Card>
          </motion.div>

          {/* Interactive Terminal Card */}
          <motion.div variants={revealVariants} className="h-full">
            <Card className="h-full p-0 flex flex-col overflow-hidden border border-border-dim/80 bg-bg-elevated/60 shadow-2xl">
              {/* Terminal Window Header Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-bg-elevated border-b border-border-dim">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-text-secondary select-none">~/alimehdikhan</span>
                <span className="w-12" /> {/* spacer to balance */}
              </div>

              {/* Terminal Contents */}
              <div className="p-6 flex flex-col gap-4 font-mono text-xs sm:text-sm text-text-secondary leading-relaxed bg-bg-elevated/80 select-text overflow-x-auto">
                <div className="flex gap-2">
                  <span className="text-emerald-400 select-none">$</span>
                  <span className="text-text-primary">git log --oneline -5</span>
                </div>
                <div className="flex flex-col gap-1 pl-4 text-text-secondary border-l border-border-dim">
                  <div>a3f8b21 feat: AI pronunciation coach API</div>
                  <div>7c2d1e4 feat: diagnostic vision pipeline</div>
                  <div>b9e4f67 docs: update portfolio site</div>
                  <div>1d5a892 fix: model inference pipeline</div>
                  <div>e8c3b11 chore: add Docker config</div>
                </div>
                
                <div className="flex gap-2 mt-2">
                  <span className="text-emerald-400 select-none">$</span>
                  <span className="text-text-primary">cat skills.json | jq '.focus'</span>
                </div>
                <div className="pl-4 text-text-secondary border-l border-border-dim">
                  "AI/ML, Backend APIs, Open Source"
                </div>

                <div className="flex gap-2 mt-2">
                  <span className="text-emerald-400 select-none">$</span>
                  <span className="text-text-primary">echo $STATUS</span>
                </div>
                <div className="pl-4 text-emerald-400 font-semibold border-l border-border-dim">
                  ✓ Available for opportunities
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
