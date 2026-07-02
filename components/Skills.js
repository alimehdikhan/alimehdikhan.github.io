'use client';

import { Card } from './ui/Card';

export function Skills() {
  const categories = [
    {
      title: 'Languages',
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      skills: ['JavaScript', 'Python', 'HTML', 'CSS', 'SQL', 'Java'],
      color: '#6366f1' // purple-ish
    },
    {
      title: 'Backend / APIs',
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      ),
      skills: ['FastAPI', 'Node.js', 'REST APIs', 'Flask'],
      color: '#34d399' // green
    },
    {
      title: 'AI / ML',
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      skills: ['Machine Learning', 'Data Analysis', 'NLP', 'Model Integration', 'TensorFlow', 'Keras'],
      color: '#a855f7' // dark purple
    },
    {
      title: 'Tools',
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      skills: ['Git', 'GitHub', 'Docker', 'Linux'],
      color: '#60a5fa' // blue
    }
  ];

  return (
    <section id="skills" className="ds-section">
      <div className="container reveal-on-scroll">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-eyebrow" style={{ color: '#6366f1', letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 600, display: 'inline-block', marginBottom: '0.75rem' }}>
            Technical Expertise
          </span>
          <h2 className="ds-section-title text-gradient" style={{ marginBottom: '1rem' }}>
            Skills & Abilities
          </h2>
          <div className="title-underline" style={{ background: 'linear-gradient(90deg, #6366f1, #34d399)' }} />
        </div>

        <div className="bento-grid">
          {categories.map((cat, i) => (
            <div 
              key={i} 
              className={`bento-span-6 reveal-on-scroll stagger-${(i % 2) + 1}`}
            >
              <Card style={{ height: '100%' }}>
                <div className="skills-category-wrapper">
                  <h3 className="skills-category-title" style={{ color: cat.color }}>
                    {cat.icon}
                    {cat.title}
                  </h3>
                  
                  <div className="skills-pills">
                    {cat.skills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className={`skill-pill skill-pill-anim stagger-${idx + 1}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
