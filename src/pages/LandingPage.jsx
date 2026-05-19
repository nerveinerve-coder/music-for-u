import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { LangSelector } from '../components/LangSelector';
import { useLang } from '../hooks/useLang';
import { translations } from '../utils/i18n';

export function LandingPage() {
  const { lang } = useLang();
  const T = translations[lang].landing;
  const nav = translations[lang].nav;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0F0F14', color: '#F0F0F5' }}>

      {/* 네비게이션 */}
      <nav className="px-5 py-5 flex items-center justify-between max-w-lg mx-auto">
        <span className="font-display text-xl font-bold" style={{ color: '#F0F0F5' }}>
          Music for U
        </span>
        {/* 언어 선택기로 교체 */}
        <LangSelector />
      </nav>

      {/* Hero */}
      <section className="max-w-lg mx-auto px-5 pt-10 pb-16 text-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ backgroundColor: 'rgba(107,163,214,0.12)', color: '#6BA3D6', border: '1px solid rgba(107,163,214,0.2)' }}>
            {T.badge}
          </div>

          <h1 className="font-display text-4xl font-bold leading-tight mb-5" style={{ color: '#F0F0F5' }}>
            {T.heroTitle1}<br />
            <span style={{ color: '#6BA3D6' }}>{T.heroTitle2}</span>
            {T.heroTitle3}
          </h1>

          <p className="text-base leading-relaxed mb-8 animate-fade-in-up delay-100 whitespace-pre-line" style={{ color: '#9090A8' }}>
            {T.heroSub}
          </p>

          <div className="flex flex-col items-center gap-3 animate-fade-in-up delay-200">
            <Link to="/gift-form" className="w-full max-w-xs">
              <Button fullWidth size="lg">{T.heroCta}</Button>
            </Link>
            <p className="text-xs" style={{ color: '#5A5A70' }}>{T.heroNote}</p>
          </div>
        </div>

        {/* 미리보기 카드 */}
        <div className="mt-12 animate-fade-in delay-300">
          <div className="rounded-3xl overflow-hidden mx-auto max-w-sm text-left"
            style={{ backgroundColor: '#1A1A24', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="p-5" style={{
              background: 'linear-gradient(135deg, #1A2A3F 0%, #1A1A24 100%)',
              borderBottom: '1px solid rgba(255,255,255,0.06)'
            }}>
              <p className="text-xs mb-1 font-medium tracking-widest uppercase" style={{ color: '#6BA3D6', opacity: 0.7 }}>
                {T.giftCardFor}
              </p>
              <p className="font-display text-2xl font-bold" style={{ color: '#F0F0F5' }}>
                {lang === 'ja' ? 'みほさん' : lang === 'en' ? 'Jamie' : '지민님'}
              </p>
              <p className="text-xs mt-1" style={{ color: '#9090A8' }}>{T.giftCardFrom} {lang === 'ja' ? 'けんと' : lang === 'en' ? 'Sarah' : '은석'}</p>
            </div>
            <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="font-display italic leading-relaxed" style={{ color: '#F0F0F5', fontSize: '15px' }}>
                {T.giftCardSample}
              </p>
            </div>
            <div className="px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                style={{ backgroundColor: 'rgba(107,163,214,0.15)' }}>🎵</div>
              <div>
                <p className="text-sm font-medium" style={{ color: '#6BA3D6' }}>{T.giftCardMusicReady}</p>
                <p className="text-xs" style={{ color: '#5A5A70' }}>{T.giftCardMusicInfo}</p>
              </div>
              <div className="ml-auto w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#6BA3D6' }}>
                <span style={{ color: '#0F0F14', fontSize: '12px' }}>▶</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Section */}
      <section className="py-14 px-5" style={{ backgroundColor: '#13131A' }}>
        <div className="max-w-lg mx-auto">
          <h2 className="text-center text-xl font-bold mb-2" style={{ color: '#F0F0F5' }}>{T.valueSectionTitle}</h2>
          <p className="text-center text-sm mb-8" style={{ color: '#9090A8' }}>{T.valueSectionSub}</p>
          <div className="flex flex-col gap-3">
            {T.valueCards.map((card, i) => (
              <div key={i} className="rounded-2xl p-5 flex items-start gap-4"
                style={{ backgroundColor: '#1A1A24', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: 'rgba(107,163,214,0.12)' }}>{card.emoji}</div>
                <div>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: '#F0F0F5' }}>{card.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#9090A8' }}>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-14 px-5" style={{ backgroundColor: '#0F0F14' }}>
        <div className="max-w-lg mx-auto">
          <h2 className="text-center text-xl font-bold mb-2" style={{ color: '#F0F0F5' }}>{T.howTitle}</h2>
          <p className="text-center text-sm mb-8" style={{ color: '#9090A8' }}>{T.howSub}</p>
          <ol className="flex flex-col gap-0">
            {T.howSteps.map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                    style={{ backgroundColor: 'rgba(107,163,214,0.12)' }}>{item.icon}</div>
                  {i < T.howSteps.length - 1 && (
                    <div className="w-px h-7 mt-1" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
                  )}
                </div>
                <div className={`pt-2 ${i < T.howSteps.length - 1 ? 'pb-5' : ''}`}>
                  <p className="text-xs mb-0.5" style={{ color: '#5A5A70' }}>{item.step}</p>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: '#F0F0F5' }}>{item.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#9090A8' }}>{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-5 text-center"
        style={{ background: 'linear-gradient(180deg, #13131A 0%, #0F0F14 100%)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-lg mx-auto">
          <h2 className="font-display text-2xl font-bold mb-3" style={{ color: '#F0F0F5' }}>{T.ctaTitle}</h2>
          <p className="text-sm mb-8" style={{ color: '#9090A8' }}>{T.ctaSub}</p>
          <Link to="/gift-form" className="inline-block w-full max-w-xs">
            <Button fullWidth size="lg">{T.heroCta}</Button>
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-8 px-5 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="font-display font-bold mb-2" style={{ color: '#6BA3D6' }}>Music for U</p>
        <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: '#5A5A70' }}>{T.footerNote}</p>
      </footer>
    </div>
  );
}
