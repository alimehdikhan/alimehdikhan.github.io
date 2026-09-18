'use client';
import { useEffect } from 'react';
import { setSmoothScroller } from './scrollTo';

export function ScrollMotion() {
  useEffect(() => {
    // Touch already has native inertial scrolling. Keep its heading wipes
    // lightweight instead of downloading a desktop scrolling controller.
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const motion=matchMedia('(prefers-reduced-motion: reduce)');
      const animations=[];
      const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        observer.unobserve(entry.target);
        animations.push(entry.target.animate(motion.matches ? [{opacity:.65},{opacity:1}] : [{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0)'}],{duration:motion.matches?180:500,easing:'cubic-bezier(.2,0,0,1)'}));
      }),{rootMargin:`0px 0px -${Math.round(innerHeight*.15)}px 0px`});
      document.querySelectorAll('.head h2').forEach(el=>observer.observe(el));
      return ()=>{observer.disconnect();animations.forEach(animation=>animation.cancel());};
    }
    let disposed=false,mm;
    Promise.all([import('gsap'),import('gsap/ScrollTrigger'),import('lenis')]).then(([{gsap},{ScrollTrigger},{default:Lenis}])=>{
      if(disposed)return;
      gsap.registerPlugin(ScrollTrigger);
      mm=gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)',()=>{
        const lenis=new Lenis({lerp:.12,smoothWheel:true,syncTouch:false});
        setSmoothScroller(lenis);
        lenis.on('scroll',ScrollTrigger.update);
        const tick=time=>{if(!document.hidden)lenis.raf(time*1000);};
        gsap.ticker.add(tick);
        const visibility=()=>{if(document.hidden)gsap.ticker.remove(tick);else gsap.ticker.add(tick);};
        document.addEventListener('visibilitychange',visibility);
        document.querySelectorAll('.head h2').forEach(title=>{
          ScrollTrigger.create({trigger:title,start:'top 85%',once:true,onEnter:()=>{
            gsap.fromTo(title,{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.5,ease:'power3.out',clearProps:'clipPath'});
          }});
        });
        const cleanup=[];
        document.querySelectorAll('.hero-socials .tile').forEach(el=>{
          let rect;
          const x=gsap.quickTo(el,'x',{duration:.22,ease:'power2.out'});
          const y=gsap.quickTo(el,'y',{duration:.22,ease:'power2.out'});
          const enter=()=>{rect=el.getBoundingClientRect();};
          const move=e=>{if(e.pointerType!=='mouse')return;rect ||= el.getBoundingClientRect();x(gsap.utils.clamp(-8,8,(e.clientX-rect.left-rect.width/2)*.22));y(gsap.utils.clamp(-8,8,(e.clientY-rect.top-rect.height/2)*.22));};
          const leave=()=>{x(0);y(0);rect=null;};
          el.addEventListener('pointerenter',enter);el.addEventListener('pointermove',move);el.addEventListener('pointerleave',leave);el.addEventListener('blur',leave);
          cleanup.push(()=>{el.removeEventListener('pointerenter',enter);el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);el.removeEventListener('blur',leave);gsap.set(el,{clearProps:'transform'});});
        });
        ScrollTrigger.refresh();
        return ()=>{cleanup.forEach(fn=>fn());document.removeEventListener('visibilitychange',visibility);gsap.ticker.remove(tick);setSmoothScroller(null);lenis.destroy();};
      });
    }).catch(()=>{/* Native scrolling and static headings remain usable. */});
    return ()=>{disposed=true;mm?.revert();};
  },[]);
  return null;
}
