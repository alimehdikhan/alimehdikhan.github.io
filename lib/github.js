import { RESUME } from '../data/resume';

const LOGIN = RESUME.github.split('/').pop();
const API = 'https://api.github.com';

/* In the deploy workflow GITHUB_TOKEN lifts the API's hourly limit; a local
   build goes without it. Either way it is only used here, at build time,
   and never reaches the page. */
const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }),
};

async function gh(path) {
  const res = await fetch(`${API}${path}`, { headers, cache: 'force-cache', signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`GitHub API ${res.status} for ${path}`);
  return res.json();
}

/* "feat(pdf): read the CV page budget (#6325)" -> "Read the CV page budget" */
const plainTitle = (title) => {
  const t = title.replace(/^\w+(\([^)]*\))?!?:\s*/, '').replace(/\s*\(#\d+\)\s*$/, '');
  return t.charAt(0).toUpperCase() + t.slice(1);
};

/* the first sentence under the PR template's "What does this PR do?" (or
   the body's first paragraph), still with its `code` marks */
const summary = (body = '') => {
  const section = body.split(/^##\s+What does this PR do\?\s*$/im)[1] ?? body;
  const para = section.split(/\n\s*\n/).map((p) => p.trim()).find((p) => p && !p.startsWith('#'));
  return para?.replace(/\s+/g, ' ').match(/^.*?[.!?](?=\s|$)/)?.[0] ?? null;
};

/* Pull requests to other people's public repositories that were merged or
   are still open, newest first, each with its repository's details. Public
   only, twice over (the search and the repository itself): a token that can
   see private work, such as an employer's, must never put it on this page.
   Read when the site is built; an empty list if GitHub can't be reached, so
   the build carries on without them. */
export async function contributions() {
  try {
    const q = encodeURIComponent(`type:pr is:public author:${LOGIN} -user:${LOGIN}`);
    const { items = [] } = await gh(`/search/issues?q=${q}&sort=created&order=desc&per_page=20`);
    const live = items.filter((i) => i.pull_request?.merged_at || i.state === 'open').slice(0, 4);
    const found = await Promise.all(
      live.map(async (item) => {
        const path = item.repository_url.split('/repos/')[1];
        const repo = await gh(`/repos/${path}`);
        if (repo.private || repo.visibility !== 'public') return null;
        const pr = await gh(`/repos/${path}/pulls/${item.number}`);
        return {
          url: pr.html_url,
          number: pr.number,
          title: plainTitle(pr.title),
          summary: summary(pr.body),
          merged: Boolean(pr.merged_at),
          date: pr.merged_at || pr.created_at,
          additions: pr.additions,
          deletions: pr.deletions,
          files: pr.changed_files,
          repo: {
            path,
            url: repo.html_url,
            description: repo.description,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
          },
        };
      })
    );
    return found.filter(Boolean);
  } catch {
    return [];
  }
}

/* 79697 -> 79.7k, as GitHub prints it */
export const compact = (n) => (n < 1000 ? `${n}` : `${(n / 1000).toFixed(n < 100000 ? 1 : 0).replace(/\.0$/, '')}k`);
