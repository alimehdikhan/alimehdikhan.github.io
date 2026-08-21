/* Editorial section header: display-face title, mono index label, hairline rule. */
export function SectionHead({ title, index, label, titleId }) {
  return (
    <div className="head rev">
      <h2 id={titleId}>{title}</h2>
      <span className="idx">
        {index} — {label}
      </span>
    </div>
  );
}
