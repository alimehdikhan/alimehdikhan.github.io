'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { MAG } from '../fx/motion';

const btnClasses = {
  primary: 'btn btn-solid',
  secondary: 'btn',
};

/* Magnetic button/anchor: springs toward a mouse pointer and settles back on
   leave, with a small press squash. Shares the MAG token with the contact
   pill so both magnets feel alike. Only the mouse pulls (a tap on a touch
   screen used to leave it stranded off-centre), the untransformed rect is
   cached on enter so the pull is exactly the configured fraction, and there
   is no hover state to re-render on. */
export function MagneticButton({
  children,
  className = '',
  variant = 'primary',
  as = 'button',
  href,
  target,
  rel,
  download,
  onClick,
  disabled,
  style = {},
  ...props
}) {
  const ref = useRef(null);
  const rect = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, MAG.spring);
  const springY = useSpring(y, MAG.spring);

  const reset = () => {
    rect.current = null;
    x.set(0);
    y.set(0);
  };
  const onPointerEnter = (e) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    rect.current = ref.current.getBoundingClientRect();
  };
  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse' || prefersReducedMotion || disabled) return;
    const r = rect.current || (rect.current = e.currentTarget.getBoundingClientRect());
    x.set(Math.max(-8, Math.min(8, (e.clientX - (r.left + r.width / 2)) * MAG.strength)));
    y.set(Math.max(-8, Math.min(8, (e.clientY - (r.top + r.height / 2)) * MAG.strength)));
  };
  const handleClick = (e) => {
    reset();
    if (onClick) onClick(e);
  };

  const Component = as === 'a' ? motion.a : motion.button;

  return (
    <Component
      ref={ref}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      onClick={handleClick}
      href={href}
      target={target}
      rel={rel}
      download={download}
      disabled={disabled}
      /* not gated on reduced motion: useReducedMotion is null on the server and
         true on the client under reduce, and whileTap adds tabindex — so gating
         it would mismatch hydration. MotionConfig makes the squash instant. */
      whileTap={disabled ? undefined : { scale: 0.97 }}
      style={{
        x: prefersReducedMotion ? 0 : springX,
        y: prefersReducedMotion ? 0 : springY,
        ...style,
      }}
      className={`${btnClasses[variant] || btnClasses.primary} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
