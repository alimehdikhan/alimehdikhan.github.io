'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

export function MagneticButton({ children, className = '', variant = 'primary', as = 'button', href, target, rel, download, onClick, disabled, style = {}, ...props }) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.15 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (prefersReducedMotion || disabled || !ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.2);
    y.set(middleY * 0.2);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const Component = as === 'a' ? motion.a : motion.button;

  const btnClasses = {
    primary: 'relative inline-flex items-center justify-center px-6 py-3 font-medium text-text-primary bg-indigo-600 rounded-lg hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 active:scale-98 transition-all',
    secondary: 'relative inline-flex items-center justify-center px-6 py-3 font-medium text-text-secondary bg-bg-elevated border border-border-dim rounded-lg hover:bg-card-hover hover:text-text-primary active:scale-98 transition-all',
  };

  return (
    <Component
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      href={href}
      target={target}
      rel={rel}
      download={download}
      disabled={disabled}
      style={{
        x: prefersReducedMotion ? 0 : springX,
        y: prefersReducedMotion ? 0 : springY,
        ...style
      }}
      className={`${btnClasses[variant] || btnClasses.primary} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
