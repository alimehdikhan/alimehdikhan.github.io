'use client';

import { motion } from 'framer-motion';

export function Section({ id, title, children, className = '', style = {} }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', damping: 20, stiffness: 100 }
    }
  };

  return (
    <section id={id} className={`ds-section ${className}`} style={style}>
      <motion.div 
        className="container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {title && (
          <motion.h2 variants={itemVariants} className="ds-section-title text-gradient">
            {title}
          </motion.h2>
        )}
        <motion.div variants={itemVariants}>
          {children}
        </motion.div>
      </motion.div>
    </section>
  );
}
