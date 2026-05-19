export function Input({
  label, id, value, onChange, placeholder, helpText,
  errorMessage, required = false, type = 'text', className = '', autoComplete,
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[#F0F0F5]">
          {label}
          {required && <span className="text-[#6BA3D6] ml-1" aria-label="필수 항목">*</span>}
        </label>
      )}
      {helpText && <p className="text-xs text-[#9090A8] -mt-0.5">{helpText}</p>}
      <input
        id={id} type={type} value={value} onChange={onChange}
        placeholder={placeholder} required={required} autoComplete={autoComplete}
        aria-invalid={!!errorMessage}
        className={`w-full px-4 py-3.5 rounded-2xl text-base bg-[#1A1A24] border transition-all duration-200 placeholder:text-[#5A5A70] text-[#F0F0F5] focus:outline-none ${
          errorMessage
            ? 'border-[#FF6B6B] bg-[rgba(255,107,107,0.08)]'
            : 'border-white/8 hover:border-white/15 focus:border-[#6BA3D6]'
        }`}
      />
      {errorMessage && (
        <p role="alert" className="text-xs text-[#FF6B6B] flex items-center gap-1">
          <span aria-hidden="true">⚠️</span>{errorMessage}
        </p>
      )}
    </div>
  );
}

export function Textarea({
  label, id, value, onChange, placeholder, helpText,
  errorMessage, required = false, rows = 3, maxLength, className = '',
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[#F0F0F5]">
          {label}
          {required && <span className="text-[#6BA3D6] ml-1" aria-label="필수 항목">*</span>}
        </label>
      )}
      {helpText && <p className="text-xs text-[#9090A8] -mt-0.5">{helpText}</p>}
      <div className="relative">
        <textarea
          id={id} value={value} onChange={onChange}
          placeholder={placeholder} required={required}
          rows={rows} maxLength={maxLength} aria-invalid={!!errorMessage}
          className={`w-full px-4 py-3.5 rounded-2xl text-base resize-none bg-[#1A1A24] border transition-all duration-200 placeholder:text-[#5A5A70] text-[#F0F0F5] focus:outline-none ${
            errorMessage
              ? 'border-[#FF6B6B] bg-[rgba(255,107,107,0.08)]'
              : 'border-white/8 hover:border-white/15 focus:border-[#6BA3D6]'
          }`}
        />
        {maxLength && (
          <span className="absolute bottom-3 right-3 text-xs text-[#5A5A70]">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      {errorMessage && (
        <p role="alert" className="text-xs text-[#FF6B6B] flex items-center gap-1">
          <span aria-hidden="true">⚠️</span>{errorMessage}
        </p>
      )}
    </div>
  );
}
