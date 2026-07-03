'use client';

import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Skills } from '../components/Skills';
import { Timeline } from '../components/Timeline';
import { Projects } from '../components/Projects';
import { Certifications } from '../components/Certifications';
import { OpenSource } from '../components/OpenSource';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleMouseDown = () => {
      document.body.classList.add('using-mouse');
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        document.body.classList.remove('using-mouse');
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const pageReveal = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6 },
    },
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-bg-elevated focus:text-text-primary focus:border focus:border-border-dim focus:outline-none"
      >
        Skip to main content
      </a>

      {!prefersReducedMotion && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 origin-left z-50"
          style={{ scaleX }}
          aria-hidden="true"
        />
      )}

      <Navbar />

      <motion.main
        id="main-content"
        className="overflow-x-hidden bg-bg-primary text-text-primary font-sans"
        initial="hidden"
        animate="visible"
        variants={pageReveal}
      >
        <Hero />

        <div className="w-4/5 h-[1px] bg-gradient-to-r from-transparent via-border-dim to-transparent mx-auto" aria-hidden="true" />
        <About />

        <div className="w-4/5 h-[1px] bg-gradient-to-r from-transparent via-border-dim to-transparent mx-auto" aria-hidden="true" />
        <Skills />

        <div className="w-4/5 h-[1px] bg-gradient-to-r from-transparent via-border-dim to-transparent mx-auto" aria-hidden="true" />
        <Timeline />

        <div className="w-4/5 h-[1px] bg-gradient-to-r from-transparent via-border-dim to-transparent mx-auto" aria-hidden="true" />
        <Projects />

        <div className="w-4/5 h-[1px] bg-gradient-to-r from-transparent via-border-dim to-transparent mx-auto" aria-hidden="true" />
        <Certifications />

        <div className="w-4/5 h-[1px] bg-gradient-to-r from-transparent via-border-dim to-transparent mx-auto" aria-hidden="true" />
        <OpenSource />

        <div className="w-4/5 h-[1px] bg-gradient-to-r from-transparent via-border-dim to-transparent mx-auto" aria-hidden="true" />
        <Contact />
      </motion.main>

      <Footer />
    </>
  );
}