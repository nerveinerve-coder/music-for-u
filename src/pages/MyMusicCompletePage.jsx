import { useLocation, Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { useLang } from '../hooks/useLang';
import { translations } from '../utils/i18n';

export function MyMusicCompletePage() {
  const { state } = useLocation();
  const { lang } = useLang();
  const T = translations[lang]?.myMusic?.complete;
  const email = state?.email || '';

  if (!T) return null;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0F0F14' }}>
      <header className="px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link to="/" className="font-display text-lg font-bold" style={{ color: '#F0F0F5' }}>
          Music for U
        </Link>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-5 py-10">
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 text-4xl"
            style={{ backgroundColor: 'rgba(107,163,214,0.12)' }}>
            🎵
          </div>
          <h1 className="text-2xl font-bold mb-3 whitespace-pre-line" style={{ color: '#F0F0F5' }}>
            {T.title}
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: '#9090A8' }}>
            {T.sub2} <strong style={{ color: '#F0F0F5' }}>{email}</strong>{T.sub3}
          </p>
        </div>

        <div className="rounded-3xl p-6 mb-5 animate-fade-in-up delay-200"
          style={{ backgroundColor: '#1A1A24', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-sm font-semibold mb-5" style={{ color: '#F0F0F5' }}>{T.flowTitle}</h2>
          <div className="flex flex-col gap-0">
            {T.flowSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                    style={index === 0
                      ? { backgroundColor: '#6BA3D6', color: '#0F0F14' }
                      : { backgroundColor: 'rgba(255,255,255,0.06)', color: '#9090A8' }}>
                    {['✅', '🎵', '🎧', '📧'][index]}
                  </div>
                  {index < T.flowSteps.length - 1 && (
                    <div className="w-px h-6 mt-1" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
                  )}
                </div>
                <div className="pt-1.5 pb-4">
                  <p className="text-sm" style={{ color: index === 0 ? '#6BA3D6' : '#9090A8', fontWeight: index === 0 ? '500' : '400' }}>
                    {step}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-4 mb-8 animate-fade-in-up delay-300"
          style={{ backgroundColor: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.12)' }}>
          <p className="text-xs leading-relaxed" style={{ color: '#9090A8' }}>{T.tip}</p>
        </div>

        <div className="animate-fade-in-up delay-400">
          <Link to="/">
            <Button fullWidth variant="secondary" size="lg">{T.backHome}</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
