'use client';

import { ArrowRight } from '@/components/ui/icons';

/* The project reel's rail, along the bottom of the pinned view: a line the
   lime fills as the reel moves, with a stop for each project, and the
   projects' names as buttons that scroll the reel to them (fx/ReelMotion.js
   does the filling and the scrolling). Shown only while the reel runs. */
export function ReelRail({ titles }) {
  const last = titles.length - 1;
  return (
    <div className="reel-rail">
      <div className="reel-line">
        <span className="reel-fill" aria-hidden="true" />
        {titles.map((t, i) => (
          <span key={t} className="reel-stop" aria-hidden="true" style={{ left: `${last ? (i / last) * 100 : 0}%` }} />
        ))}
        <p className="reel-hint" aria-hidden="true">
          Scroll for the next project
          <ArrowRight />
        </p>
      </div>
      <ol className="reel-labels" aria-label="Go to a project">
        {titles.map((t, i) => (
          <li key={t} style={{ left: `${last ? (i / last) * 100 : 0}%` }}>
            <button type="button" data-reel-go={i} aria-current={i === 0 ? 'true' : undefined} onClick={() => window.dispatchEvent(new CustomEvent('reel:go', { detail: i }))}>
              {t}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
