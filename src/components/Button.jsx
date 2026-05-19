export function Button({
  children, onClick, type = 'button', variant = 'primary',
  size = 'md', disabled = false, loading = false,
  fullWidth = false, className = '', 'aria-label': ariaLabel,
}) {
  const base = `inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed`;

  const variants = {
    primary: `bg-[#6BA3D6] text-[#0F0F14] hover:brightness-110 active:scale-[0.97] shadow-lg`,
    secondary: `bg-[#22222F] text-[#F0F0F5] border border-white/10 hover:bg-[#2A2A3A] active:scale-[0.97]`,
    ghost: `bg-transparent text-[#9090A8] hover:text-[#F0F0F5] hover:bg-[#1A1A24] active:scale-[0.97]`,
    outline: `bg-transparent text-[#6BA3D6] border border-[#6BA3D6] hover:bg-[rgba(107,163,214,0.15)] active:scale-[0.97]`,
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-6 py-3 text-sm gap-2',
    lg: 'px-8 py-4 text-base gap-2',
  };

  return (
    <button
      type={type} onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel} aria-busy={loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading && <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

export function ChipButton({ label, emoji, selected, onClick, className = '' }) {
  return (
    <button
      type="button" onClick={onClick} aria-pressed={selected}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border active:scale-[0.96] ${
        selected
          ? 'bg-[#6BA3D6] text-[#0F0F14] border-[#6BA3D6] shadow-md'
          : 'bg-[#1A1A24] text-[#9090A8] border-white/8 hover:border-white/15 hover:text-[#F0F0F5]'
      } ${className}`}
    >
      {emoji && <span aria-hidden="true">{emoji}</span>}
      {label}
    </button>
  );
}
