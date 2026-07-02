'use client';

import { useRef, useState, useEffect } from 'react';

export function MagneticButton({ children, className = '', variant = 'primary', as = 'button', href, target, rel, download, onClick, disabled, style = {}, ...props }) {
  const ref = useRef(null);
  const [transform, setTransform] = useState('translate3d(0, 0, 0)');
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleMouseMove = (e) => {
    if (prefersReducedMotion || disabled || !ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    // Limit displacement to 10px max for subtlety
    const displaceX = Math.max(-10, Math.min(10, middleX * 0.15));
    const displaceY = Math.max(-10, Math.min(10, middleY * 0.15));
    
    setTransform(`translate3d(${displaceX}px, ${displaceY}px, 0)`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform('translate3d(0, 0, 0)');
  };

  const Component = as;
  const transformStyle = prefersReducedMotion ? 'none' : transform;

  return (
    <Component
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      href={href}
      target={target}
      rel={rel}
      download={download}
      disabled={disabled}
      style={{
        transform: transformStyle,
        transition: isHovered ? 'transform 0.08s linear, background-color 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease',
        willChange: 'transform',
        ...style
      }}
      className={`ds-btn ds-btn-${variant} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
