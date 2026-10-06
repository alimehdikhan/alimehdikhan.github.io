'use client';
import { MotionConfig } from 'motion/react';

export function MotionProvider({children}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
