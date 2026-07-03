'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Card } from './ui/Card';

export function Blog() {
  const prefersReducedMotion = useReducedMotion();

  const articles = [
    {
      title: 'Building a Pronunciation Coach with OpenAI Whisper',
      excerpt: 'How I built an audio scoring API that evaluates speech pronunciation using FastAPI and OpenAI\'s Whisper model for real-time feedback.',
      date: 'Jun 2025',
      readTime: '5 min read',
      tag: 'AI / ML',
      link: '#'
    },
    {
      title: 'Medical Image Classification with CNNs: Lessons Learned',
      excerpt: 'Key insights from building a diagnostic vision pipeline that achieved 90%+ accuracy on medical imaging datasets using TensorFlow.',
      date: 'May 2025',
      readTime: '7 min read',
      tag: 'Deep Learning',
      link: '#'
    },
    {
      title: 'FastAPI Best Practices for Production APIs',
      excerpt: 'A practical guide to structuring FastAPI projects for production, covering dependency injection, validation, and performance optimization.',
      date: 'Apr 2025',
      readTime: '4 min read',
      tag: 'Backend',
      link: '#'
    }
  ];

  const revealVariants = {
    hidden: { y: prefersReducedMotion ? 0 : 25, opacity: 0 },
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
    <section id="blog" className="relative py-16 md:py-20 bg-bg-primary border-t border-border-dim">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ y: prefersReducedMotion ? 0 : 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2 inline-block">
            Writing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            Latest Articles & Notes
          </h2>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            visible: { transition: { staggerChildren: 0.08 } }
          }}
        >
          {articles.map((art, idx) => (
            <motion.div 
              key={idx}
              className="flex h-full"
              variants={revealVariants}
            >
              <Card 
                hoverable 
                onClick={() => window.open(art.link, '_blank')}
                className="w-full flex flex-col justify-between cursor-pointer p-6"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary mb-4 font-semibold uppercase tracking-wider">
                    <span className="px-2 py-0.5 rounded bg-bg-elevated border border-border-dim text-indigo-400">{art.tag}</span>
                    <span>{art.date}</span>
                    <span>·</span>
                    <span>{art.readTime}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-text-primary mb-2 leading-snug hover:text-indigo-400 transition-colors">
                    {art.title}
                  </h3>
                  
                  <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mb-6">
                    {art.excerpt}
                  </p>
                </div>

                <span className="text-xs sm:text-sm font-semibold text-indigo-400 inline-flex items-center gap-1">
                  Read Article →
                </span>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
