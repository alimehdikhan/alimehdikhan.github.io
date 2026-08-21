'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { SectionHead } from './ui/SectionHead';
import { RESUME } from '../data/resume';

const contactDetails = [
  {
    title: 'Email',
    value: RESUME.email,
    href: `mailto:${RESUME.email}`,
    icon: (
      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Phone',
    value: RESUME.phone,
    href: `tel:${RESUME.phone.replace(/[^+\d]/g, '')}`,
    icon: (
      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    title: 'Location',
    value: RESUME.location,
    href: 'https://www.google.com/maps/search/?api=1&query=Lucknow,+Uttar+Pradesh,+India',
    external: true,
    icon: (
      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const socialLinks = [
  { href: RESUME.github, label: 'GitHub', icon: 'M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z' },
  { href: RESUME.linkedin, label: 'LinkedIn', icon: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z' },
];

export function Contact() {
  const prefersReducedMotion = useReducedMotion();
  const magRef = useRef(null);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState(null); // 'sending', 'success', 'error'

  /* magnetic email pill */
  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (coarse || prefersReducedMotion) return undefined;
    const m = magRef.current;
    if (!m) return undefined;

    const onMove = (e) => {
      const r = m.getBoundingClientRect();
      m.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.28}px, ${
        (e.clientY - r.top - r.height / 2) * 0.4
      }px)`;
    };
    const onLeave = () => {
      m.style.transform = '';
    };
    m.addEventListener('pointermove', onMove);
    m.addEventListener('pointerleave', onLeave);
    return () => {
      m.removeEventListener('pointermove', onMove);
      m.removeEventListener('pointerleave', onLeave);
    };
  }, [prefersReducedMotion]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('https://formspree.io/f/xjgzwweq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formState),
      });

      if (response.ok) {
        setStatus('success');
        setFormState({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus(null), 5000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="sec" aria-labelledby="contact-title">
      <SectionHead title="Contact Me" index="07" label="Get In Touch" titleId="contact-title" />

      <div className="rev">
        <span className="hero-badge eyebrow">
          <span className="dot" />
          Available for Entry-Level Roles
        </span>

        <p className="big">
          Let&apos;s build something <em>great</em> together.
        </p>

        <p className="p-body" style={{ maxWidth: '46ch' }}>
          Open to entry-level Software Engineering and AI/ML opportunities, internships, and collaborations on Python and machine learning projects.
        </p>

        <div style={{ marginTop: 40 }}>
          <span className="magnet" ref={magRef}>
            <a className="mail" href={`mailto:${RESUME.email}`}>
              {RESUME.email}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 19L19 5M19 5H9M19 5v10" />
              </svg>
            </a>
          </span>
        </div>
      </div>

      <div className="hair hair-split rev" style={{ marginTop: 'clamp(44px, 6vw, 70px)' }}>
        <div>
          <span className="eyebrow">Send a message</span>
          <form onSubmit={handleSubmit} className="form" style={{ marginTop: 24 }} aria-label="Contact Form">
            <div className="form-row">
              <div className="field">
                <label htmlFor="name">
                  <i aria-hidden="true">01</i>Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formState.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="field">
                <label htmlFor="email">
                  <i aria-hidden="true">02</i>Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formState.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="subject">
                <i aria-hidden="true">03</i>Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                value={formState.subject}
                onChange={handleInputChange}
              />
            </div>

            <div className="field">
              <label htmlFor="message">
                <i aria-hidden="true">04</i>Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows="5"
                value={formState.message}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <button type="submit" className="btn btn-solid" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : status === 'success' ? 'Transmitted Successfully' : 'Send Message'}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M5 19L19 5M19 5H9M19 5v10" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="eyebrow">Details</span>
          <div className="detail-list" style={{ marginTop: 24 }}>
            {contactDetails.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="detail"
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
              >
                <span className="ic">{item.icon}</span>
                <span className="kv">
                  <span className="k">{item.title}</span>
                  <span className="v">{item.value}</span>
                </span>
                <span className="go" aria-hidden="true">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </a>
            ))}
          </div>

          <div className="hero-socials" style={{ marginTop: 'auto', paddingTop: 42 }}>
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="tile"
                aria-label={social.label}
              >
                <svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d={social.icon} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {(status === 'success' || status === 'error') && (
          <motion.div
            className={`toast${status === 'error' ? ' err' : ''}`}
            role="status"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          >
            <div>
              <div className="t">{status === 'success' ? 'Message Transmitted' : 'Submission Failed'}</div>
              <div className="d">
                {status === 'success'
                  ? 'I have received your email and will respond shortly.'
                  : 'A network error occurred. Please try again.'}
              </div>
            </div>
            <button onClick={() => setStatus(null)} aria-label="Dismiss Alert">
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
