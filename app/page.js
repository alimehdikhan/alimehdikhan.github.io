'use client';

import { useState, useEffect } from 'react';
import { motion, useReducedMotion, useScroll } from 'framer-motion';
import { MagneticButton } from '../components/ui/MagneticButton';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Section } from '../components/ui/Section';
import { Section } from '../components/ui/Section';

export default function Home() {
  const [activeSection, setActiveSection] = useState('hero');
  const [contactStatus, setContactStatus] = useState(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      let current = '';
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 300;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });
      if (current) {
        setActiveSection((prev) => prev !== current ? current : prev);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const smoothScroll = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 100,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus('sending');
    try {
      const response = await fetch('https://formspree.io/f/xjgzwweq', {
        method: 'POST',
        body: new FormData(e.target),
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        setContactStatus('success');
        e.target.reset();
        setTimeout(() => setContactStatus(null), 4500);
      } else {
        setContactStatus('error');
        setTimeout(() => setContactStatus(null), 4500);
      }
    } catch (error) {
      setContactStatus('error');
      setTimeout(() => setContactStatus(null), 4500);
    }
  };

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />
      
      {/* Ambient Lighting Orbs */}
      <div className="ambient-orb orb-primary"></div>
      <div className="ambient-orb orb-secondary"></div>

      {/* LINEAR STYLE NAV */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="ds-nav"
        aria-label="Main Navigation"
      >
        <a href="#hero" onClick={(e) => smoothScroll(e, '#hero')} style={{ fontWeight: 700, marginRight: '1rem', color: '#fff' }} aria-label="Go to top">
          Ali.Codes
        </a>
        {['about', 'projects', 'experience', 'contact'].map((item) => (
          <a
            key={item}
            href={`#${item}`}
            onClick={(e) => smoothScroll(e, `#${item}`)}
            className={`ds-nav-link ${activeSection === item ? 'active' : ''}`}
            style={{ textTransform: 'capitalize' }}
            aria-label={`Scroll to ${item}`}
          >
            {item}
          </a>
        ))}
        <MagneticButton variant="primary" as="a" href="/assets/resume/AliMehdiKhan%20Resume%20Optimized.pdf" target="_blank" download style={{ marginLeft: '1rem' }} aria-label="Download Resume">
          Resume
        </MagneticButton>
      </motion.nav>

      <main>
        {/* HERO (VERCEL STYLE) */}
        <Section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Badge style={{ marginBottom: '1.5rem' }}>Software Engineer · AI/ML Specialist</Badge>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 800, letterSpacing: '-0.06em', lineHeight: 1.05, marginBottom: '1.5rem' }} 
              className="text-gradient-animated"
            >
              Building Agentic Intelligence
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{ fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '3rem', maxWidth: '600px', margin: '0 auto', letterSpacing: '-0.01em' }}
            >
              I'm Ali Mehdi Khan. I engineer scalable backends, deploy machine learning models, and build premium full-stack architectures.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <MagneticButton variant="primary" onClick={(e) => smoothScroll(e, '#projects')} aria-label="View Projects">
                View Projects
              </MagneticButton>
              <MagneticButton variant="secondary" as="a" href="https://github.com/alimehdikhan" target="_blank" aria-label="Visit GitHub Profile" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" role="img" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>
                <span className="btn-text">GitHub Profile</span>
              </MagneticButton>
              <MagneticButton variant="secondary" as="a" href="https://www.linkedin.com/in/ali-mehdi-khan-b4062b2a3/" target="_blank" aria-label="Visit LinkedIn Profile" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" role="img" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
                <span className="btn-text">LinkedIn Profile</span>
              </MagneticButton>
            </motion.div>
          </div>
        </Section>

        {/* ABOUT & SKILLS (BENTO GRID) */}
        <Section id="about" title="Background">
          <div className="bento-grid">
            <Card dynamicGlow hoverable className="bento-span-8" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', fontWeight: 600, marginBottom: '1rem', letterSpacing: '-0.02em' }}>About Me</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 'clamp(1rem, 1.5vw, 1.125rem)' }}>
                Computer Science undergraduate at Babu Banarasi Das University. My focus lies at the intersection of complex data structures and artificial intelligence. I don't just write scripts; I architect complete systems that leverage machine learning to solve real-world problems.
              </p>
            </Card>

            <Card dynamicGlow hoverable className="bento-span-4" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <h3 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.05em' }}>30+</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.875rem, 1vw, 1rem)', lineHeight: 1.5 }}>
                Elevated digital literacy for underprivileged students, guiding 30+ participants to successfully build their first functional applications by delivering a comprehensive 3-month programming training curriculum.
              </p>
            </Card>

            <Card dynamicGlow hoverable className="bento-span-6">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Core Technologies</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {['Python', 'FastAPI', 'Next.js', 'React', 'SQL', 'Git'].map(skill => <Badge key={skill}>{skill}</Badge>)}
              </div>
            </Card>

            <Card dynamicGlow hoverable className="bento-span-6">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>AI & Machine Learning</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {['TensorFlow', 'Keras', 'OpenAI Whisper', 'NLP', 'Computer Vision'].map(skill => <Badge key={skill}>{skill}</Badge>)}
              </div>
            </Card>
          </div>
        </Section>

        {/* PROJECTS (APPLE STYLE) */}
        <Section id="projects" title="Featured Work">
          <div className="bento-grid">
            
            <article className="bento-span-12 ds-card-apple ds-card-hover" style={{ position: 'relative', minHeight: 'clamp(400px, 50vw, 600px)' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,112,243,0.3), rgba(121,40,202,0.3))', zIndex: 0 }}></div>
              <div className="ds-card-apple-content" style={{ zIndex: 1, position: 'relative' }}>
                <div>
                  <Badge style={{ marginBottom: '1rem' }}>Backend / Audio NLP</Badge>
                  <h3 className="ds-card-apple-title">AI Pronunciation Coach</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', maxWidth: '600px', lineHeight: 1.6 }}>
                    Engineered an AI-driven coaching platform enabling real-time spoken English feedback by integrating OpenAI Whisper, NLP processing, and low-latency FastAPI scoring pipelines.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <MagneticButton variant="primary" as="a" href="https://huggingface.co/spaces/Alimehdi973/ai-pronunciation-coach" target="_blank" rel="noopener noreferrer" aria-label="View AI Pronunciation Coach Live Demo">Live Demo</MagneticButton>
                  <MagneticButton variant="secondary" as="a" href="https://github.com/alimehdikhan/A.I-Pronunciation-Coach" target="_blank" rel="noopener noreferrer" aria-label="View AI Pronunciation Coach Source Code">Source Code</MagneticButton>
                </div>
              </div>
            </article>

            <article className="bento-span-6 ds-card-apple ds-card-hover" style={{ position: 'relative', minHeight: 'clamp(300px, 40vw, 400px)' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(80,227,194,0.2), rgba(0,0,0,0))', zIndex: 0 }}></div>
              <div className="ds-card-apple-content" style={{ zIndex: 1, position: 'relative' }}>
                <div>
                  <Badge style={{ marginBottom: '1rem' }}>Computer Vision</Badge>
                  <h3 className="ds-card-apple-title" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>Diagnostic Pipeline</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 1.2vw, 1.125rem)', lineHeight: 1.6 }}>
                    Built a binary classification system for early-stage cancer prediction, achieving over 90% accuracy by training custom Keras deep learning architectures on real-world medical datasets.
                  </p>
                </div>
                <div style={{ marginTop: '2rem' }}>
                  <MagneticButton variant="secondary" as="a" href="https://github.com/alimehdikhan/Cancer-Detection-Model" target="_blank" rel="noopener noreferrer" aria-label="View Cancer Detection Model Source Code">View on GitHub</MagneticButton>
                </div>
              </div>
            </article>

            <article className="bento-span-6 ds-card-apple ds-card-hover" style={{ position: 'relative', minHeight: 'clamp(300px, 40vw, 400px)' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(0,0,0,0))', zIndex: 0 }}></div>
              <div className="ds-card-apple-content" style={{ zIndex: 1, position: 'relative' }}>
                <div>
                  <Badge style={{ marginBottom: '1rem' }}>System Architecture</Badge>
                  <h3 className="ds-card-apple-title" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>Portfolio Rebuild</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 1.2vw, 1.125rem)', lineHeight: 1.6 }}>
                    Next.js App Router migration implementing advanced JSON-LD structured data and a fully responsive Bento design system.
                  </p>
                </div>
              </div>
            </article>

          </div>
        </Section>

        {/* EXPERIENCE & CERTIFICATIONS (BENTO GRID) */}
        <Section id="experience" title="Experience & Credentials">
          <div className="bento-grid">
            
            <Card dynamicGlow hoverable className="bento-span-6">
              <Badge style={{ marginBottom: '0.5rem' }}>Internship</Badge>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0.5rem 0' }}>Machine Learning Intern</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>BBD University · Jun 2025 – Jul 2025</p>
              <p style={{ color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
                Developed predictive models for skin cancer and diabetes, maximizing diagnostic accuracy by implementing supervised deep learning algorithms, rigorous feature engineering, and hyperparameter tuning in Python.
              </p>
            </Card>

            <Card dynamicGlow hoverable className="bento-span-6">
              <Badge style={{ marginBottom: '0.5rem' }}>Leadership</Badge>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0.5rem 0' }}>Technical Mentor</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Tech For Good · Jun 2024 – Sep 2024</p>
              <p style={{ color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
                Guided and managed 30+ students through a 12-week programming bootcamp. Spearheaded code reviews focusing on OOP principles, API development, and Git version control.
              </p>
            </Card>

            {/* Certifications row */}
            <Card hoverable className="bento-span-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.5rem' }}>Google Cloud Certified</h4>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Build Real World AI Applications</p>
                </div>
                <a href="https://www.credly.com/badges/38ba1161-84d4-4975-8972-b633b389f8cd" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 500, marginTop: '1rem', textDecoration: 'underline' }} aria-label="Verify Google Cloud Certification">Verify Credential →</a>
              </div>
            </Card>

            <Card hoverable className="bento-span-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.5rem' }}>Vertex AI Prompt Design</h4>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Google Cloud</p>
                </div>
                <a href="https://www.credly.com/badges/7b347535-2bb6-419f-b130-1019f9a9ed38" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 500, marginTop: '1rem', textDecoration: 'underline' }} aria-label="Verify Vertex AI Certification">Verify Credential →</a>
              </div>
            </Card>

            <Card hoverable className="bento-span-4" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.5rem' }}>Machine Learning Python</h4>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>freeCodeCamp</p>
                </div>
                <a href="https://freecodecamp.org/certification/AliMehdiKhan/machine-learning-with-python-v7" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 500, marginTop: '1rem', textDecoration: 'underline' }} aria-label="Verify Machine Learning Certification">Verify Credential →</a>
              </div>
            </Card>

          </div>
        </Section>

        {/* CONTACT */}
        <Section id="contact" title="Get in touch" style={{ paddingBottom: '10rem' }}>
          <Card dynamicGlow hoverable style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)', fontWeight: 600, marginBottom: '0.5rem' }}>Let's build something.</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Reach out for full-time opportunities or ML consultations.</p>
            </div>
            
            <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} aria-label="Contact Form">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <label htmlFor="name" style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Name</label>
                  <input type="text" id="name" name="name" autoComplete="name" required aria-required="true" style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', color: 'white', outline: 'none', transition: 'border-color 0.2s' }} />
                </div>
                <div>
                  <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Email</label>
                  <input type="email" id="email" name="email" autoComplete="email" required aria-required="true" style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', color: 'white', outline: 'none', transition: 'border-color 0.2s' }} />
                </div>
              </div>
              <div>
                <label htmlFor="message" style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Message</label>
                <textarea id="message" name="message" autoComplete="off" rows="5" required aria-required="true" style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', color: 'white', outline: 'none', resize: 'vertical', transition: 'border-color 0.2s' }}></textarea>
              </div>
              <MagneticButton type="submit" variant="primary" style={{ width: '100%', marginTop: '1rem' }} disabled={contactStatus === 'sending'} aria-label="Submit Contact Form">
                {contactStatus === 'sending' ? 'Transmitting...' : contactStatus === 'success' ? 'Message Sent!' : 'Send Message'}
              </MagneticButton>
            </form>
          </Card>
        </Section>
      </main>

      <footer style={{ borderTop: '1px solid var(--shadow-border)', padding: '3rem 0', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.875rem', background: 'rgba(0,0,0,0.8)' }}>
        <p>© 2026 Ali Mehdi Khan. Architected with Next.js & Framer Motion.</p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <a href="https://github.com/alimehdikhan" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.375rem' }} aria-label="GitHub">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" role="img" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/ali-mehdi-khan-b4062b2a3/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.375rem' }} aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" role="img" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
            LinkedIn
          </a>
        </div>
      </footer>
    </>
  );
}
