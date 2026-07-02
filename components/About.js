'use client';

import { Card } from './ui/Card';

export function About() {
  const stats = [
    { label: 'Certification', value: 'Google Cloud Certified' },
    { label: 'Experience', value: 'Machine Learning Internship' },
    { label: 'Leadership', value: '30+ Students Mentored' },
    { label: 'Education', value: 'B.Tech CSE (2026)' },
  ];

  return (
    <section id="about" className="ds-section" style={{ position: 'relative' }}>
      <div className="container reveal-on-scroll">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-eyebrow" style={{ color: '#a855f7', letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 600, display: 'inline-block', marginBottom: '0.75rem' }}>
            Background
          </span>
          <h2 className="ds-section-title text-gradient" style={{ marginBottom: '1rem' }}>
            Academic & Technical Overview
          </h2>
        </div>

        {/* Stats Grid */}
        <div 
          className="bento-grid reveal-on-scroll stagger-1" 
          style={{ marginBottom: '3rem' }}
        >
          {stats.map((stat, i) => (
            <Card 
              key={i} 
              hoverable 
              className="bento-span-4" 
              style={{ padding: '1.5rem', textAlign: 'center', gridColumn: 'span 3' }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
                {stat.label}
              </div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                {stat.value}
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div 
          className="bento-grid reveal-on-scroll stagger-2"
        >
          <div className="bento-span-8 bento-order-about">
            <Card style={{ height: '100%' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#6366f1' }}>
                Summary
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
                Currently completing a B.Tech in Computer Science and Engineering at Babu Banarasi Das University. Academic coursework and project experience are centered around software development, structured databases, and machine learning integration.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                Practical experience includes a formal Machine Learning Internship utilizing Keras and TensorFlow, alongside technical mentoring for junior developers focusing on Python and Git version control.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <Card hoverable style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.02)' }}>
                  <h4 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#6366f1' }}>▹</span> Software Development
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
                    Experience building RESTful APIs using Python and FastAPI. Familiar with OOP principles and SQL databases.
                  </p>
                </Card>
                <Card hoverable style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.02)' }}>
                  <h4 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#a855f7' }}>▹</span> Machine Learning
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
                    Implementation experience with classification models and NLP tools. Work involves data pre-processing and model validation.
                  </p>
                </Card>
              </div>
            </Card>
          </div>

          <div className="bento-span-4 bento-order-metrics">
            <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#a855f7' }}>Focus Areas</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span>Artificial Intelligence</span>
                    <span style={{ color: 'var(--text-tertiary)' }}>Focus Area</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px' }}>
                    <div style={{ width: '90%', height: '100%', background: '#a855f7', borderRadius: '2px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span>Backend APIs (FastAPI/Node)</span>
                    <span style={{ color: 'var(--text-tertiary)' }}>Focus Area</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px' }}>
                    <div style={{ width: '85%', height: '100%', background: '#6366f1', borderRadius: '2px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span>Python Development</span>
                    <span style={{ color: 'var(--text-tertiary)' }}>Core Lang</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px' }}>
                    <div style={{ width: '95%', height: '100%', background: '#34d399', borderRadius: '2px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span>Web Development</span>
                    <span style={{ color: 'var(--text-tertiary)' }}>Focus Area</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px' }}>
                    <div style={{ width: '80%', height: '100%', background: '#60a5fa', borderRadius: '2px' }} />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--card-border)', fontSize: '0.82rem', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
                Currently exploring: <strong>Agentic AI</strong>, <strong>Docker</strong>, and <strong>Distributed Architectures</strong>.
              </div>
            </Card>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .bento-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          :global(.bento-span-4) {
            grid-column: span 1 !important;
          }
          :global(.bento-span-8) {
            grid-column: span 2 !important;
          }
        }
        @media (max-width: 768px) {
          .bento-grid {
            display: flex !important;
            flex-direction: column !important;
          }
        }
      `}</style>
    </section>
  );
}
