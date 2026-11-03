import { ArrowUpRight, Brain, Code, Repo } from '@/components/ui/icons';
import { SectionHead } from './ui/SectionHead';
import { Button } from './ui/button';
import { Magnetic } from './ui/magnetic';
import { Card } from './ui/card';
import { IconTile } from './ui/icon-tile';
import { Reveal } from './fx/Reveal';
import { GithubActivity } from './GithubActivity';
import { Contributions } from './Contributions';
import { contributions } from '@/lib/github';
import { RESUME } from '../data/resume';

/* a language with a brand mark shows it on the tile; anything else gets a glyph */
const LANG_LOGOS = { Python: 'python', Java: 'java', JavaScript: 'javascript', TypeScript: 'typescript' };

const stats = [
  { name: 'Repositories', value: `${RESUME.githubStats.publicRepos}`, Icon: Repo },
  { name: 'Main language', value: RESUME.githubStats.primaryLang, logo: LANG_LOGOS[RESUME.githubStats.primaryLang], Icon: Code },
  { name: 'Focus', value: RESUME.githubStats.focusArea, Icon: Brain },
];

export async function OpenSource() {
  const prs = await contributions();
  return (
    <section id="opensource" className="section-y" aria-labelledby="opensource-title">
      <div className="container-page">
        <SectionHead
          title={
            <>
              My code on <em>GitHub</em>
            </>
          }
          titleId="opensource-title"
        />

        <div className="grid items-stretch gap-4 lg:grid-cols-2 lg:gap-6">
          <Reveal stagger={0.08} className="flex flex-col">
            <span className="text-sm font-semibold text-link">@alimehdikhan</span>
            <p className="mt-2 max-w-[52ch] text-muted-foreground md:text-lg">
              {RESUME.githubStats.publicRepos} public repositories, mostly TypeScript and Python. Vocaly AI, the pronunciation coach, and the cancer-detection model are the two to start with.
            </p>

            {/* a row each on phones (a long value like "TypeScript" never fits a
                third of the width), three tiles from sm up */}
            <div className="my-8 grid gap-2 sm:grid-cols-3 sm:gap-4">
              {stats.map((s) => (
                <Card key={s.name} className="flex items-center gap-4 p-4 sm:block sm:p-6">
                  <IconTile icon={s.logo ? undefined : s.Icon} size="sm" className="sm:mb-4">
                    {s.logo && <img src={`/assets/icons/tech/${s.logo}.svg`} alt="" width="20" height="20" className="size-5 object-contain" loading="lazy" decoding="async" />}
                  </IconTile>
                  <div className="min-w-0">
                    <div className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl md:text-[28px]">{s.value}</div>
                    <div className="mt-0.5 text-[13px] text-muted-foreground sm:mt-1">{s.name}</div>
                  </div>
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
                <span className="inline-flex items-center gap-2 text-xs text-[#a1a1a6]">
                  <img src="/assets/images/vocaly-mark.webp" alt="" width="16" height="16" className="size-4" loading="lazy" decoding="async" />
                  A.I-Pronunciation-Coach
                </span>
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

        {/* pull requests to other people's projects, then the last year of
            contributions; both read when the site is built */}
        <Contributions items={prs} />
        <GithubActivity />
      </div>
    </section>
  );
}
