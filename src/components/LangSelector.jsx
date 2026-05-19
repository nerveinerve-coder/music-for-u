// 언어 선택 버튼 컴포넌트
// 우측 상단에 표시되는 🇰🇷 / 🇺🇸 / 🇯🇵 선택 UI예요

import { useState, useRef, useEffect } from 'react';
import { useLang } from '../hooks/useLang';
import { LANGUAGES } from '../utils/i18n';

export function LangSelector() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = LANGUAGES.find(l => l.code === lang);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    setLang(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      {/* 현재 언어 버튼 */}
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="언어 선택"
        className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200"
        style={{
          backgroundColor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#F0F0F5',
        }}
      >
        <span>{current?.flag}</span>
        <span style={{ color: '#9090A8' }}>{current?.label}</span>
        <span
          style={{
            color: '#5A5A70',
            fontSize: '10px',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
            display: 'inline-block',
          }}
        >
          ▼
        </span>
      </button>

      {/* 드롭다운 메뉴 */}
      {open && (
        <div
          role="listbox"
          aria-label="언어 목록"
          className="absolute right-0 mt-2 rounded-2xl overflow-hidden z-50"
          style={{
            backgroundColor: '#1A1A24',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
            minWidth: '130px',
          }}
        >
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              role="option"
              aria-selected={lang === l.code}
              type="button"
              onClick={() => handleSelect(l.code)}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-left transition-colors"
              style={{
                backgroundColor: lang === l.code ? 'rgba(107,163,214,0.1)' : 'transparent',
                color: lang === l.code ? '#6BA3D6' : '#F0F0F5',
              }}
            >
              <span>{l.flag}</span>
              <span className="font-medium">{l.label}</span>
              {lang === l.code && <span className="ml-auto" style={{ color: '#6BA3D6', fontSize: '12px' }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
