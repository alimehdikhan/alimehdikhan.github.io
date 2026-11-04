import { RESUME } from '../data/resume';

/* the page, and the résumé PDF, which search engines index too */
export default function sitemap() {
  return [
    {
      url: 'https://alimehdikhan.github.io/',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `https://alimehdikhan.github.io${encodeURI(RESUME.resumePath)}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];
}
