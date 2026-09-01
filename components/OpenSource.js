'use client';

import { motion } from 'framer-motion';
import { SectionHead } from './ui/SectionHead';
import { MagneticButton } from './ui/MagneticButton';
import { Reveal } from './fx/Reveal';
import { ITEM, STAGGER } from './fx/motion';
import { RESUME } from '../data/resume';

const stats = [
  { name: 'Repositories', value: `${RESUME.githubStats.publicRepos}` },
  { name: 'Primary Lang', value: RESUME.githubStats.primaryLang },
  { name: 'Focus Area', value: RESUME.githubStats.focusArea },
];

const GAP_16 = { marginTop: 16 };
const STATS_STYLE = { margin: '26px 0 30px', border: '1px solid var(--line)' };
const CELL_STYLE = { padding: '20px 16px' };
const TERM_COL = { display: 'flex', alignItems: 'center' };
const TERM_STYLE = { width: '100%' };

export function OpenSource() {
  return (
    <section id="opensource" className="sec" aria-labelledby="opensource-title">
      <SectionHead title="GitHub & Contributions" index="06" label="Open Source" titleId="opensource-title" />

      <div className="hair hair-split">
        <Reveal as="div" stagger={STAGGER.item}>
          <span className="eyebrow">@alimehdikhan</span>
          <p className="p-body" style={GAP_16}>
            A dozen public repos, mostly Python — the pronunciation coach, the cancer-detection model, and whatever pipeline experiment is currently mid-commit.
          </p>

          <div className="hair hair-3 stats" style={STATS_STYLE}>
            {stats.map((s) => (
              <motion.div key={s.name} className="rev-i" variants={ITEM} style={CELL_STYLE}>
                <div className="n n-text">{s.value}</div>
                <div className="l">{s.name}</div>
              </motion.div>
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
        </Reveal>

        {/* the terminal prints line by line, like a real git log */}
        <Reveal as="div" stagger={0.05} style={TERM_COL}>
          <div className="term" style={TERM_STYLE}>
            <div className="term-bar">
              <span className="dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="name">A.I-Pronunciation-Coach</span>
            </div>
            <div className="term-body">
              <motion.div className="term-cmd rev-i" variants={ITEM}>
                <i aria-hidden="true">$</i>
                <span>git log --oneline -5</span>
              </motion.div>
              <div className="term-out">
                {RESUME.githubCommits.map((commit) => (
                  <motion.div key={commit.sha} className="rev-i" variants={ITEM}>
                    <span className="sha">{commit.sha}</span> {commit.message}
                  </motion.div>
                ))}
              </div>

              <motion.div className="term-cmd rev-i" variants={ITEM}>
                <i aria-hidden="true">$</i>
                <span>echo $STATUS</span>
              </motion.div>
              <motion.div className="term-ok rev-i" variants={ITEM}>
                Available for entry-level Software Engineering and AI/ML roles
              </motion.div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
