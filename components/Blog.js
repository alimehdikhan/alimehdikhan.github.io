'use client';

import { Card } from './ui/Card';

export function Blog() {
  const articles = [
    {
      title: 'Building a Pronunciation Coach with OpenAI Whisper',
      excerpt: 'How I built an audio scoring API that evaluates speech pronunciation using FastAPI and OpenAI\'s Whisper model for real-time feedback.',
      date: 'Jun 2025',
      readTime: '5 min read',
      tag: 'AI / ML',
      link: '#'
    },
    {
      title: 'Medical Image Classification with CNNs: Lessons Learned',
      excerpt: 'Key insights from building a diagnostic vision pipeline that achieved 90%+ accuracy on medical imaging datasets using TensorFlow.',
      date: 'May 2025',
      readTime: '7 min read',
      tag: 'Deep Learning',
      link: '#'
    },
    {
      title: 'FastAPI Best Practices for Production APIs',
      excerpt: 'A practical guide to structuring FastAPI projects for production, covering dependency injection, validation, and performance optimization.',
      date: 'Apr 2025',
      readTime: '4 min read',
      tag: 'Backend',
      link: '#'
    }
  ];

  return (
    <section id="blog" className="ds-section">
      <div className="container reveal-on-scroll">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-eyebrow" style={{ color: '#6366f1', letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 600, display: 'inline-block', marginBottom: '0.75rem' }}>
            Writing
          </span>
          <h2 className="ds-section-title text-gradient" style={{ marginBottom: '1rem' }}>
            Latest Articles & Notes
          </h2>
          <div className="title-underline" style={{ background: 'linear-gradient(90deg, #6366f1, #a855f7)' }} />
        </div>

        <div className="blog-cards-grid">
          {articles.map((art, idx) => (
            <div 
              key={idx} 
              className={`reveal-on-scroll stagger-${idx + 1}`}
            >
              <Card 
                hoverable 
                onClick={() => window.open(art.link, '_blank')}
                style={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
              >
                <div className="blog-tag-meta">
                  <span className="blog-badge-tag">{art.tag}</span>
                  <span>{art.date}</span>
                  <span>·</span>
                  <span>{art.readTime}</span>
                </div>
                
                <h3 className="project-title" style={{ fontSize: '1.15rem', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                  {art.title}
                </h3>
                
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                  {art.excerpt}
                </p>

                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#6366f1', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  Read Article →
                </span>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
