export function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-white/20";
  const variants = {
    primary: "bg-white text-black hover:bg-gray-200 px-5 py-2.5 text-sm",
    secondary: "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 px-5 py-2.5 text-sm backdrop-blur-md",
    ghost: "text-gray-400 hover:text-white px-3 py-1.5 text-sm hover:bg-white/5",
  };

  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
    fontSize: '0.875rem',
    borderRadius: 'var(--radius-sm)',
    transition: 'all var(--transition-fast)',
    padding: variant === 'ghost' ? '0.5rem 0.75rem' : '0.6rem 1.25rem',
    backgroundColor: variant === 'primary' ? 'var(--text-primary)' : variant === 'secondary' ? 'var(--card-bg)' : 'transparent',
    color: variant === 'primary' ? 'var(--bg-color)' : 'var(--text-primary)',
    border: variant === 'secondary' ? '1px solid var(--card-border)' : '1px solid transparent',
  };

  // Pseudo classes are hard to do inline without styled-components/tailwind.
  // We'll map variants to a class structure that we can augment in globals.css, or just use inline style for base and css for hover if needed.
  // Since we don't have tailwind, we will create CSS classes for these.
  
  return (
    <button className={`ds-btn ds-btn-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
