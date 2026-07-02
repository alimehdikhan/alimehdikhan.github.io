'use client';

import { useEffect, useRef, useState } from 'react';
import { Card } from './ui/Card';

export function Timeline() {
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const [lineWidth, setLineWidth] = useState(0);

  const experiences = [
    {
      role: 'Machine Learning Intern',
      company: 'BBD University · Lucknow',
      date: 'Jun 2025 – Jul 2025',
      side: 'left-side',
      details: [
        'Developed diagnostic classification models for early-stage disease prediction using Keras.',
        'Applied data augmentation and hyperparameter tuning to improve validation accuracy.',
        'Tested inference scripts for batch processing of medical datasets.'
      ]
    },
    {
      role: 'Technical Mentor',
      company: 'Tech For Good Initiative',
      date: 'Jun 2024 – Sep 2024',
      side: 'right-side',
      details: [
        'Mentored 30+ students in programming fundamentals over a 12-week structured program.',
        'Covered Python scripting, OOP principles, and Git version control.',
        'Reviewed code and guided teams in deploying functional web applications.'
      ]
    }
  ];

  // Scroll drawing effect
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !lineRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate scroll progress percentage through the timeline container
      const startTrigger = viewportHeight * 0.8;
      const endTrigger = viewportHeight * 0.3;
      
      const containerHeight = rect.height;
      const scrolledIntoContainer = startTrigger - rect.top;
      
      const progress = Math.min(
        Math.max(scrolledIntoContainer / (containerHeight - endTrigger + startTrigger), 0),
        1
      );
      
      lineRef.current.style.height = `${progress * 100}%`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on load
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="experience" className="ds-section" ref={containerRef}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-eyebrow" style={{ color: '#6366f1', letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 600, display: 'inline-block', marginBottom: '0.75rem' }}>
            Work History
          </span>
          <h2 className="ds-section-title text-gradient" style={{ marginBottom: '1rem' }}>
            Experience
          </h2>
          <div className="title-underline" style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7)' }} />
        </div>

        <div className="timeline-relative" style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Vertical scroll-drawn line */}
          <div className="timeline-vertical-line">
            <div 
              className="timeline-vertical-line-inner"
              ref={lineRef}
              style={{ height: '0%' }}
            />
          </div>

          <div
            style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
          >
            {experiences.map((exp, idx) => {
              const isRight = exp.side === 'right-side';
              const directionClass = isRight ? 'reveal-on-scroll-right' : 'reveal-on-scroll-left';

              return (
                <div
                  key={idx}
                  className={`timeline-item-wrapper ${exp.side} ${directionClass} stagger-${idx + 1}`}
                >
                  {/* Pulsing marker dot */}
                  <div className="timeline-marker-dot active" />
                  
                  <div className="timeline-content-card">
                    <Card hoverable style={{ padding: '1.75rem' }}>
                      <span className="timeline-date-label">{exp.date}</span>
                      <h3 className="timeline-job-title">{exp.role}</h3>
                      <div className="timeline-company-label">{exp.company}</div>
                      
                      <ul className="timeline-desc-list">
                        {exp.details.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
