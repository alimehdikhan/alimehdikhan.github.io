'use client';

import { useEffect, useRef } from 'react';
import { scrollToHash, scrollToPosition } from './scrollTo';

export function ProjectMotion({ titles }) {
  const navigation = useRef(null);
  const jump = useRef(null);

  useEffect(() => {
    const section = document.querySelector('#projects');
    const cards = [...section.querySelectorAll('.project-case')];
    const links = [...navigation.current.querySelectorAll('a')];
    const observer = new IntersectionObserver(entries => {
      if (section.classList.contains('projects-horizontal')) return;
      const entry = entries.find(item => item.isIntersecting);
      if (!entry) return;
      const index = cards.indexOf(entry.target);
      links.forEach((link, i) => {
        link.setAttribute('aria-current', i === index ? 'true' : 'false');
        link.style.setProperty('--progress', i === index ? '1' : '0');
      });
    }, { rootMargin: '-100px 0px -45% 0px' });
    cards.forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = document.querySelector('#projects');
    if (!section) return;
    let disposed = false, media;
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    if (!fine.matches) return;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      media = gsap.matchMedia();
      media.add('(min-width: 1100px) and (min-height: 820px) and (prefers-reduced-motion: no-preference)', () => {
        const rail = section.querySelector('.project-track');
        const viewport = section.querySelector('.project-window');
        const cards = [...rail.children];
        const buttons = [...navigation.current.querySelectorAll('a')];
        let pinContext, resizeTimer;
        const build = () => {
          pinContext?.revert();
          pinContext = gsap.context(() => {
            section.classList.add('projects-horizontal');
            // Reading always wins over pinning, including enlarged system text.
            if (section.offsetHeight > innerHeight - 108) {
              section.classList.remove('projects-horizontal');
              return;
            }
            const distance = () => Math.max(0, rail.scrollWidth - viewport.clientWidth);
            const setCurrent = progress => {
              const index = Math.round(progress * (cards.length - 1));
              buttons.forEach((button, i) => {
                button.setAttribute('aria-current', i === index ? 'true' : 'false');
                button.style.setProperty('--progress', i === index ? '1' : '0');
              });
            };
            const tween = gsap.to(rail, {
              x: () => -distance(), ease: 'none',
              scrollTrigger: {
                trigger: section, start: 'top 100px', end: () => `+=${distance() + 240}`,
                pin: true, scrub: .45, invalidateOnRefresh: true, anticipatePin: 1,
                onUpdate: self => setCurrent(self.progress),
              },
            });
            const travel = (index, immediate = false) => {
              const progress = index / Math.max(1, cards.length - 1);
              const trigger = tween.scrollTrigger;
              const target = gsap.utils.clamp(trigger.start + 1, trigger.end - 1, trigger.start + (trigger.end - trigger.start) * progress);
              scrollToPosition(target, { immediate });
              if (immediate) { tween.progress(progress); ScrollTrigger.update(); }
            };
            jump.current = travel;
            const focus = event => {
              const card = event.target.closest('.project-case');
              if (card) travel(cards.indexOf(card), true);
            };
            rail.addEventListener('focusin', focus);
            return () => {
              jump.current = null;
              rail.removeEventListener('focusin', focus);
              section.classList.remove('projects-horizontal');
              viewport.scrollLeft = 0;
            };
          }, section);
          ScrollTrigger.refresh();
        };
        const scheduleBuild = () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(build, 120);
        };
        const resizeObserver = new ResizeObserver(() => {
          if (section.classList.contains('projects-horizontal') && section.scrollHeight > innerHeight - 108) scheduleBuild();
        });
        build();
        resizeObserver.observe(viewport);
        window.addEventListener('resize', scheduleBuild);
        return () => {
          clearTimeout(resizeTimer);
          resizeObserver.disconnect();
          window.removeEventListener('resize', scheduleBuild);
          pinContext?.revert();
        };
      });

      media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const cleanup = [];
        const animations = [];
        section.querySelectorAll('.project-visual').forEach(visual => {
          const artwork = visual.querySelector('.project-sculpture');
          const rotateX = gsap.quickTo(artwork, 'rotationX', { duration: .5, ease: 'power3.out' });
          const rotateY = gsap.quickTo(artwork, 'rotationY', { duration: .5, ease: 'power3.out' });
          const x = gsap.quickTo(artwork, 'x', { duration: .5, ease: 'power3.out' });
          animations.push(rotateX.tween, rotateY.tween, x.tween);
          let bounds, moved = false;
          const enter = () => { bounds = visual.getBoundingClientRect(); };
          const move = event => {
            if (event.pointerType !== 'mouse') return;
            if (!bounds) enter();
            const dx = (event.clientX - bounds.left) / bounds.width - .5;
            const dy = (event.clientY - bounds.top) / bounds.height - .5;
            moved = true;
            rotateX(-dy * 7); rotateY(dx * 9); x(dx * 10);
          };
          const reset = () => {
            bounds = null;
            if (!moved) return;
            moved = false;
            rotateX(0); rotateY(0); x(0);
          };
          visual.addEventListener('pointerenter', enter);
          visual.addEventListener('pointermove', move);
          visual.addEventListener('pointerleave', reset);
          window.addEventListener('scroll', reset, { passive: true });
          cleanup.push(() => {
            visual.removeEventListener('pointerenter', enter);
            visual.removeEventListener('pointermove', move);
            visual.removeEventListener('pointerleave', reset);
            window.removeEventListener('scroll', reset);
          });
        });

        const preview = document.createElement('div');
        preview.className = 'project-preview';
        preview.setAttribute('aria-hidden', 'true');
        const image = document.createElement('img');
        image.alt = '';
        preview.append(image);
        document.body.append(preview);
        const px = gsap.quickTo(preview, 'x', { duration: .2, ease: 'power3.out' });
        const py = gsap.quickTo(preview, 'y', { duration: .2, ease: 'power3.out' });
        animations.push(px.tween, py.tween);
        // Keep the preview inside the artwork, clear of headings and body copy.
        const position = (event, area, target) => {
          const dx = gsap.utils.clamp(0, 1, (event.clientX - target.left) / target.width);
          const dy = gsap.utils.clamp(0, 1, (event.clientY - target.top) / target.height);
          return {
            x: gsap.utils.clamp(12, innerWidth - 232, area.left + 20 + dx * Math.max(0, area.width - 260)),
            y: gsap.utils.clamp(12, innerHeight - 232, area.top + 20 + dy * Math.max(0, area.height - 280)),
          };
        };
        const hide = () => preview.classList.remove('visible');
        section.querySelectorAll('[data-project-preview]').forEach(title => {
          let area, target;
          const move = event => {
            if (!area || !preview.classList.contains('visible')) return;
            const p = position(event, area, target); px(p.x); py(p.y);
          };
          const enter = event => {
            if (event.pointerType !== 'mouse' || innerWidth <= 800) return;
            area = title.closest('.project-case').querySelector('.project-visual').getBoundingClientRect();
            target = title.getBoundingClientRect();
            image.src = title.dataset.projectPreview;
            gsap.set(preview, position(event, area, target));
            preview.classList.add('visible');
          };
          title.addEventListener('pointerenter', enter);
          title.addEventListener('pointermove', move);
          title.addEventListener('pointerleave', hide);
          cleanup.push(() => {
            title.removeEventListener('pointerenter', enter);
            title.removeEventListener('pointermove', move);
            title.removeEventListener('pointerleave', hide);
          });
        });
        const visibility = () => {
          if (!document.hidden) return;
          hide();
          animations.forEach(animation => animation.pause());
        };
        window.addEventListener('scroll', hide, { passive: true });
        window.addEventListener('resize', hide);
        document.addEventListener('visibilitychange', visibility);
        return () => {
          cleanup.forEach(fn => fn());
          animations.forEach(animation => animation.kill());
          window.removeEventListener('scroll', hide);
          window.removeEventListener('resize', hide);
          document.removeEventListener('visibilitychange', visibility);
          preview.remove();
        };
      });
    }).catch(() => { /* Static, stacked case studies need no animation runtime. */ });
    return () => { disposed = true; media?.revert(); };
  }, []);

  return (
    <nav className="project-pagination" ref={navigation} aria-label="Project gallery">
      {titles.map((title, index) => (
        <a key={title} href={`#project-${index + 1}`} aria-label={`Show ${title}`} aria-current={index === 0 ? 'true' : 'false'} onClick={event => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          if (event.detail === 0) {
            event.preventDefault();
            const card = document.getElementById(`project-${index + 1}`);
            if (jump.current) jump.current(index, true);
            else scrollToPosition(card.getBoundingClientRect().top + scrollY - 100, { immediate: true });
            card.focus({ preventScroll: true });
          }
          else if (jump.current) { event.preventDefault(); jump.current(index); }
          else if (scrollToHash(`#project-${index + 1}`, { push: false })) event.preventDefault();
        }}>
          <span className="project-page-number">{String(index + 1).padStart(2, '0')}</span>
          <span className="project-nav-title">{title}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      ))}
    </nav>
  );
}
