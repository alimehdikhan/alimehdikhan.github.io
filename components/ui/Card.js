'use client';

import { useRef, useState, useEffect } from 'react';

export function Card({ children, className = '', hoverable = false, dynamicGlow = false, style = {}, ...props }) {
  const cardRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Monitor prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // For dynamic glow mask
    if (dynamicGlow) {
      setGlowPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }

    // For 3D Tilt
    if (hoverable && !prefersReducedMotion) {
      const width = rect.width;
      const height = rect.height;
      const xPct = (e.clientX - rect.left) / width - 0.5;
      const yPct = (e.clientY - rect.top) / height - 0.5;
      
      // Calculate rotation angles (max 5 degrees)
      const rX = -yPct * 6;
      const rY = xPct * 6;
      setRotation({ x: rX, y: rY });
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 });
  };

  const transformStyleStr = hoverable && !prefersReducedMotion 
    ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.025, 1.025, 1.025)` 
    : 'none';

  return (
    <div 
      ref={cardRef}
      className={`ds-card ${hoverable ? 'ds-card-hover' : ''} ${className}`} 
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1200px',
        transform: transformStyleStr,
        transition: isHovering ? 'transform 0.05s linear, border-color 0.2s ease, box-shadow 0.2s ease' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, box-shadow 0.2s ease',
        transformStyle: 'preserve-3d',
        ...style
      }}
      {...props}
    >
      {!dynamicGlow && hoverable && <div className="ds-card-glow"></div>}

      {dynamicGlow && (
        <div
          className="ds-card-dynamic-glow"
          style={{
            opacity: isHovering ? 1 : 0,
            background: `radial-gradient(600px circle at ${glowPos.x}px ${glowPos.y}px, rgba(255,255,255,0.06), transparent 40%)`
          }}
        ></div>
      )}

      {dynamicGlow && (
        <div
          className="ds-card-border-glow"
          style={{
            opacity: isHovering ? 1 : 0,
            background: `radial-gradient(400px circle at ${glowPos.x}px ${glowPos.y}px, rgba(255,255,255,0.3), transparent 40%)`
          }}
        ></div>
      )}

      <div className="ds-card-content" style={{ transform: hoverable && !prefersReducedMotion ? 'translateZ(20px)' : 'none', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </div>
  );
}
