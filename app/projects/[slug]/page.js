import { notFound } from 'next/navigation';
import { CaseStudy } from '../../../components/CaseStudy';
import { CASE_STUDIES, caseStudy } from '../../../data/caseStudies';
import { RESUME } from '../../../data/resume';

/* /projects/<slug>: one static page per case study (data/caseStudies.js) */
const SITE = RESUME.portfolio;

export const dynamicParams = false;

export function generateStaticParams() {
  return CASE_STUDIES.map(({ slug }) => ({ slug }));
}

export function generateMetadata({ params }) {
  const study = caseStudy(params.slug);
  if (!study) return {};
  const url = `${SITE}/projects/${study.slug}`;
  const image = { url: study.og, width: 1200, height: 630, alt: study.title };
  return {
    title: study.seoTitle,
    description: study.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: study.title,
      description: study.description,
      siteName: 'Ali Mehdi Khan Portfolio',
      locale: 'en_US',
      publishedTime: study.published,
      authors: [`${SITE}/`],
      images: [image],
    },
    twitter: { card: 'summary_large_image', title: study.title, description: study.description, images: [image] },
  };
}

export default function CaseStudyPage({ params }) {
  const study = caseStudy(params.slug);
  if (!study) notFound();
  return <CaseStudy study={study} />;
}
