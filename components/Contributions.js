import { ArrowUpRight, GitFork, GithubMark, GitMerge, GitPullRequest, Star } from '@/components/ui/icons';
import { SpotlightCard } from './ui/aceternity/spotlight-card';
import { IconTile } from './ui/icon-tile';
import { Reveal } from './fx/Reveal';
import { compact } from '@/lib/github';

/* GitHub's language colours, for the dot */
const LANG = { JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572a5', Java: '#b07219', Go: '#00add8', Rust: '#dea584' };

const day = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

/* a PR's own words, with its `code` marks set as code */
function Inline({ text }) {
  return text.split('`').map((part, i) =>
    i % 2 ? (
      <code key={i} className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[0.86em] text-foreground">
        {part}
      </code>
    ) : (
      part
    )
  );
}

/* Pull requests to other people's projects, read from GitHub when the site
   is built (lib/github.js): the project as GitHub presents it on the left,
   the change on the right, merged ones marked in lime. Nothing renders
   until there is one. */
export function Contributions({ items }) {
  if (!items?.length) return null;
  return (
    <Reveal className="mt-4 lg:mt-6">
      <SpotlightCard borderGlow className="bg-card p-6 md:p-8 lg:p-10">
        <h3 className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
          Open source contribution{items.length > 1 ? 's' : ''}
        </h3>
        <ul className="mt-6 divide-y divide-border">
          {items.map((pr) => {
            const [owner, name] = pr.repo.path.split('/');
            const Status = pr.merged ? GitMerge : GitPullRequest;
            return (
              <li key={pr.url} className="grid grid-cols-[minmax(0,1fr)] gap-6 py-8 first:pt-0 last:pb-0 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12">
                {/* the project */}
                <div className="min-w-0">
                  <a href={pr.repo.url} target="_blank" rel="noopener noreferrer" className="group inline-flex max-w-full items-center gap-3 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 rounded-2xl">
                    <IconTile icon={GithubMark} size="md" />
                    <span className="min-w-0 font-mono text-[15px] leading-snug break-words">
                      <span className="text-muted-foreground">{owner} /</span> <span className="font-semibold underline-offset-4 group-hover:underline">{name}</span>
                    </span>
                  </a>
                  {pr.repo.description && <p className="mt-4 line-clamp-3 text-[15px] leading-relaxed text-muted-foreground">{pr.repo.description}</p>}
                  <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground" aria-label="Project details">
                    <li className="inline-flex items-center gap-1.5">
                      <Star className="size-4" />
                      <span className="font-semibold text-foreground tabular-nums">{compact(pr.repo.stars)}</span> stars
                    </li>
                    <li className="inline-flex items-center gap-1.5">
                      <GitFork className="size-4" />
                      <span className="tabular-nums">{compact(pr.repo.forks)}</span> forks
                    </li>
                    {pr.repo.language && (
                      <li className="inline-flex items-center gap-2">
                        <span aria-hidden="true" className="size-3 rounded-full" style={{ background: LANG[pr.repo.language] ?? 'var(--muted-foreground)' }} />
                        {pr.repo.language}
                      </li>
                    )}
                  </ul>
                </div>

                {/* my change to it */}
                <div className="min-w-0 border-t border-border pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px]">
                    <span
                      className={
                        pr.merged
                          ? 'inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 font-semibold text-primary-foreground [--icon-accent-opacity:0.25] [--icon-accent:currentColor]'
                          : 'inline-flex items-center gap-1.5 rounded-full border border-border-strong px-2.5 py-1 font-semibold'
                      }
                    >
                      <Status className="size-3.5" />
                      {pr.merged ? 'Merged' : 'In review'}
                    </span>
                    <span className="text-muted-foreground tabular-nums">
                      #{pr.number} · {pr.merged ? 'merged' : 'opened'} {day(pr.date)}
                    </span>
                  </p>
                  <a
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 block text-xl leading-snug font-semibold tracking-[-0.02em] underline-offset-4 outline-none hover:underline focus-visible:underline md:text-2xl"
                  >
                    <Inline text={pr.title} />
                  </a>
                  {pr.summary && (
                    <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                      <Inline text={pr.summary} />
                    </p>
                  )}
                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-[13px] text-muted-foreground">
                    <span className="font-mono tabular-nums" aria-label={`${pr.additions} lines added, ${pr.deletions} removed`}>
                      <span className="text-[#1a7f37] dark:text-[#3fb950]">+{pr.additions.toLocaleString('en-US')}</span>{' '}
                      <span className="text-[#d1242f] dark:text-[#f85149]">−{pr.deletions.toLocaleString('en-US')}</span>
                    </span>
                    <span className="tabular-nums">{pr.files} files changed</span>
                    <a href={pr.url} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-1 font-medium text-foreground sm:ml-auto">
                      View pull request
                      <ArrowUpRight className="size-3.5" />
                    </a>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </SpotlightCard>
    </Reveal>
  );
}
