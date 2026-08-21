'use client';

import { useEffect, useState } from 'react';
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

  return (
    <footer className="foot">
      <span>© 2026 Ali Mehdi Khan</span>

      <div className="foot-links">
        <a
          href={RESUME.resumePath}
          download={RESUME.resumeDownloadName}
          onClick={() => trackResumeDownload('footer')}
          aria-label="Download Resume"
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14" />
          </svg>
          Resume
        </a>
        <a href={RESUME.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
          </svg>
          GitHub
        </a>
        <a href={RESUME.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
          </svg>
          LinkedIn
        </a>
        <a href={`mailto:${RESUME.email}`} aria-label="Email">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Email
        </a>
        <a href="#hero" className="up" aria-label="Scroll to top">
          Back to Top ↑
        </a>
      </div>

      <span suppressHydrationWarning>Lucknow · {clock}</span>
    </footer>
  );
}
