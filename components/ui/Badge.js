export function Badge({ children, className = '' }) {
  return (
    <span className={`ds-badge ${className}`}>
      {children}
    </span>
  );
}
