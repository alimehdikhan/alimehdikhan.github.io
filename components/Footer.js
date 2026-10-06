'use client';

import { ArrowUp, Download, Mail } from 'lucide-react';
import { trackResumeDownload } from './fx/trackDownload';
import { scrollToHash } from './fx/scrollTo';
import { LocalClock } from './fx/LocalClock';
import { RESUME } from '../data/resume';

const LINK = 'inline-flex min-h-10 items-center gap-2 text-muted-foreground transition-colors hover:text-foreground';

export function Footer() {
  const toTop = (e) => {
    if (scrollToHash('#hero')) e.preventDefault();
  };

  return (
    <footer className="container-page pt-8 pb-12 text-[13px] md:pt-12">
      <div className="flex flex-col gap-6 border-t border-border-strong pt-6 md:flex-row md:items-center md:justify-between">
        <span className="text-muted-foreground">© 2026 Ali Mehdi Khan</span>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <a
            href={RESUME.resumePath}
            download={RESUME.resumeDownloadName}
            onClick={() => trackResumeDownload('footer')}
            aria-label="Download Resume"
            className={LINK}
          >
            <Download className="size-3.5" aria-hidden="true" />
            <span className="link-underline">Resume</span>
          </a>
          <a href={RESUME.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={LINK}>
            <img
              className="inv-dark"
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg"
              alt=""
              width="13"
              height="13"
              loading="lazy"
              aria-hidden="true"
            />
            <span className="link-underline">GitHub</span>
          </a>
          <a href={RESUME.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={LINK}>
            <img
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linkedin/linkedin-original.svg"
              alt=""
              width="13"
              height="13"
              loading="lazy"
              aria-hidden="true"
            />
            <span className="link-underline">LinkedIn</span>
          </a>
          <a href={`mailto:${RESUME.email}`} aria-label="Email" className={LINK}>
            <Mail className="size-3.5" aria-hidden="true" />
            <span className="link-underline">Email</span>
          </a>
          <a href="#hero" aria-label="Back to Top" onClick={toTop} className={LINK}>
            <span className="link-underline">Back to Top</span>
            <ArrowUp className="size-3.5" aria-hidden="true" />
          </a>
        </nav>

        <span className="text-muted-foreground tabular-nums">
          Lucknow · <LocalClock timeZone="Asia/Kolkata" />
        </span>
      </div>
    </footer>
  );
}
