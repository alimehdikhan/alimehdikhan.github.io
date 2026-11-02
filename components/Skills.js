'use client';

import { Adapt, Bolt, Brain, Browser, Chat, Cloud, Code, Database, Evaluate, Exchange, Language, Layers, Pipeline, Prompt, Puzzle, Search, Server, Sparkle, Timer, Users, Waveform } from '@/components/ui/icons';
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
  React: 'react',
  TypeScript: 'typescript',
  'Tailwind CSS': 'tailwindcss',
  Vite: 'vitejs',
  'Three.js': { file: 'threejs', invert: true },
  GSAP: { file: 'gsap', invert: true },
  'Node.js': 'nodejs',
  Express: { file: 'express', invert: true },
  Flask: { file: 'flask', invert: true },
  Prisma: { file: 'prisma', invert: true },
  Pydantic: { file: 'pydantic', invert: true },
  PostgreSQL: 'postgresql',
  MySQL: 'mysql',
  MongoDB: 'mongodb',
  Supabase: 'supabase',
  PyTorch: 'pytorch',
  'scikit-learn': 'scikitlearn',
  OpenCV: 'opencv',
  Pandas: 'pandas',
  NumPy: 'numpy',
  Gemini: { file: 'googlegemini', invert: true },
  'GitHub Actions': 'githubactions',
  Vercel: { file: 'vercel', invert: true },
  Render: { file: 'render', invert: true },
  Linux: { file: 'linux', invert: true },
  Playwright: 'playwright',
  Vitest: 'vitest',
  Jest: 'jest',
  Prometheus: 'prometheus',
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
  Epitran: Waveform,
  'wav2vec 2.0': Waveform,
  'ONNX Runtime': Brain,
  Groq: Bolt,
  Motion: Sparkle,
  CNN: Layers,
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

/* grouped as on the GitHub profile README. AI leads and spans the grid, the
   four stacks pair up beneath it, and the soft skills close as one row */
const categories = [
  {
    title: 'AI and machine learning',
    Icon: Brain,
    wide: true,
    skills: [
      'PyTorch',
      'TensorFlow',
      'Keras',
      'scikit-learn',
      'OpenCV',
      'Pandas',
      'NumPy',
      'Hugging Face',
      'OpenAI Whisper',
      'Epitran',
      'wav2vec 2.0',
      'ONNX Runtime',
      'Gemini',
      'Groq',
      'LangChain',
      'LangGraph',
      'RAG Pipelines',
      'FAISS',
      'Prompt Engineering',
      'LLM Evaluation',
      'NLP',
    ],
  },
  {
    title: 'Languages',
    Icon: Code,
    skills: ['Python', 'TypeScript', 'JavaScript', 'Java', 'C++', 'C', 'SQL'],
  },
  {
    title: 'Frontend',
    Icon: Browser,
    skills: ['React', 'Next.js', 'SvelteKit', 'Tailwind CSS', 'Vite', 'Three.js', 'Motion', 'GSAP', 'HTML', 'CSS'],
  },
  {
    title: 'Backend and data',
    Icon: Server,
    skills: ['FastAPI', 'Node.js', 'NestJS', 'Express', 'Hono', 'Flask', 'Prisma', 'Pydantic', 'REST APIs', 'PostgreSQL', 'MySQL', 'MongoDB', 'Supabase'],
  },
  {
    title: 'Cloud, DevOps and testing',
    Icon: Cloud,
    skills: ['Google Cloud', 'Docker', 'GitHub Actions', 'Vercel', 'Render', 'Linux', 'Git', 'GitHub', 'Playwright', 'Vitest', 'Jest', 'Prometheus'],
  },
  {
    title: 'Beyond the code',
    Icon: Users,
    wide: true,
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
              The stack I <em>build with</em>
            </>
          }
          titleId="skills-title"
        />

        <Reveal stagger={0.06} className="grid gap-4 md:grid-cols-2 lg:gap-6">
          {categories.map(({ title, Icon, skills, wide }) => (
            <Card key={title} className={cn('p-6 md:p-8', wide && 'md:col-span-2')}>
              <div className="mb-6 flex items-center gap-4">
                <IconTile icon={Icon} size="lg" />
                <h3 className="text-xl leading-tight font-semibold tracking-[-0.02em]">{title}</h3>
              </div>

              <ul className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <li
                    key={skill}
                    className="inline-flex min-h-9 items-center gap-2 rounded-full bg-secondary px-3 text-[13px] font-medium has-[.logo-plate]:pl-1.5 sm:min-h-10 sm:px-3.5 sm:text-sm"
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
