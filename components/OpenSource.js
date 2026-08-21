'use client';

import { SectionHead } from './ui/SectionHead';
import { MagneticButton } from './ui/MagneticButton';
import { RESUME } from '../data/resume';

const stats = [
  { name: 'Repositories', value: `${RESUME.githubStats.publicRepos}` },
  { name: 'Primary Lang', value: RESUME.githubStats.primaryLang },
  { name: 'Focus Area', value: RESUME.githubStats.focusArea },
];

export function OpenSource() {
  return (
    <section id="opensource" className="sec" aria-labelledby="opensource-title">
      <SectionHead title="GitHub & Contributions" index="06" label="Open Source" titleId="opensource-title" />

      <div className="hair hair-split rev">
        <div>
          <span className="eyebrow">@alimehdikhan</span>
          <p className="p-body" style={{ marginTop: 16 }}>
            A dozen public repos, mostly Python — the pronunciation coach, the cancer-detection model, and whatever pipeline experiment is currently mid-commit.
          </p>

          <div className="hair hair-3 stats" style={{ margin: '26px 0 30px', border: '1px solid var(--line)' }}>
            {stats.map((s) => (
              <div key={s.name} style={{ padding: '20px 16px' }}>
                <div className="n n-text">{s.value}</div>
                <div className="l">{s.name}</div>
              </div>
            ))}
          </div>

          <MagneticButton
            variant="primary"
            as="a"
            href={RESUME.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View GitHub Profile"
          >
            View GitHub Profile
          </MagneticButton>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="term" style={{ width: '100%' }}>
            <div className="term-bar">
              <span className="dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="name">A.I-Pronunciation-Coach</span>
            </div>
            <div className="term-body">
              <div className="term-cmd">
                <i aria-hidden="true">$</i>
                <span>git log --oneline -5</span>
              </div>
              <div className="term-out">
                {RESUME.githubCommits.map((commit) => (
                  <div key={commit.sha}>
                    <span className="sha">{commit.sha}</span> {commit.message}
                  </div>
                ))}
              </div>

              <div className="term-cmd">
                <i aria-hidden="true">$</i>
                <span>echo $STATUS</span>
              </div>
              <div className="term-ok">
                Available for entry-level Software Engineering and AI/ML roles
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
