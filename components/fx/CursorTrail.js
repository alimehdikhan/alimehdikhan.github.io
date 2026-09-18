'use client';
import { useEffect, useRef } from 'react';
import { createFluidTrail } from './fluidTrail';

export default function CursorTrail() {
  const gpuRef=useRef(null),fallbackRef=useRef(null);
  useEffect(()=>{
    const canvas=gpuRef.current,fallback=fallbackRef.current;
    let renderer=createFluidTrail(canvas),ctx,frame=0,last=0,moved=-10000,slow=0;
    let width=innerWidth,height=innerHeight,x=.5,y=.5,px=.5,py=.5,travel=0;
    const points=[];
    const useFallback=()=>{renderer?.dispose();renderer=null;canvas.style.display='none';fallback.style.display='block';ctx=fallback.getContext('2d');};
    if(!renderer)useFallback();
    const resize=()=>{
      width=innerWidth;height=innerHeight;
      try{renderer?.resize(width,height);}catch{useFallback();}
      const dpr=Math.min(devicePixelRatio||1,2);
      fallback.width=Math.round(width*dpr);fallback.height=Math.round(height*dpr);
      ctx?.setTransform(dpr,0,0,dpr,0,0);
    };
    const colors=[[.96,.55,.1],[.06,.79,.67],[.52,.27,.94]];
    const tint=()=>{const phase=(travel/650)%3;const a=colors[Math.floor(phase)],b=colors[(Math.floor(phase)+1)%3];return a.map((c,i)=>c+(b[i]-c)*(phase%1));};
    const drawFallback=time=>{
      ctx.clearRect(0,0,width,height);ctx.globalCompositeOperation='lighter';
      while(points.length&&time-points[0].time>1100)points.shift();
      if(points.length<3)return;
      for(let layer=3;layer>=0;layer--){
        ctx.lineCap='round';ctx.lineJoin='round';
        for(let i=1;i<points.length-1;i++){
          const a=points[i-1],b=points[i],c=points[i+1],age=(time-b.time)/1100;
          const wave=Math.sin(age*9+i*.23)*age*16;
          ctx.beginPath();ctx.moveTo((a.x+b.x)/2,(a.y+b.y)/2+wave);
          ctx.quadraticCurveTo(b.x,b.y+wave,(b.x+c.x)/2,(b.y+c.y)/2+wave);
          ctx.strokeStyle=`rgba(${b.color.map(n=>Math.round(n*255)).join(',')},${Math.max(0,(1-age)*(.11-layer*.02))})`;
          ctx.lineWidth=(3+layer*8)*(1-age);ctx.stroke();
        }
      }
    };
    const render=time=>{
      frame=0;if(document.hidden)return;
      const elapsed=time-last||16;
      if(last&&elapsed>40&&time-moved<300)slow++;else slow=Math.max(0,slow-1);
      if(renderer&&slow>50)useFallback();
      last=time;
      const dx=x-px,dy=y-py;
      const ink=Math.min(1,Math.hypot(dx*width,dy*height)/12);
      if(renderer)renderer.render({x,y,px,py,dx,dy,ink,dt:Math.min(elapsed/16.67,2),tint:tint(),aspect:width/height});
      else if(ctx)drawFallback(time);
      px=x;py=y;
      if(time-moved<2400)frame=requestAnimationFrame(render);
      else { renderer?.clear(); ctx?.clearRect(0,0,width,height); }
    };
    const move=e=>{
      if(e.pointerType!=='mouse'||document.hidden)return;
      const now=performance.now();const nx=e.clientX/width,ny=1-e.clientY/height;
      if(now-moved>200){px=nx;py=ny;}
      travel+=Math.min(100,Math.hypot((nx-x)*width,(ny-y)*height));x=nx;y=ny;moved=now;
      points.push({x:e.clientX,y:e.clientY,time:now,color:tint()});if(points.length>100)points.shift();
      if(!frame){last=0;frame=requestAnimationFrame(render);}
    };
    const visibility=()=>{cancelAnimationFrame(frame);frame=0;if(!document.hidden){moved=-10000;points.length=0;resize();}};
    const lost=e=>{e.preventDefault();useFallback();resize();};
    resize();window.addEventListener('resize',resize);window.addEventListener('pointermove',move,{passive:true});document.addEventListener('visibilitychange',visibility);canvas.addEventListener('webglcontextlost',lost);
    return ()=>{cancelAnimationFrame(frame);renderer?.dispose();window.removeEventListener('resize',resize);window.removeEventListener('pointermove',move);document.removeEventListener('visibilitychange',visibility);canvas.removeEventListener('webglcontextlost',lost);};
  },[]);
  return <div className="cursor-trail" aria-hidden="true"><canvas ref={gpuRef}/><canvas ref={fallbackRef} style={{display:'none'}}/></div>;
}
