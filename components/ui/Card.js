'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

export function Card({ children, className = '', hoverable = false, dynamicGlow = false, style = {}, ...props }) {
  const cardRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for 3D rotation
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
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
      className={`ds-card ${hoverable ? 'ds-card-hover' : ''} ${className}`} 
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        perspective: '1200px',
        rotateX: hoverable && !prefersReducedMotion ? rotateX : 0,
        rotateY: hoverable && !prefersReducedMotion ? rotateY : 0,
        transformStyle: 'preserve-3d',
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

      <div className="ds-card-content" style={{ transform: hoverable && !prefersReducedMotion ? 'translateZ(20px)' : 'none' }}>
        {children}
      </div>
    </motion.div>
  );
}
