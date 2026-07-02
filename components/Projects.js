'use client';

import { Card } from './ui/Card';

export function Projects() {
  const projects = [
    {
      title: 'AI Pronunciation Coach API',
      tag: 'Backend / NLP',
      overview: 'Audio scoring API evaluating speech pronunciation.',
      features: 'Streams audio to OpenAI Whisper models for processing.',
      outcome: 'Evaluates speech segments with low-latency response times.',
      tech: ['FastAPI', 'Python', 'OpenAI Whisper'],
      github: 'https://github.com/alimehdikhan/A.I-Pronunciation-Coach',
      demo: 'https://huggingface.co/spaces/Alimehdi973/ai-pronunciation-coach',
      gradient: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)' // purple to blue
    },
    {
      title: 'Diagnostic Vision Pipeline',
      tag: 'Computer Vision',
      overview: 'Convolutional Neural Network for medical image classification.',
      features: 'Custom architecture for processing and augmenting medical datasets.',
      outcome: 'Reached 90%+ validation accuracy on diagnostic datasets.',
      tech: ['TensorFlow', 'Keras', 'Pandas'],
      github: 'https://github.com/alimehdikhan/Cancer-Detection-Model',
      demo: null,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' // emerald
    },
    {
      title: 'Agentic Task Scheduler',
      tag: 'AI Agents',
      overview: 'Self-correcting AI agent system scheduling background operations.',
      features: 'Uses LangGraph & Gemini models to generate plans and execute jobs.',
      outcome: 'Fully automated pipeline requiring zero manual intervention.',
      tech: ['Next.js', 'LangGraph', 'Python', 'Gemini API'],
      github: 'https://github.com/alimehdikhan',
      demo: null,
      gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' // amber
    }
  ];

  return (
    <section id="projects" className="ds-section">
      <div className="container reveal-on-scroll">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-eyebrow" style={{ color: '#a855f7', letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 600, display: 'inline-block', marginBottom: '0.75rem' }}>
            Portfolio
          </span>
          <h2 className="ds-section-title text-gradient" style={{ marginBottom: '1rem' }}>
            Featured Projects
          </h2>
          <div className="title-underline" style={{ background: 'linear-gradient(90deg, #a855f7, #6366f1)' }} />
        </div>

        <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>
          {projects.map((proj, i) => (
            <div 
              key={i}
              className={`bento-span-4 reveal-on-scroll stagger-${i + 1}`}
              style={{ gridColumn: 'span 4' }}
            >
              <Card 
                hoverable 
                dynamicGlow
                style={{ padding: 0, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}
              >
                {/* Project Header Gradient Graphic wrapped for hover-zoom */}
                <div style={{ overflow: 'hidden', height: '140px', position: 'relative' }} className="project-image-wrapper">
                  <div 
                    className="project-card-image"
                    style={{
                      background: proj.gradient,
                      height: '100%',
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#ffffff',
                      padding: '1rem',
                      textAlign: 'center',
                      position: 'relative',
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)' }} />
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', opacity: 0.85, zIndex: 1 }}>{proj.tag}</span>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '0.25rem', zIndex: 1, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{proj.title}</h4>
                  </div>
                </div>

                {/* Project Details */}
                <div className="project-card-body" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span className="project-tag">{proj.tag}</span>
                  <h3 className="project-title" style={{ fontSize: '1.2rem', fontWeight: 700 }}>{proj.title}</h3>
                  
                  <div className="project-breakdown">
                    <div className="project-breakdown-row">
                      <strong>Overview</strong>
                      <span>{proj.overview}</span>
                    </div>
                    <div className="project-breakdown-row">
                      <strong>Key Features</strong>
                      <span>{proj.features}</span>
                    </div>
                    <div className="project-breakdown-row">
                      <strong>Results</strong>
                      <span style={{ color: '#10b981', fontWeight: 500 }}>{proj.outcome}</span>
                    </div>
                  </div>

                  <div className="project-tech-tags">
                    {proj.tech.map((t, idx) => (
                      <span key={idx}>{t}</span>
                    ))}
                  </div>

                  <div className="project-links-row" style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--card-border)' }}>
                    <a href={proj.github} target="_blank" rel="noopener noreferrer" className="project-link-btn" aria-label={`View code for ${proj.title} on GitHub`}>
                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>
                      Code
                    </a>
                    {proj.demo && (
                      <a href={proj.demo} target="_blank" rel="noopener noreferrer" className="project-link-btn" aria-label={`View live demo of ${proj.title}`}>
                        Live Demo →
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          ))}
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
