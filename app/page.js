'use client';

import { useState, useEffect } from 'react';
import { motion, useReducedMotion, useScroll } from 'framer-motion';
import { MagneticButton } from '../components/ui/MagneticButton';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
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
      if (current) setActiveSection(current);
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
        className="ds-nav hidden md:flex"
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
              <MagneticButton variant="secondary" as="a" href="https://github.com/alimehdikhan" target="_blank" aria-label="Visit GitHub Profile" rel="noopener noreferrer">
                GitHub Profile
              </MagneticButton>
              <MagneticButton variant="secondary" as="a" href="https://www.linkedin.com/in/ali-mehdi-khan-b4062b2a3/" target="_blank" aria-label="Visit LinkedIn Profile" rel="noopener noreferrer">
                LinkedIn Profile
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
              <p style={{ color: 'var(--text-secondary)' }}>Students Mentored in Python & Git</p>
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
            
            <div className="bento-span-12 ds-card-apple ds-card-hover" style={{ position: 'relative', minHeight: 'clamp(400px, 50vw, 600px)' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,112,243,0.3), rgba(121,40,202,0.3))', zIndex: 0 }}></div>
              <div className="ds-card-apple-content" style={{ zIndex: 1, position: 'relative' }}>
                <div>
                  <Badge style={{ marginBottom: '1rem' }}>Backend / Audio NLP</Badge>
                  <h3 className="ds-card-apple-title">AI Pronunciation Coach</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', maxWidth: '600px', lineHeight: 1.6 }}>
                    A real-time audio scoring API that evaluates speech pronunciation utilizing OpenAI's Whisper models and custom scoring algorithms via FastAPI.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <MagneticButton variant="primary" as="a" href="https://huggingface.co/spaces/Alimehdi973/ai-pronunciation-coach" target="_blank" rel="noopener noreferrer" aria-label="View AI Pronunciation Coach Live Demo">Live Demo</MagneticButton>
                  <MagneticButton variant="secondary" as="a" href="https://github.com/alimehdikhan/A.I-Pronunciation-Coach" target="_blank" rel="noopener noreferrer" aria-label="View AI Pronunciation Coach Source Code">Source Code</MagneticButton>
                </div>
              </div>
            </div>

            <div className="bento-span-6 ds-card-apple ds-card-hover" style={{ position: 'relative', minHeight: 'clamp(300px, 40vw, 400px)' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(80,227,194,0.2), rgba(0,0,0,0))', zIndex: 0 }}></div>
              <div className="ds-card-apple-content" style={{ zIndex: 1, position: 'relative' }}>
                <div>
                  <Badge style={{ marginBottom: '1rem' }}>Computer Vision</Badge>
                  <h3 className="ds-card-apple-title" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>Diagnostic Pipeline</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 1.2vw, 1.125rem)', lineHeight: 1.6 }}>
                    Binary classification model trained on medical datasets utilizing Keras architectures, yielding 90%+ validation accuracy.
                  </p>
                </div>
                <div style={{ marginTop: '2rem' }}>
                  <MagneticButton variant="secondary" as="a" href="https://github.com/alimehdikhan/Cancer-Detection-Model" target="_blank" rel="noopener noreferrer" aria-label="View Cancer Detection Model Source Code">View on GitHub</MagneticButton>
                </div>
              </div>
            </div>

            <div className="bento-span-6 ds-card-apple ds-card-hover" style={{ position: 'relative', minHeight: 'clamp(300px, 40vw, 400px)' }}>
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
            </div>

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
                Developed diagnostic classification models. Applied heavy data augmentation and hyperparameter tuning to ensure robust validation accuracy across batch-processed medical datasets.
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
                  <input type="text" id="name" name="name" required aria-required="true" style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', color: 'white', outline: 'none', transition: 'border-color 0.2s' }} />
                </div>
                <div>
                  <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Email</label>
                  <input type="email" id="email" name="email" required aria-required="true" style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', color: 'white', outline: 'none', transition: 'border-color 0.2s' }} />
                </div>
              </div>
              <div>
                <label htmlFor="message" style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Message</label>
                <textarea id="message" name="message" rows="5" required aria-required="true" style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', color: 'white', outline: 'none', resize: 'vertical', transition: 'border-color 0.2s' }}></textarea>
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
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="https://github.com/alimehdikhan" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} aria-label="GitHub">GitHub</a>
          <a href="https://www.linkedin.com/in/ali-mehdi-khan-b4062b2a3/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} aria-label="LinkedIn">LinkedIn</a>
        </div>
      </footer>
    </>
  );
}
