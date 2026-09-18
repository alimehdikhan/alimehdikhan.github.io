'use client';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { createShader } from './webgl';

const fragment = `precision mediump float;
uniform vec2 resolution; uniform float clock;
void main(){
 vec2 uv=gl_FragCoord.xy/resolution;
 float wave=sin(uv.x*5.+sin(uv.y*4.+clock*.17)+clock*.1)*.5+.5;
 vec3 amber=vec3(.38,.19,.025); vec3 violet=vec3(.15,.07,.29);
 float edge=sin(uv.x*3.14159)*sin(uv.y*3.14159);
 gl_FragColor=vec4(mix(amber,violet,wave),edge*.34);
}`;

export default function HeroShader() {
  const ref=useRef(null);
  const target = typeof document !== 'undefined' && document.querySelector('.hero-name');
  useEffect(()=>{
    const canvas=ref.current;
    if(!canvas) return;
    const renderer=createShader(canvas,fragment);
    if(!renderer) return;
    const {gl}=renderer;
    const resolution=renderer.uniform('resolution'),clock=renderer.uniform('clock');
    let frame=0,visible=true,last=0,elapsed=0;
    const resize=()=>{const box=canvas.parentElement.getBoundingClientRect();const dpr=Math.min(devicePixelRatio||1,2)*.5;canvas.width=Math.round(box.width*dpr);canvas.height=Math.round(box.height*dpr);gl.viewport(0,0,canvas.width,canvas.height);};
    const render=time=>{frame=0;if(document.hidden||!visible)return;if(time-last>32){elapsed+=Math.min(time-last,50);last=time;gl.uniform2f(resolution,canvas.width,canvas.height);gl.uniform1f(clock,elapsed*.001);renderer.draw();}frame=requestAnimationFrame(render);};
    const sync=()=>{cancelAnimationFrame(frame);frame=0;if(!document.hidden&&visible){last=performance.now();frame=requestAnimationFrame(render);}};
    const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});io.observe(canvas);
    const ro=new ResizeObserver(resize);ro.observe(canvas.parentElement);resize();sync();
    const lost=e=>{e.preventDefault();visible=false;sync();};
    canvas.addEventListener('webglcontextlost',lost);
    document.addEventListener('visibilitychange',sync);
    return ()=>{cancelAnimationFrame(frame);io.disconnect();ro.disconnect();document.removeEventListener('visibilitychange',sync);canvas.removeEventListener('webglcontextlost',lost);renderer.dispose();};
  },[]);
  return target ? createPortal(<canvas className="hero-shader" ref={ref} aria-hidden="true"/>,target) : null;
}
