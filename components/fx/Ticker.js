'use client';
import { useEffect, useRef, useState } from 'react';
import { SkillLogo } from '../Skills';

export function Ticker({items}) {
  const track=useRef(null), root=useRef(null), pause=useRef(false);
  const [paused,setPaused]=useState(false);
  useEffect(()=>{
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    let frame=0,last=0,x=0,width=1,visible=false,velocity=0,lastScroll=scrollY,lastTime=performance.now();
    const measure=()=>{width=track.current.scrollWidth/2;};
    const render=time=>{
      frame=0;if(document.hidden||!visible||media.matches)return;
      const dt=Math.min(time-last||16,40);last=time;
      velocity*=Math.exp(-dt/220);
      if(!pause.current){x=(x-dt*.027*(1+Math.min(velocity/900,4)))%width;track.current.style.transform=`translate3d(${x}px,0,0)`;}
      frame=requestAnimationFrame(render);
    };
    const sync=()=>{cancelAnimationFrame(frame);frame=0;if(media.matches){track.current.style.transform='none';return;}if(!document.hidden&&visible){last=0;frame=requestAnimationFrame(render);}};
    const scroll=()=>{const now=performance.now();velocity=Math.abs(scrollY-lastScroll)/Math.max(now-lastTime,16)*1000;lastScroll=scrollY;lastTime=now;};
    const ro=new ResizeObserver(measure);ro.observe(track.current);measure();
    const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});io.observe(root.current);
    window.addEventListener('scroll',scroll,{passive:true});document.addEventListener('visibilitychange',sync);media.addEventListener('change',sync);
    return ()=>{cancelAnimationFrame(frame);ro.disconnect();io.disconnect();window.removeEventListener('scroll',scroll);document.removeEventListener('visibilitychange',sync);media.removeEventListener('change',sync);};
  },[]);
  const toggle=()=>{pause.current=!paused;setPaused(!paused);};
  return <div className="ticker bleed" ref={root} role="button" tabIndex={0}
    aria-label={`Tech stack marquee. ${paused?'Resume':'Pause'} animation`} aria-pressed={paused}
    onClick={toggle} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();toggle();}}}
    onPointerEnter={()=>{pause.current=true;}} onPointerLeave={()=>{pause.current=paused;}}
    onFocus={()=>{pause.current=true;}} onBlur={()=>{pause.current=paused;}}>
    <div className="track" ref={track} aria-hidden="true">{[...items,...items].map((item,i)=><span key={`${item}-${i}`}><SkillLogo name={item}/>{item}</span>)}</div>
  </div>;
}
