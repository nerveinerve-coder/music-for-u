// 카드 컴포넌트 - 내용을 담는 흰색 박스예요

export function Card({ children, className = '', padding = 'md' }) {
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        bg-white rounded-3xl shadow-sm border border-[var(--color-border)]
        ${paddingStyles[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
