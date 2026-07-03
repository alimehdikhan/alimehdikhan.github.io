'use client';

import { smoothScrollTo } from './Navbar';

export function Footer() {
  const handleScrollToTop = (e) => {
    e.preventDefault();
    smoothScrollTo(0, 850);
  };

  return (
    <footer className="relative py-12 bg-bg-primary border-t border-border-dim z-10">
      <div className="container mx-auto px-6 max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <p className="text-xs sm:text-sm text-neutral-500">
            © 2026 Ali Mehdi Khan. Built with ❤️ using Next.js & Framer Motion.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm">
          <a href="https://github.com/alimehdikhan" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-text-primary transition-colors" aria-label="GitHub">
            GitHub
          </a>
          <a href="https://linkedin.com/in/ali-mehdi-khan-b4062b2a3" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-text-primary transition-colors" aria-label="LinkedIn">
            LinkedIn
          </a>
          <a href="mailto:ali973mehdi@gmail.com" className="text-neutral-500 hover:text-text-primary transition-colors" aria-label="Email">
            Email
          </a>
          <a href="#hero" onClick={handleScrollToTop} className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors" aria-label="Scroll to top">
            Back to Top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
