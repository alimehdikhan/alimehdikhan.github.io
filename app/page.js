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

  // viewport IntersectionObserver reveals
  useEffect(() => {
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { 
        threshold: 0.08, 
        rootMargin: '0px 0px -40px 0px' 
      }
    );

    const elements = document.querySelectorAll(
      '.reveal-on-scroll, .reveal-on-scroll-left, .reveal-on-scroll-right, .skill-pill-anim'
    );
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [prefersReducedMotion]);

  return (
    <>
      {/* Scroll Progress Tracker */}
      {!prefersReducedMotion && (
        <motion.div 
          className="scroll-progress" 
          style={{ scaleX }} 
          aria-hidden="true"
        />
      )}

      {/* Navigation */}
      <Navbar />

      {/* Main Sections */}
      <main style={{ overflowX: 'hidden' }} className="page-load-wrapper">
        <Hero />
        
        <div className="reveal-on-scroll"><div className="section-divider" /></div>
        <About />
        
        <div className="reveal-on-scroll"><div className="section-divider" /></div>
        <Skills />
        
        <div className="reveal-on-scroll"><div className="section-divider" /></div>
        <Timeline />
        
        <div className="reveal-on-scroll"><div className="section-divider" /></div>
        <Projects />
        
        <div className="reveal-on-scroll"><div className="section-divider" /></div>
        <OpenSource />
        
        <div className="reveal-on-scroll"><div className="section-divider" /></div>
        <Blog />
        
        <div className="reveal-on-scroll"><div className="section-divider" /></div>
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
