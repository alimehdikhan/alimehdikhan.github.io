import { Reveal } from '../fx/Reveal';

export function SectionHead({title,index,label,titleId}) {
  return <Reveal className="head" rise={false}>
    <span className="line"><h2 id={titleId}>{title}</h2></span>
    <span className="idx">{index} — {label}</span>
    <i className="rule" aria-hidden="true"/>
  </Reveal>;
}
