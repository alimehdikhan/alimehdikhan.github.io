'use client';

import { Brain, Code, Server, Users } from 'lucide-react';
import { SectionHead } from './ui/SectionHead';
import { Card } from './ui/card';
import { Reveal } from './fx/Reveal';
import { cn } from '@/lib/utils';
import { RESUME } from '../data/resume';

/* Official full-colour logos (devicon "original" set) for skills that have a
   real brand mark; the rest (soft skills, generic terms like SQL / REST APIs /
   NLP / Machine Learning) stay text-only. */
const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/';
const LOGOS = {
  Python: 'python/python-original.svg',
  Java: 'java/java-original.svg',
  C: 'c/c-original.svg',
  'C++': 'cplusplus/cplusplus-original.svg',
  JavaScript: 'javascript/javascript-original.svg',
  HTML: 'html5/html5-original.svg',
  CSS: 'css3/css3-original.svg',
  FastAPI: 'fastapi/fastapi-original.svg',
  SvelteKit: 'svelte/svelte-original.svg',
  'Next.js': { path: 'nextjs/nextjs-original.svg', invDark: true },
  Docker: 'docker/docker-original.svg',
  'Google Cloud': 'googlecloud/googlecloud-original.svg',
  Git: 'git/git-original.svg',
  GitHub: { path: 'github/github-original.svg', invDark: true },
  TensorFlow: 'tensorflow/tensorflow-original.svg',
  Keras: 'keras/keras-original.svg',
  'Hugging Face': { url: 'https://cdn.simpleicons.org/huggingface' },
  LangChain: { url: 'https://cdn.simpleicons.org/langchain', invDark: true },
  LangGraph: { url: 'https://cdn.simpleicons.org/langgraph', invDark: true },
  Hono: { url: 'https://cdn.simpleicons.org/hono' },
  NestJS: 'nestjs/nestjs-original.svg',
  'OpenAI Whisper': { url: 'https://cdn.jsdelivr.net/npm/simple-icons@13/icons/openai.svg', invDark: true },
};

export function SkillLogo({ name, size = 16, className }) {
  const entry = LOGOS[name];
  if (!entry) return null;
  const path = typeof entry === 'string' ? entry : entry.path;
  const invDark = typeof entry === 'object' && entry.invDark;
  const src = typeof entry === 'object' && entry.url ? entry.url : `${DEVICON}${path}`;
  const hide = (e) => {
    e.currentTarget.parentElement.style.display = 'none';
  };
  return (
    <span className={cn('inline-flex shrink-0', className)} aria-hidden="true">
      <img
        className={invDark ? 'inv-dark' : undefined}
        src={src}
        alt=""
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: 'contain' }}
        loading="lazy"
        onError={hide}
      />
    </span>
  );
}

const categories = [
  {
    eyebrow: 'Write',
    title: 'Languages & Web',
    Icon: Code,
    skills: ['Python', 'Java', 'JavaScript', 'SQL', 'C', 'C++', 'HTML', 'CSS'],
  },
  {
    eyebrow: 'Build',
    title: 'Backend, Cloud & Tools',
    Icon: Server,
    skills: ['FastAPI', 'NestJS', 'REST APIs', 'SvelteKit', 'Next.js', 'Hono', 'Docker', 'Google Cloud', 'Hugging Face', 'Git', 'GitHub'],
  },
  {
    eyebrow: 'Train',
    title: 'AI, LLMs & RAG',
    Icon: Brain,
    skills: ['OpenAI Whisper', 'Prompt Engineering', 'LLM Evaluation', 'NLP', 'TensorFlow', 'Keras', 'LangChain', 'LangGraph', 'RAG Pipelines', 'FAISS'],
  },
  {
    eyebrow: 'Work',
    title: 'Professional Soft Skills',
    Icon: Users,
    skills: RESUME.skills.soft,
  },
];

export function Skills() {
  return (
    <section id="skills" className="section-y" aria-labelledby="skills-title">
      <div className="container-page">
        <SectionHead
          title={
            <>
              Skills &amp; <em>Abilities</em>
            </>
          }
          index="02"
          label="Technical Expertise"
          titleId="skills-title"
        />

        <Reveal stagger={0.06} className="grid gap-4 md:grid-cols-2 lg:gap-6">
          {categories.map(({ eyebrow, title, Icon, skills }) => (
            <Card key={title} className="p-6 md:p-8">
              <div className="mb-6 flex items-center gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-secondary text-foreground">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <span className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">{eyebrow}</span>
                  <h3 className="text-xl leading-tight font-semibold tracking-[-0.02em]">{title}</h3>
                </div>
              </div>

              <ul className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <li
                    key={skill}
                    className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium"
                  >
                    <SkillLogo name={skill} size={15} />
                    {skill}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
