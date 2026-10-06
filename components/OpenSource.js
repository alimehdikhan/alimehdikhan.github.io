import { ArrowUpRight } from 'lucide-react';
import { SectionHead } from './ui/SectionHead';
import { Button } from './ui/button';
import { Magnetic } from './ui/magnetic';
import { Card } from './ui/card';
import { Reveal } from './fx/Reveal';
import { RESUME } from '../data/resume';

const stats = [
  { name: 'Repositories', value: `${RESUME.githubStats.publicRepos}` },
  { name: 'Primary Lang', value: RESUME.githubStats.primaryLang },
  { name: 'Focus Area', value: RESUME.githubStats.focusArea },
];

export function OpenSource() {
  return (
    <section id="opensource" className="section-y" aria-labelledby="opensource-title">
      <div className="container-page">
        <SectionHead
          title={
            <>
              GitHub &amp; <em>Contributions</em>
            </>
          }
          index="06"
          label="Open Source"
          titleId="opensource-title"
        />

        <div className="grid items-stretch gap-4 lg:grid-cols-2 lg:gap-6">
          <Reveal stagger={0.08} className="flex flex-col">
            <span className="text-sm font-semibold text-link">@alimehdikhan</span>
            <p className="mt-2 max-w-[52ch] text-muted-foreground md:text-lg">
              A dozen public repos, mostly Python — the pronunciation coach, the cancer-detection model, and whatever pipeline experiment is currently mid-commit.
            </p>

            <div className="my-8 grid grid-cols-3 gap-2 sm:gap-4">
              {stats.map((s) => (
                <Card key={s.name} className="p-4 sm:p-6">
                  <div className="text-2xl font-semibold tracking-[-0.03em] md:text-[28px]">{s.value}</div>
                  <div className="mt-1 text-[13px] text-muted-foreground">{s.name}</div>
                </Card>
              ))}
            </div>

            <div>
              <Magnetic>
                <Button asChild>
                  <a href={RESUME.github} target="_blank" rel="noopener noreferrer" aria-label="View GitHub Profile">
                    View GitHub Profile
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                </Button>
              </Magnetic>
            </div>
          </Reveal>

          {/* the terminal prints line by line, like a real git log */}
          <Reveal>
            <div className="h-full overflow-hidden rounded-3xl bg-[#0c0d0c] font-mono text-[13px] text-[#f5f5f7] shadow-soft dark:border dark:border-border">
              <div className="flex items-center gap-4 border-b border-white/10 px-6 py-4">
                <span className="flex gap-2" aria-hidden="true">
                  <i className="size-3 rounded-full bg-[#ff5f57]" />
                  <i className="size-3 rounded-full bg-[#febc2e]" />
                  <i className="size-3 rounded-full bg-[#d5f66b]" />
                </span>
                <span className="text-xs text-[#a1a1a6]">A.I-Pronunciation-Coach</span>
              </div>
              <Reveal stagger={0.05} y={6} className="space-y-2 p-6 leading-relaxed">
                <div className="flex gap-2">
                  <i className="text-[#a1a1a6] not-italic" aria-hidden="true">$</i>
                  <span>git log --oneline -5</span>
                </div>
                {RESUME.githubCommits.map((commit) => (
                  <div key={commit.sha} className="text-[#a1a1a6]">
                    <span className="text-[#d5f66b]">{commit.sha}</span> {commit.message}
                  </div>
                ))}
                <div className="flex gap-2 pt-4">
                  <i className="text-[#a1a1a6] not-italic" aria-hidden="true">$</i>
                  <span>echo $STATUS</span>
                </div>
                <div className="text-[#d5f66b]">Available for entry-level Software Engineering and AI/ML roles</div>
              </Reveal>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
