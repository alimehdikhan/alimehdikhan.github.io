'use client';

import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Skills } from '../components/Skills';
import { Timeline } from '../components/Timeline';
import { Projects } from '../components/Projects';
import { OpenSource } from '../components/OpenSource';
import { Blog } from '../components/Blog';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Track accessibility focus classes for keyboard vs mouse users
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
      transition: { duration: 0.6 }
    }
  };

  return (
    <>
      {/* Scroll Progress Tracker */}
      {!prefersReducedMotion && (
        <motion.div 
          className="fixed top-0 left-0 right-0 h-1 bg-indigo-600 origin-left z-50" 
          style={{ scaleX }} 
          aria-hidden="true"
        />
      )}

      {/* Navigation */}
      <Navbar />

      {/* Main Sections */}
      <motion.main 
        className="overflow-x-hidden bg-[#0A0A0A] min-h-screen text-white font-sans"
        initial="hidden"
        animate="visible"
        variants={pageReveal}
      >
        <Hero />
        
        <div className="w-4/5 h-[1px] bg-gradient-to-r from-transparent via-neutral-800 to-transparent mx-auto" />
        <About />
        
        <div className="w-4/5 h-[1px] bg-gradient-to-r from-transparent via-neutral-800 to-transparent mx-auto" />
        <Skills />
        
        <div className="w-4/5 h-[1px] bg-gradient-to-r from-transparent via-neutral-800 to-transparent mx-auto" />
        <Timeline />
        
        <div className="w-4/5 h-[1px] bg-gradient-to-r from-transparent via-neutral-800 to-transparent mx-auto" />
        <Projects />
        
        <div className="w-4/5 h-[1px] bg-gradient-to-r from-transparent via-neutral-800 to-transparent mx-auto" />
        <OpenSource />
        
        <div className="w-4/5 h-[1px] bg-gradient-to-r from-transparent via-neutral-800 to-transparent mx-auto" />
        <Blog />
        
        <div className="w-4/5 h-[1px] bg-gradient-to-r from-transparent via-neutral-800 to-transparent mx-auto" />
        <Contact />
      </motion.main>

      {/* Footer */}
      <Footer />
    </>
  );
}
