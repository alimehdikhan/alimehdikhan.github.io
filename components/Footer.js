'use client';

import { useEffect, useState } from 'react';
import { smoothScrollTo } from './Navbar';
import { trackResumeDownload } from './fx/trackDownload';
import { RESUME } from '../data/resume';

export function Footer() {
  const [clock, setClock] = useState('—');

  useEffect(() => {
    const tick = () => {
      setClock(
        new Date().toLocaleTimeString('en-GB', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    tick();
    const iv = setInterval(tick, 20000);
    return () => clearInterval(iv);
  }, []);

  const handleScrollToTop = (e) => {
    e.preventDefault();
    smoothScrollTo(0, 850);
  };

  return (
    <footer className="foot">
      <span>© 2026 Ali Mehdi Khan. Built with Next.js &amp; Framer Motion.</span>

      <div className="foot-links">
        <a
          href={RESUME.resumePath}
          download={RESUME.resumeDownloadName}
          onClick={() => trackResumeDownload('footer')}
          aria-label="Download Resume"
        >
          Resume
        </a>
        <a href={RESUME.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          GitHub
        </a>
        <a href={RESUME.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          LinkedIn
        </a>
        <a href={`mailto:${RESUME.email}`} aria-label="Email">
          Email
        </a>
        <a href="#hero" onClick={handleScrollToTop} className="up" aria-label="Scroll to top">
          Back to Top ↑
        </a>
      </div>

      <span suppressHydrationWarning>Lucknow · {clock}</span>
    </footer>
  );
}
