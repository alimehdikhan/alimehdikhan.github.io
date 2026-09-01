'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { SectionHead } from './ui/SectionHead';
import { Reveal } from './fx/Reveal';
import { EASE, ITEM, MAG, STAGGER } from './fx/motion';
import { ContactForm } from './ContactForm';
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

/* inline style literals hoisted so a re-render never hands motion a new object */
const LEAD_STYLE = { maxWidth: '46ch' };
const PILL_WRAP_STYLE = { marginTop: 40 };
const SPLIT_STYLE = { marginTop: 'clamp(44px, 6vw, 70px)' };
/* .eyebrow is an inline span; the ITEM rise needs a box to translate */
const EYEBROW_STYLE = { display: 'inline-block' };
const COLUMN_STYLE = { display: 'flex', flexDirection: 'column' };
const DETAILS_STYLE = { marginTop: 24 };
const SOCIALS_STYLE = { marginTop: 'auto', paddingTop: 42 };

/* headline line mask: the hero's 105% rise, one line at a time */
const LINE = {
  hidden: { y: '105%' },
  visible: { y: 0, transition: { duration: 0.9, ease: EASE } },
};

/* the CSS `.tile:hover` lift, restated for motion: motion owns the tile's
   inline transform once it has animated, so the stylesheet lift cannot win */
const TILE_HOVER = { y: -2, transition: { duration: 0.35, ease: EASE } };

/* the pill pulls a touch harder than the hero buttons; one multiplier, both axes */
const PILL_PULL = MAG.strength * 1.3;

export function Contact() {
  const prefersReducedMotion = useReducedMotion();
  const fine = useRef(false);
  const rect = useRef(null);
  const magX = useMotionValue(0);
  const magY = useMotionValue(0);
  const magSpringX = useSpring(magX, MAG.spring);
  const magSpringY = useSpring(magY, MAG.spring);

  /* magnetic email pill: mouse on a fine pointer only, so a tap on a touch or
     hybrid device never parks the pill off-centre */
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => {
      fine.current = mq.matches;
    };
    sync();
    if (mq.addEventListener) mq.addEventListener('change', sync);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', sync);
    };
  }, []);

  const magnetActive = (e) => e.pointerType === 'mouse' && fine.current && !prefersReducedMotion;

  /* cache the untransformed box on enter (minus whatever the spring still
     carries on a quick re-entry) so the pull is measured from a fixed frame
     instead of chasing the element as it moves */
  const onMagnetEnter = (e) => {
    if (!magnetActive(e)) return;
    const r = e.currentTarget.getBoundingClientRect();
    rect.current = {
      left: r.left - magSpringX.get(),
      top: r.top - magSpringY.get(),
      width: r.width,
      height: r.height,
    };
  };
  const onMagnetMove = (e) => {
    if (!magnetActive(e)) return;
    if (!rect.current) onMagnetEnter(e);
    const r = rect.current;
    magX.set((e.clientX - r.left - r.width / 2) * PILL_PULL);
    magY.set((e.clientY - r.top - r.height / 2) * PILL_PULL);
  };
  const onMagnetLeave = () => {
    rect.current = null;
    magX.set(0);
    magY.set(0);
  };

  return (
    <section id="contact" className="sec" aria-labelledby="contact-title">
      <SectionHead title="Contact Me" index="07" label="Get In Touch" titleId="contact-title" />

      <Reveal stagger={STAGGER.item}>
        <motion.span className="hero-badge eyebrow rev-i" variants={ITEM}>
          <span className="dot" />
          Available for Entry-Level Roles
        </motion.span>

        <p className="big">
          <span className="line">
            <motion.i className="rev-i" variants={LINE}>
              Let&apos;s build something
            </motion.i>
          </span>
          <span className="line">
            <motion.i className="rev-i" variants={LINE}>
              <em>great</em> together.
            </motion.i>
          </span>
        </p>

        <motion.p className="p-body rev-i" style={LEAD_STYLE} variants={ITEM}>
          Open to Software Engineering and AI/ML roles, internships, and interesting Python or ML collaborations. Email is the fastest way to reach me — I actually read it.
        </motion.p>

        <motion.div className="rev-i" style={PILL_WRAP_STYLE} variants={ITEM}>
          <motion.span
            className="magnet"
            style={{ x: magSpringX, y: magSpringY }}
            onPointerEnter={onMagnetEnter}
            onPointerMove={onMagnetMove}
            onPointerLeave={onMagnetLeave}
            onPointerCancel={onMagnetLeave}
          >
            <a className="mail" href={`mailto:${RESUME.email}`}>
              {RESUME.email}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 19L19 5M19 5H9M19 5v10" />
              </svg>
            </a>
          </motion.span>
        </motion.div>
      </Reveal>

      {/* each column observes on its own, so on a phone the details column
          rises when it is actually scrolled to rather than with the form */}
      <div className="hair hair-split" style={SPLIT_STYLE}>
        <Reveal as="div" stagger={STAGGER.item}>
          <motion.span className="eyebrow rev-i" style={EYEBROW_STYLE} variants={ITEM}>
            Send a message
          </motion.span>
          <motion.p className="form-note rev-i" id="form-note" variants={ITEM}>
            All fields are required.
          </motion.p>
          <ContactForm />
        </Reveal>

        <Reveal as="div" stagger={STAGGER.item} style={COLUMN_STYLE}>
          <motion.span className="eyebrow rev-i" style={EYEBROW_STYLE} variants={ITEM}>
            Details
          </motion.span>
          <div className="detail-list" style={DETAILS_STYLE}>
            {contactDetails.map((item) => (
              <motion.a
                key={item.title}
                href={item.href}
                className="detail rev-i"
                variants={ITEM}
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
              </motion.a>
            ))}
          </div>

          <div className="hero-socials" style={SOCIALS_STYLE}>
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="tile rev-i"
                variants={ITEM}
                whileHover={TILE_HOVER}
                aria-label={social.label}
              >
                <img
                  className={`brand-logo${social.invDark ? ' inv-dark' : ''}`}
                  src={social.img}
                  alt=""
                  width="17"
                  height="17"
                  loading="lazy"
                  aria-hidden="true"
                />
              </motion.a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
