// 앱 전체에서 선택된 언어를 공유하는 파일이에요
// "Context"란 여러 화면이 같은 정보를 함께 쓸 수 있게 해주는 도구예요

import { createContext, useContext, useState } from 'react';

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState('ko'); // 기본값: 한국어

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

// 다른 파일에서 이렇게 사용해요:
// const { lang, setLang } = useLang();
export function useLang() {
  return useContext(LangContext);
}
