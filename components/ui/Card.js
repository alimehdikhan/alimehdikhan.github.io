'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

export function Card({ children, className = '', hoverable = false, dynamicGlow = false, style = {}, ...props }) {
  const cardRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig);

  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });

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
      mouseX.set(xPct);
      mouseY.set(yPct);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div 
      ref={cardRef}
      className={`relative overflow-hidden rounded-lg border border-border-dim/80 bg-bg-elevated/40 backdrop-blur-md transition-colors duration-300 ${hoverable ? 'hover:border-neutral-700/80' : ''} ${className}`} 
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      style={style}
      {...props}
    >
      {dynamicGlow && (
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            opacity: isHovering ? 1 : 0,
            background: `radial-gradient(400px circle at ${glowPos.x}px ${glowPos.y}px, rgba(99, 102, 241, 0.08), transparent 80%)`
          }}
        />
      )}

      {dynamicGlow && (
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            opacity: isHovering ? 1 : 0,
            background: `radial-gradient(250px circle at ${glowPos.x}px ${glowPos.y}px, rgba(255, 255, 255, 0.15), transparent 80%)`
          }}
        />
      )}

      <motion.div 
        className="relative z-10 h-full w-full" 
        style={{ 
          perspective: '1200px',
          rotateX: hoverable && !prefersReducedMotion ? rotateX : 0,
          rotateY: hoverable && !prefersReducedMotion ? rotateY : 0,
          transformStyle: 'preserve-3d',
          transform: hoverable && !prefersReducedMotion ? 'translateZ(15px)' : 'none'
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
