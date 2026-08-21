'use client';

import { SectionHead } from './ui/SectionHead';
import { RESUME } from '../data/resume';

/* Official full-colour logos (devicon "original" set) for skills that have a
   real brand mark; the rest (soft skills, generic terms like SQL / REST APIs /
   NLP / Machine Learning) stay text-only. */
const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/';
const LOGOS = {
  Python: 'python/python-original.svg',
  Java: 'java/java-original.svg',
  C: 'c/c-original.svg',
  'C++': 'cplusplus/cplusplus-original.svg',
  JavaScript: 'javascript/javascript-original.svg',
  HTML: 'html5/html5-original.svg',
  CSS: 'css3/css3-original.svg',
  FastAPI: 'fastapi/fastapi-original.svg',
  Git: 'git/git-original.svg',
  GitHub: { path: 'github/github-original.svg', invDark: true },
  TensorFlow: 'tensorflow/tensorflow-original.svg',
  Keras: 'keras/keras-original.svg',
};

function SkillLogo({ name }) {
  const entry = LOGOS[name];
  if (!entry) return null;
  const path = typeof entry === 'string' ? entry : entry.path;
  const invDark = typeof entry === 'object' && entry.invDark;
  const hide = (e) => {
    e.currentTarget.parentElement.style.display = 'none';
  };
  return (
    <span className="skill-logo" aria-hidden="true">
      <img
        className={invDark ? 'inv-dark' : undefined}
        src={`${DEVICON}${path}`}
        alt=""
        loading="lazy"
        onError={hide}
      />
    </span>
  );
}

const categories = [
  {
    eyebrow: 'Write',
    title: 'Languages & Web',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    skills: ['Python', 'Java', 'C', 'C++', 'JavaScript', 'SQL', 'HTML', 'CSS'],
  },
  {
    eyebrow: 'Build',
    title: 'Backend & Tools',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
    skills: ['FastAPI', 'REST APIs', 'Git', 'GitHub'],
  },
  {
    eyebrow: 'Train',
    title: 'AI & Machine Learning',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    skills: ['Machine Learning', 'NLP', 'TensorFlow', 'Keras'],
  },
  {
    eyebrow: 'Work',
    title: 'Professional Soft Skills',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    skills: RESUME.skills.soft,
  },
];

export function Skills() {
  return (
    <section id="skills" className="sec" aria-labelledby="skills-title">
      <SectionHead title="Skills & Abilities" index="02" label="Technical Expertise" titleId="skills-title" />

      <div className="hair hair-2 hair-hover rev">
        {categories.map((cat, ci) => (
          <div key={cat.title} className="cat">
            <div className="cat-top">
              <span className="eyebrow">{cat.eyebrow}</span>
            </div>

            <div className="cat-id">
              <span className="cat-ic">{cat.icon}</span>
              <h3 className="p-title">{cat.title}</h3>
            </div>

            <div className="skill-grid">
              {cat.skills.map((skill, i) => (
                <span key={skill} style={{ '--i': ci * 2 + i }}>
                  <SkillLogo name={skill} />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
