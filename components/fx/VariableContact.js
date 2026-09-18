'use client';
import { useEffect, useRef } from 'react';

const words = text => text.split(' ').map((word,i)=><span className="weight-word" key={`${word}-${i}`}>{[...word].map((char,j)=><span className="weight-letter" key={j}>{char}</span>)}{' '}</span>);

export function VariableContact() {
  const ref=useRef(null);
  useEffect(()=>{
    const el=ref.current,media=matchMedia('(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)');
    const letters=[...el.querySelectorAll('.weight-letter')];
    let frame=0,centers=[];
    const reset=()=>{cancelAnimationFrame(frame);letters.forEach(letter=>letter.style.removeProperty('--weight'));};
    const enter=()=>{centers=letters.map(letter=>{const r=letter.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};});};
    const move=e=>{
      if(!media.matches||e.pointerType!=='mouse')return;
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{letters.forEach((letter,i)=>{const c=centers[i];if(!c)return;const distance=Math.hypot(e.clientX-c.x,e.clientY-c.y);letter.style.setProperty('--weight',Math.round(500+300*Math.max(0,1-distance/180)));});});
    };
    el.addEventListener('pointerenter',enter);el.addEventListener('pointermove',move);el.addEventListener('pointerleave',reset);media.addEventListener('change',reset);
    const visibility=()=>{if(document.hidden)reset();};document.addEventListener('visibilitychange',visibility);
    return ()=>{reset();el.removeEventListener('pointerenter',enter);el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',reset);media.removeEventListener('change',reset);document.removeEventListener('visibilitychange',visibility);};
  },[]);
  return <p ref={ref} className="big contact-weight"><span className="sr-only">Let&apos;s build something great together.</span><span aria-hidden="true"><span className="line">{words("Let's build something")}</span><span className="line"><em>{words('great')}</em>{words('together.')}</span></span></p>;
}
