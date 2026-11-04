import { RESUME } from '../data/resume';
import { ASSISTANT } from '../data/assistant';
import { contributions } from './github';

/* The site in plain Markdown for AI tools, as llmstxt.org lays it out:
   /llms.txt is the short index (who he is, where to look) and /llms-full.txt
   everything the page says plus Byte's notes (data/assistant.js). Both are
   written when the site is built. Byte, the site's own assistant
   (chat-worker/), answers from the full one. */

const SITE = RESUME.portfolio;
const RESUME_URL = `${SITE}${encodeURI(RESUME.resumePath)}`;
const list = (items) => items.map((item) => `- ${item}`).join('\n');

export const plainText = (body) => new Response(`${body}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });

export function llmsIndex() {
  const r = RESUME;
  return [
    `# ${r.name}`,
    `> ${r.summary}`,
    `${r.availability} He is based in ${r.location}, open to relocating in India or abroad, and can join immediately.`,
    '## About him',
    list([
      `[Portfolio](${SITE}/): projects, experience, certificates and contact, with Byte, an AI assistant that answers questions about him`,
      `[Résumé (PDF)](${RESUME_URL}): one page`,
      `[GitHub](${r.github}): ${r.githubStats.publicRepos} public repositories, mostly TypeScript and Python`,
      `[LinkedIn](${r.linkedin})`,
      `Email: ${r.email}`,
    ]),
    '## Projects',
    list(r.projects.map((p) => `[${p.title}](${p.github}): ${p.overview}${p.demo ? ` [Live demo](${p.demo})` : ''}`)),
    '## Optional',
    list([`[Full profile](${SITE}/llms-full.txt): experience, project detail, certificates, skills and his answers to recruiters' usual questions`]),
  ].join('\n\n');
}

export async function llmsFull() {
  const prs = await contributions();
  const r = RESUME;

  return [
    `# ${r.name}`,
    `> ${r.summary}`,
    list([
      `Location: ${r.location}`,
      `Availability: ${r.availability}`,
      `Email: ${r.email}`,
      `Phone: ${r.phone}`,
      `LinkedIn: ${r.linkedin}`,
      `GitHub: ${r.github}`,
      `Portfolio: ${SITE}`,
      `Résumé (PDF): ${RESUME_URL}`,
      `Roles he is suited to: ${r.roles.join(', ')}`,
      `Focus: ${ASSISTANT.focus.join(', ')}`,
    ]),
    `In his words: "${ASSISTANT.quote}"`,

    '## For recruiters',
    list(ASSISTANT.faq.map(({ q, a }) => `${q} ${a}`)),

    '## Experience',
    ...r.experience.map((job) => `### ${job.role}, ${job.company} (${job.date})\n${list(job.details)}`),

    '## Projects',
    ...r.projects.map((p) =>
      [
        `### ${p.title} (${p.tag})`,
        p.overview,
        `How it works: ${p.features}`,
        `Result: ${p.outcome}`,
        `Tech: ${p.tech.join(', ')}`,
        `Code: ${p.github}`,
        p.demo && `Live demo: ${p.demo}`,
      ]
        .filter(Boolean)
        .join('\n')
    ),

    '## More detail, from his résumé',
    ...ASSISTANT.details.map((d) => `### ${d.about}\n${list(d.points)}`),

    '## Open-source contributions',
    `${r.githubStats.publicRepos} public repositories of his own, mostly TypeScript and Python. Pull requests to other people's projects:`,
    prs.length
      ? list(prs.map((pr) => `${pr.title}, in ${pr.repo.path} (${pr.repo.stars} stars), ${pr.merged ? 'merged' : 'open'}: ${pr.url}`))
      : `- See ${r.github}`,

    '## Education',
    `${r.education.degree}, ${r.education.school}, ${r.education.date}.`,

    '## Certifications',
    list(r.certifications.map((c) => `${c.title}, ${c.issuer} (${c.date})${c.detail ? `. ${c.detail}` : ''}${c.verify ? `. Verify: ${c.verify}` : ''}`)),

    '## Volunteering',
    `${r.volunteering.role}, ${r.volunteering.org} (${r.volunteering.date}). ${r.volunteering.detail}`,

    '## Awards',
    list(r.awards.map((a) => `${a.title}: ${a.detail}`)),

    '## Skills',
    `Technical: ${r.skills.technical.join(', ')}`,
    `Soft: ${r.skills.soft.join(', ')}`,
  ].join('\n\n');
}
