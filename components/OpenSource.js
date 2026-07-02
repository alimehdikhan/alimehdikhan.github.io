'use client';

import { Card } from './ui/Card';

export function OpenSource() {
  const stats = [
    { name: 'Repositories', value: '10+' },
    { name: 'Primary Lang', value: 'Python' },
    { name: 'Focus Area', value: 'AI/ML' }
  ];

  return (
    <section id="opensource" className="ds-section">
      <div className="container reveal-on-scroll">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="section-eyebrow" style={{ color: '#34d399', letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 600, display: 'inline-block', marginBottom: '0.75rem' }}>
            Open Source
          </span>
          <h2 className="ds-section-title text-gradient" style={{ marginBottom: '1rem' }}>
            GitHub & Contributions
          </h2>
          <div className="title-underline" style={{ background: 'linear-gradient(90deg, #34d399, #6366f1)' }} />
        </div>

        <div className="bento-grid">
          {/* GitHub Details Card */}
          <div className="bento-span-6 reveal-on-scroll stagger-1">
            <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>
                @alimehdikhan
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Building open-source tools and contributing to the developer community. Focused on AI/ML applications, backend APIs, and developer tooling.
              </p>

              <div className="github-stats-container">
                {stats.map((s, idx) => (
                  <div key={idx} className="github-stat-box">
                    <span className="github-stat-value">{s.value}</span>
                    <span className="github-stat-name">{s.name}</span>
                  </div>
                ))}
              </div>

              <a 
                href="https://github.com/alimehdikhan" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="ds-btn ds-btn-primary" 
                style={{ width: 'fit-content', marginTop: '0.5rem' }}
                aria-label="View GitHub Profile"
              >
                View GitHub Profile
              </a>
            </Card>
          </div>

          {/* Interactive Terminal Card */}
          <div className="bento-span-6 reveal-on-scroll stagger-2">
            <Card style={{ padding: 0 }} className="terminal-block">
              <div className="terminal-bar">
                <div className="terminal-circles">
                  <span className="terminal-circle red" />
                  <span className="terminal-circle yellow" />
                  <span className="terminal-circle green" />
                </div>
                <span className="terminal-title-text">~/alimehdikhan</span>
              </div>
              <div className="terminal-contents">
                <div className="terminal-prompt-row">
                  <span className="terminal-prompt-symbol">$</span>
                  <span className="terminal-cmd-text">git log --oneline -5</span>
                </div>
                <div className="terminal-out-line">a3f8b21 feat: AI pronunciation coach API</div>
                <div className="terminal-out-line">7c2d1e4 feat: diagnostic vision pipeline</div>
                <div className="terminal-out-line">b9e4f67 docs: update portfolio site</div>
                <div className="terminal-out-line">1d5a892 fix: model inference pipeline</div>
                <div className="terminal-out-line">e8c3b11 chore: add Docker config</div>
                
                <div className="terminal-prompt-row" style={{ marginTop: '0.75rem' }}>
                  <span className="terminal-prompt-symbol">$</span>
                  <span className="terminal-cmd-text">cat skills.json | jq '.focus'</span>
                </div>
                <div className="terminal-out-line">"AI/ML, Backend APIs, Open Source"</div>

                <div className="terminal-prompt-row" style={{ marginTop: '0.75rem' }}>
                  <span className="terminal-prompt-symbol">$</span>
                  <span className="terminal-cmd-text">echo $STATUS</span>
                </div>
                <div className="terminal-out-line" style={{ color: '#34d399', fontWeight: 600 }}>✓ Available for opportunities</div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <style jsx>{`
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
