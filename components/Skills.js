'use client';

import { Adapt, Brain, Chat, Code, Database, Evaluate, Exchange, Language, Pipeline, Prompt, Puzzle, Search, Server, Timer, Users } from '@/components/ui/icons';
import { SectionHead } from './ui/SectionHead';
import { Card } from './ui/card';
import { IconTile } from './ui/icon-tile';
import { Reveal } from './fx/Reveal';
import { cn } from '@/lib/utils';
import { RESUME } from '../data/resume';

/* Brand marks, self-hosted in /assets/icons/tech (devicon, MIT, and simple-icons,
   CC0), so they load from this site with no third-party requests. Black marks
   are inverted on the dark theme. Skills without an official mark get a glyph
   from the shared icon set instead (see GLYPHS below). */
const LOGOS = {
  Python: 'python',
  Java: 'java',
  C: 'c',
  'C++': 'cplusplus',
  JavaScript: 'javascript',
  HTML: 'html5',
  CSS: 'css3',
  FastAPI: 'fastapi',
  NestJS: 'nestjs',
  SvelteKit: 'svelte',
  'Next.js': { file: 'nextjs', invert: true },
  Docker: 'docker',
  'Google Cloud': 'googlecloud',
  Git: 'git',
  GitHub: { file: 'github', invert: true },
  TensorFlow: 'tensorflow',
  Keras: 'keras',
  'Hugging Face': 'huggingface',
  LangChain: { file: 'langchain', invert: true },
  LangGraph: { file: 'langgraph', invert: true },
  Hono: 'hono',
  'OpenAI Whisper': { file: 'openai', invert: true },
};

/* skills with no official mark get a glyph on the same plate, so every pill
   in the list leads with an icon */
const GLYPHS = {
  SQL: Database,
  'REST APIs': Exchange,
  'Prompt Engineering': Prompt,
  'LLM Evaluation': Evaluate,
  NLP: Language,
  'RAG Pipelines': Pipeline,
  FAISS: Search,
  Communication: Chat,
  'Problem Solving': Puzzle,
  'Team Collaboration': Users,
  Adaptability: Adapt,
  'Time Management': Timer,
};

/* a brand mark on a small glass plate, so every logo has the same footprint */
export function SkillLogo({ name, size = 16, shape = 'rounded', className }) {
  const entry = LOGOS[name];
  if (!entry) {
    const Glyph = GLYPHS[name];
    if (!Glyph) return null;
    const plate = size + 10;
    return (
      <span
        className={cn('logo-plate text-link', className)}
        style={{ width: plate, height: plate, borderRadius: shape === 'circle' ? 9999 : Math.round(plate * 0.3) }}
        aria-hidden="true"
      >
        <Glyph size={Math.round(size * 1.15)} />
      </span>
    );
  }
  const { file, invert } = typeof entry === 'string' ? { file: entry, invert: false } : entry;
  const box = size + 10;
  return (
    <span
      className={cn('logo-plate', className)}
      style={{ width: box, height: box, borderRadius: shape === 'circle' ? 9999 : Math.round(box * 0.3) }}
      aria-hidden="true"
    >
      <img
        className={invert ? 'inv-dark' : undefined}
        src={`/assets/icons/tech/${file}.svg`}
        alt=""
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: 'contain' }}
        loading="lazy"
        decoding="async"
      />
    </span>
  );
}

const categories = [
  {
    title: 'Languages and web',
    Icon: Code,
    skills: ['Python', 'Java', 'JavaScript', 'SQL', 'C', 'C++', 'HTML', 'CSS'],
  },
  {
    title: 'Backend, cloud and tools',
    Icon: Server,
    skills: ['FastAPI', 'NestJS', 'REST APIs', 'SvelteKit', 'Next.js', 'Hono', 'Docker', 'Google Cloud', 'Hugging Face', 'Git', 'GitHub'],
  },
  {
    title: 'AI and machine learning',
    Icon: Brain,
    skills: ['OpenAI Whisper', 'Prompt Engineering', 'LLM Evaluation', 'NLP', 'TensorFlow', 'Keras', 'LangChain', 'LangGraph', 'RAG Pipelines', 'FAISS'],
  },
  {
    title: 'Beyond the code',
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
              What I <em>work with</em>
            </>
          }
          label="Skills"
          titleId="skills-title"
        />

        <Reveal stagger={0.06} className="grid gap-4 md:grid-cols-2 lg:gap-6">
          {categories.map(({ title, Icon, skills }) => (
            <Card key={title} className="p-6 md:p-8">
              <div className="mb-6 flex items-center gap-4">
                <IconTile icon={Icon} size="lg" />
                <h3 className="text-xl leading-tight font-semibold tracking-[-0.02em]">{title}</h3>
              </div>

              <ul className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <li
                    key={skill}
                    className="inline-flex min-h-10 items-center gap-2 rounded-full bg-secondary px-3.5 text-sm font-medium has-[.logo-plate]:pl-1.5"
                  >
                    <SkillLogo name={skill} size={16} />
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
