import Link from 'next/link';
import { ArrowUpRight, ChevronRight, Download, Mail } from '@/components/ui/icons';
import { Button } from './ui/button';
import { ThemeToggle } from './ui/ThemeToggle';
import { SkillLogo } from './Skills';
import { AskByte } from './AskByte';
import { ChatWidget } from './ChatWidget';
import { cn } from '@/lib/utils';
import { CASE_STUDIES } from '../data/caseStudies';
import { RESUME } from '../data/resume';

/* A case study page (/projects/<slug>, data/caseStudies.js): what the project
   is, the numbers up front, then how it was built, measured and where it
   falls short, in the site's type and colours. It has its own slim header
   and footer, the homepage's being built around in-page sections, and Byte
   comes along. Each page describes itself to search engines as a
   TechArticle by Ali, with a breadcrumb back to the portfolio. */

const SITE = RESUME.portfolio;
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function Block({ block }) {
  if (typeof block === 'string') return <p className="mt-5 text-[17px] leading-relaxed text-foreground/85">{block}</p>;
  if (block.list) {
    return (
      <ul className="mt-5 list-disc space-y-2.5 pl-5 text-[17px] leading-relaxed text-foreground/85 marker:text-link">
        {block.list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  if (block.steps) {
    return (
      <ol className="mt-6 space-y-5">
        {block.steps.map((step, i) => (
          <li key={step.title} className="flex gap-4">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground" aria-hidden="true">
              {i + 1}
            </span>
            <div>
              <h3 className="text-[17px] font-semibold tracking-[-0.01em]">{step.title}</h3>
              <p className="mt-1 text-[16px] leading-relaxed text-muted-foreground">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    );
  }
  if (block.table) {
    const { head, rows } = block.table;
    return (
      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[420px] text-left text-[15px]">
          <thead className="bg-foreground/[0.04] text-[13px] text-muted-foreground">
            <tr>
              {head.map((h, i) => (
                <th key={h} scope="col" className={cn('px-4 py-3 font-medium', i > 0 && 'text-right')}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-t border-border">
                {row.map((cell, i) =>
                  i === 0 ? (
                    <th key={i} scope="row" className="px-4 py-3 font-medium">
                      {cell}
                    </th>
                  ) : (
                    <td key={i} className={cn('px-4 py-3 text-right tabular-nums', i === row.length - 1 && 'font-semibold text-link')}>
                      {cell}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return null;
}

function Art({ art }) {
  return (
    <figure className="relative grid aspect-square place-items-center overflow-hidden rounded-3xl border border-border bg-[#0b0c0b]">
      <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_45%,rgb(213_246_107/0.16),transparent_70%)]" aria-hidden="true" />
      <img
        src={art.src}
        alt={art.alt}
        width={art.width}
        height={art.height}
        className={cn('relative', art.fit === 'art' ? 'size-full object-cover' : art.fit === 'logo' ? 'w-1/2' : 'w-4/5')}
        decoding="async"
      />
    </figure>
  );
}

function CaseLink({ link }) {
  if (link.action === 'byte') return <AskByte label={link.label} variant={link.primary ? 'default' : 'outline'} />;
  return (
    <Button asChild variant={link.primary ? 'default' : 'outline'}>
      <a href={link.href} target="_blank" rel="noopener noreferrer">
        {link.label}
        <ArrowUpRight aria-hidden="true" />
      </a>
    </Button>
  );
}

export function CaseStudy({ study }) {
  const url = `${SITE}/projects/${study.slug}`;
  const others = CASE_STUDIES.filter((s) => s.slug !== study.slug);
  const author = { '@type': 'Person', '@id': `${SITE}/#person`, name: RESUME.name, url: `${SITE}/` };
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${url}#article`,
        headline: study.title,
        description: study.description,
        url,
        mainEntityOfPage: url,
        datePublished: study.published,
        dateModified: new Date().toISOString().slice(0, 10),
        inLanguage: 'en',
        image: `${SITE}${study.og}`,
        author,
        publisher: author,
        keywords: study.stack.join(', '),
        about: { '@type': 'SoftwareSourceCode', name: study.project, codeRepository: study.code, ...(study.demo && { url: study.demo }) },
        isPartOf: { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: 'Ali Mehdi Khan Portfolio' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: RESUME.name, item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: study.project, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <a href="#case" className="skip">
        Skip to the case study
      </a>

      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-1 text-lg font-semibold tracking-[-0.02em] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40">
            AMK
            <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
            <span className="sr-only">, Ali Mehdi Khan, home</span>
          </Link>
          <nav aria-label="Site" className="flex items-center gap-1 sm:gap-2">
            <Link href="/#projects" className="hidden rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex">
              Projects
            </Link>
            <Link href="/#contact" className="hidden rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex">
              Contact
            </Link>
            <ThemeToggle />
            <Button asChild size="sm" className="h-10 px-4">
              <a href={RESUME.resumePath} download={RESUME.resumeDownloadName}>
                <Download aria-hidden="true" />
                Résumé
              </a>
            </Button>
          </nav>
        </div>
      </header>

      <main id="case" tabIndex={-1} className="outline-none">
        <article className="container-page pt-8 pb-20 md:pt-12" aria-labelledby="case-title">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-foreground">
                  {RESUME.name}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/#projects" className="hover:text-foreground">
                  Projects
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-foreground">
                {study.project}
              </li>
            </ol>
          </nav>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
            <div>
              <p className="text-xs font-semibold tracking-[0.08em] text-link uppercase">{study.tag}</p>
              <h1 id="case-title" className="mt-3 text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.06] tracking-[-0.03em]">
                {study.title}
              </h1>
              {study.summary.map((p) => (
                <p key={p} className="mt-5 max-w-[62ch] text-lg leading-relaxed text-foreground/85">
                  {p}
                </p>
              ))}
              <div className="mt-8 flex flex-wrap gap-3">
                {study.links.map((link) => (
                  <CaseLink key={link.label} link={link} />
                ))}
              </div>
            </div>
            <Art art={study.art} />
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {study.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse justify-end gap-2 rounded-3xl border border-border bg-card p-5 md:p-6">
                <dt className="text-sm leading-snug text-muted-foreground">{stat.label}</dt>
                <dd className="text-2xl font-semibold tracking-[-0.03em] text-link md:text-3xl">{stat.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
            <div className="max-w-[70ch]">
              {study.sections.map((section) => {
                const id = slugify(section.heading);
                return (
                  <section key={id} aria-labelledby={id} className="mt-14 scroll-mt-24 first:mt-0">
                    <h2 id={id} className="text-[clamp(1.6rem,2.6vw,2rem)] leading-tight font-semibold tracking-[-0.025em]">
                      {section.heading}
                    </h2>
                    {section.body.map((block, i) => (
                      <Block key={i} block={block} />
                    ))}
                  </section>
                );
              })}
            </div>

            <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-3xl border border-border bg-card p-6">
                <h2 className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">Built with</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {study.stack.map((t) => (
                    <li key={t} className="inline-flex min-h-9 items-center gap-2 rounded-full border border-border px-3 text-[13px] text-muted-foreground has-[.logo-plate]:pl-1.5">
                      <SkillLogo name={t} size={14} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <nav aria-label="More case studies" className="rounded-3xl border border-border bg-card p-6">
                <h2 className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">More case studies</h2>
                <ul className="mt-3">
                  {others.map((s) => (
                    <li key={s.slug} className="border-t border-border first:border-t-0">
                      <Link href={`/projects/${s.slug}`} className="group flex items-center justify-between gap-3 py-3 text-[15px] font-medium hover:text-link">
                        {s.project}
                        <ChevronRight className="size-4 shrink-0 text-muted-foreground group-hover:text-link" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          </div>

          <section aria-labelledby="hire-title" className="mt-20 rounded-3xl border border-border bg-card p-8 md:p-12">
            <h2 id="hire-title" className="max-w-[24ch] text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.1] tracking-[-0.028em]">
              Hiring for work like <em>this</em>?
            </h2>
            <p className="mt-4 max-w-[60ch] text-muted-foreground">
              I&apos;m open to entry-level software engineering and AI/ML roles, in India or abroad, and I can join immediately. Email is the quickest way to reach me.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <a href={`mailto:${RESUME.email}`}>
                  <Mail aria-hidden="true" />
                  Email me
                </a>
              </Button>
              <AskByte label="Ask Byte about me" />
              <Button asChild variant="outline">
                <Link href="/">
                  See the whole portfolio
                  <ChevronRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </section>
        </article>
      </main>

      <footer className="border-t border-border">
        <div className="container-page flex flex-col gap-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {RESUME.name} · {RESUME.location}
          </p>
          <div className="flex flex-wrap gap-5">
            <a href={RESUME.github} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
              GitHub
            </a>
            <a href={RESUME.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
              LinkedIn
            </a>
            <a href={`mailto:${RESUME.email}`} className="hover:text-foreground">
              Email
            </a>
            <Link href="/" className="hover:text-foreground">
              Portfolio
            </Link>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </>
  );
}
