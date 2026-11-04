import { RESUME } from '../data/resume';
import { CASE_STUDIES } from '../data/caseStudies';

/* the page, its case studies, and the résumé PDF, which search engines index too */
export default function sitemap() {
  const now = new Date();
  return [
    { url: 'https://alimehdikhan.github.io/', lastModified: now, changeFrequency: 'monthly', priority: 1 },
    ...CASE_STUDIES.map(({ slug }) => ({
      url: `https://alimehdikhan.github.io/projects/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
    {
      url: `https://alimehdikhan.github.io${encodeURI(RESUME.resumePath)}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];
}
