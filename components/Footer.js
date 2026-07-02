'use client';

export function Footer() {
  const handleScrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer style={{ borderTop: '1px solid var(--card-border)', padding: '3rem 0', background: 'rgba(0,0,0,0.3)', position: 'relative', zIndex: 10 }}>
      <div className="container footer-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
            © 2026 Ali Mehdi Khan. Built with ❤️ using Next.js & Framer Motion.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <a href="https://github.com/alimehdikhan" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }} className="footer-link" aria-label="GitHub">
            GitHub
          </a>
          <a href="https://linkedin.com/in/ali-mehdi-khan-b4062b2a3" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }} className="footer-link" aria-label="LinkedIn">
            LinkedIn
          </a>
          <a href="mailto:ali973mehdi@gmail.com" style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }} className="footer-link" aria-label="Email">
            Email
          </a>
          <a href="#hero" onClick={handleScrollToTop} style={{ color: '#6366f1', fontSize: '0.85rem', fontWeight: 600 }} aria-label="Scroll to top">
            Back to Top ↑
          </a>
        </div>
      </div>

      <style jsx>{`
        .footer-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
        }
        .footer-link {
          transition: color var(--transition-fast);
        }
        .footer-link:hover {
          color: var(--text-primary) !important;
        }
        @media (max-width: 640px) {
          .footer-flex {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
