import { SectionHead } from './ui/SectionHead';
import { RESUME } from '../data/resume';
import { ProjectMotion } from './fx/ProjectMotion';
import { Counter } from './fx/Counter';

function ArrowIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function CodeIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function Projects() {
  return (
    <section id="projects" className="sec work" aria-labelledby="projects-title">
      <SectionHead title="Featured Projects" index="04" label="Portfolio" titleId="projects-title" />
      <ProjectMotion titles={RESUME.projects.map(project => project.title)} />
      <div className="project-window">
        <div className="project-track">
          {RESUME.projects.map((proj, i) => (
            <article key={proj.title} id={`project-${i + 1}`} className={`project-case project-case--${i + 1}`} aria-labelledby={`project-title-${i + 1}`} tabIndex={-1}>
              <header className="project-intro">
                <div className="project-category"><span>{proj.tag}</span><span className="project-number">{String(i + 1).padStart(2, '0')}</span></div>
                <h3 id={`project-title-${i + 1}`} data-project-preview={`/assets/images/project-${i + 1}.svg`}>{proj.title}</h3>
                <div className="project-actions">
                  {proj.demo && <a className="project-action project-action--primary" href={proj.demo} target="_blank" rel="noopener noreferrer" aria-label={`View live demo of ${proj.title}`}><span>Live Demo</span><ArrowIcon /></a>}
                  <a className={`project-action${proj.demo ? '' : ' project-action--primary'}`} href={proj.github} target="_blank" rel="noopener noreferrer" aria-label={`View code for ${proj.title} on GitHub`}><CodeIcon /><span>Code</span></a>
                </div>
              </header>
              <div className="project-copy">
                <div className="project-overview">
                  <h4>Overview</h4>
                  <p>{proj.overview}</p>
                </div>
                <ul className="project-technologies" aria-label="Technologies">
                  {proj.tech.map(t => <li key={t}>{t}</li>)}
                </ul>
                <div className="project-implementation">
                  <h4>Implementation</h4>
                  <p>{proj.features}</p>
                </div>
              </div>
              <div className="project-visual" aria-hidden="true">
                <img className="project-sculpture" src={`/assets/images/project-${i + 1}.svg`} alt="" width="800" height="800" loading="lazy" decoding="async" />
                <div className="project-visual-caption"><span>{proj.tech[i === 0 ? 2 : 1]}</span><span>{proj.tech[i === 0 ? 1 : 3]}</span></div>
              </div>
              <div className="project-bottom">
                <div className="project-result">
                  <h4>Results</h4>
                  <p>{proj.outcome.startsWith('90%+') ? <><Counter to={90} suffix="%+" delay={0} />{proj.outcome.slice(4)}</> : proj.outcome}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
