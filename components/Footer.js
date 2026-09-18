'use client';

import { trackResumeDownload } from './fx/trackDownload';
import { scrollToHash } from './fx/scrollTo';
import { LocalClock } from './fx/LocalClock';
import { RESUME } from '../data/resume';

export function Footer() {
  const toTop = (e) => {
    if (scrollToHash('#hero')) e.preventDefault();
  };

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
          <img
            className="brand-logo sm inv-dark"
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg"
            alt=""
            width="13"
            height="13"
            loading="lazy"
            aria-hidden="true"
          />
          GitHub
        </a>
        <a href={RESUME.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <img
            className="brand-logo sm"
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linkedin/linkedin-original.svg"
            alt=""
            width="13"
            height="13"
            loading="lazy"
            aria-hidden="true"
          />
          LinkedIn
        </a>
        <a href={`mailto:${RESUME.email}`} aria-label="Email">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Email
        </a>
        <a href="#hero" className="up" aria-label="Back to Top" onClick={toTop}>
          Back to Top <span className="arr">↑</span>
        </a>
      </div>

      <span>
        Lucknow · <LocalClock timeZone="Asia/Kolkata" />
      </span>
    </footer>
  );
}
