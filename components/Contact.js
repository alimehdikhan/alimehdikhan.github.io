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
  { href: RESUME.github, label: 'GitHub', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg', invDark: true },
  { href: RESUME.linkedin, label: 'LinkedIn', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linkedin/linkedin-original.svg' },
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
          Open to Software Engineering and AI/ML roles, internships, and interesting Python or ML collaborations. Email is the fastest way to reach me — I actually read it.
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
                {status === 'sending' ? 'Sending…' : status === 'success' ? 'Sent — thanks!' : 'Send Message'}
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
                <img
                  className={`brand-logo${social.invDark ? ' inv-dark' : ''}`}
                  src={social.img}
                  alt=""
                  loading="lazy"
                  aria-hidden="true"
                />
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
              <div className="t">{status === 'success' ? 'Message sent' : 'That didn’t go through'}</div>
              <div className="d">
                {status === 'success'
                  ? 'It’s in my inbox — I’ll get back to you soon.'
                  : 'Something went wrong sending that. Mind trying again?'}
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
