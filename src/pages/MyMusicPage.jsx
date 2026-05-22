import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMyMusicData } from '../utils/api';
import { Button } from '../components/Button';
import { useLang } from '../hooks/useLang';
import { translations } from '../utils/i18n';

// [대괄호] 안의 내용을 제거하는 함수
function stripBrackets(text) {
  if (!text) return '';
  return text.replace(/\[.*?\]/g, '').replace(/\n{3,}/g, '\n\n').trim();
}

function getUrlType(url) {
  if (!url) return null;
  if (url.includes('res.cloudinary.com')) return 'cloudinary';
  if (url.includes('drive.google.com')) return 'drive';
  return null;
}

function getDrivePreviewUrl(driveUrl) {
  if (!driveUrl) return null;
  const match = driveUrl.match(/\/file\/d\/([^/]+)/);
  if (!match) return null;
  return `https://drive.google.com/file/d/${match[1]}/preview`;
}

export function MyMusicPage() {
  const { myId } = useParams();
  const { lang } = useLang();
  const T = translations[lang]?.myMusic?.page;
  const [myMusic, setMyMusic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!myId) { setError(T?.errorSub || ''); setLoading(false); return; }
    fetchMyMusicData(myId)
      .then(data => { setMyMusic(data); setLoading(false); })
      .catch(() => { setError(T?.errorSub || ''); setLoading(false); });
  }, [myId]);

  const handleCopyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); } catch { }
    setCopied(true); setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = async () => {
    if (!myMusic?.musicUrl) return;
    setDownloading(true);
    try {
      const response = await fetch(myMusic.musicUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my-music.wav';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(myMusic.musicUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  if (!T) return null;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F0F14' }}>
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mb-4"
          style={{ borderColor: '#6BA3D6', borderTopColor: 'transparent' }} />
        <p className="text-sm animate-pulse-soft" style={{ color: '#9090A8' }}>{T.loading}</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5" style={{ backgroundColor: '#0F0F14' }}>
      <div className="text-center max-w-sm">
        <div className="text-4xl mb-4">😢</div>
        <h1 className="text-lg font-semibold mb-2" style={{ color: '#F0F0F5' }}>{T.errorTitle}</h1>
        <p className="text-sm mb-6" style={{ color: '#9090A8' }}>{error}</p>
        <Link to="/"><Button variant="secondary">{T.backHome}</Button></Link>
      </div>
    </div>
  );

  const isReady = myMusic?.status === '제작 완료' && myMusic?.musicUrl;
  const urlType = getUrlType(myMusic?.musicUrl);
  const drivePreviewUrl = urlType === 'drive' ? getDrivePreviewUrl(myMusic?.musicUrl) : null;
  const cleanLyrics = stripBrackets(myMusic?.lyrics);
  const hasLyrics = cleanLyrics && cleanLyrics.length > 0;

  const musicInfoRows = [
    [T.musicInfoRows[0], myMusic?.artistName],
    [T.musicInfoRows[1], myMusic?.songTitle],
    [T.musicInfoRows[2], myMusic?.moods],
    myMusic?.mbti ? [T.musicInfoRows[3], myMusic.mbti] : null,
  ].filter(Boolean);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0A0A14 0%, #0F0F14 40%)' }}>
      <header className="px-5 py-5 text-center">
        <Link to="/" className="font-display text-base font-bold opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: '#6BA3D6' }}>
          Music for U
        </Link>
      </header>

      <main className="max-w-md mx-auto px-5 pb-16">
        {/* 메인 카드 */}
        <div className="rounded-3xl overflow-hidden animate-scale-in"
          style={{
            backgroundColor: '#1A1A24',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
          }}>

          {/* 헤더 — '나를 위한 음악' 느낌 */}
          <div className="px-7 py-8 text-center"
            style={{
              background: 'linear-gradient(135deg, #0F1A2E 0%, #1A1A2E 100%)',
              borderBottom: '1px solid rgba(255,255,255,0.06)'
            }}>
            {/* 음표 아이콘 */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
              style={{ backgroundColor: 'rgba(107,163,214,0.15)', border: '1px solid rgba(107,163,214,0.2)' }}>
              <span className="text-2xl">🎵</span>
            </div>
            <p className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: '#6BA3D6', opacity: 0.7 }}>
              {T.title}
            </p>
            {/* MBTI 표시 */}
            {myMusic?.mbti && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3"
                style={{ backgroundColor: 'rgba(107,163,214,0.1)', border: '1px solid rgba(107,163,214,0.2)' }}>
                <span className="font-display text-sm font-bold tracking-widest" style={{ color: '#6BA3D6' }}>
                  {myMusic.mbti}
                </span>
              </div>
            )}
            <h1 className="font-display text-2xl font-bold" style={{ color: '#F0F0F5' }}>
              {myMusic?.artistName} × {myMusic?.songTitle}
            </h1>
            <p className="text-sm mt-2" style={{ color: '#9090A8' }}>
              {(myMusic?.moods || '').split(', ').join(' · ')}
            </p>
          </div>

          {/* 음악 재생 영역 — 가장 돋보이게 */}
          <div className="px-7 py-6">
            {isReady ? (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-center tracking-widest uppercase" style={{ color: '#5A5A70' }}>
                  {T.arrived}
                </p>

                {/* Cloudinary: 직접 재생 (빠름) */}
                {urlType === 'cloudinary' && (
                  <div className="rounded-2xl p-4"
                    style={{ backgroundColor: 'rgba(107,163,214,0.08)', border: '1px solid rgba(107,163,214,0.2)' }}>
                    <p className="text-xs text-center mb-3" style={{ color: '#9090A8' }}>{T.playNow}</p>
                    <audio controls preload="metadata" className="w-full" aria-label="내 음악 재생">
                      <source src={myMusic.musicUrl} />
                    </audio>
                  </div>
                )}

                {/* Drive: iframe 재생 */}
                {urlType === 'drive' && drivePreviewUrl && (
                  <div className="rounded-2xl overflow-hidden"
                    style={{ border: '1px solid rgba(107,163,214,0.2)', backgroundColor: '#111' }}>
                    <iframe src={drivePreviewUrl} width="100%" height="80"
                      allow="autoplay" title="내 음악 재생"
                      style={{ display: 'block', border: 'none' }} />
                  </div>
                )}

                {/* 다운로드 버튼 — 가장 돋보이게 Primary로 */}
                {urlType === 'cloudinary' && (
                  <Button onClick={handleDownload} fullWidth size="lg" loading={downloading} disabled={downloading}>
                    {downloading ? T.downloading : T.download}
                  </Button>
                )}

                {/* Drive 열기 버튼 */}
                {urlType === 'drive' && (
                  <a href={myMusic.musicUrl} target="_blank" rel="noopener noreferrer">
                    <Button fullWidth size="lg">{T.openDrive}</Button>
                  </a>
                )}

                {/* 가사 토글 */}
                {hasLyrics && (
                  <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                    <button type="button" onClick={() => setLyricsOpen(prev => !prev)}
                      aria-expanded={lyricsOpen}
                      className="w-full flex items-center justify-between px-4 py-3 transition-colors"
                      style={{ backgroundColor: lyricsOpen ? 'rgba(107,163,214,0.1)' : 'rgba(255,255,255,0.04)', cursor: 'pointer' }}>
                      <div className="flex items-center gap-2">
                        <span style={{ color: '#6BA3D6', fontSize: '14px' }}>♪</span>
                        <span className="text-sm font-medium" style={{ color: '#F0F0F5' }}>{T.lyricsLabel}</span>
                      </div>
                      <span style={{
                        color: '#9090A8', fontSize: '11px',
                        transform: lyricsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.25s ease', display: 'inline-block',
                      }}>▼</span>
                    </button>
                    {lyricsOpen && (
                      <div className="px-5 py-4"
                        style={{ borderTop: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                        <p className="text-sm leading-loose whitespace-pre-wrap" style={{ color: '#C8C8D8' }}>
                          {cleanLyrics}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="text-4xl mb-4 animate-pulse-soft">🎵</div>
                <h2 className="text-base font-semibold mb-2" style={{ color: '#F0F0F5' }}>{T.preparing}</h2>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#9090A8' }}>
                  {T.preparingSub}
                </p>
              </div>
            )}
          </div>

          {/* 음악 정보 */}
          {isReady && (
            <div className="px-7 pb-6">
              <div className="rounded-2xl p-4"
                style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-xs mb-3 font-medium tracking-widest uppercase" style={{ color: '#5A5A70' }}>
                  {T.musicInfoLabel}
                </p>
                <div className="flex flex-col gap-2 text-xs">
                  {musicInfoRows.map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4">
                      <span style={{ color: '#9090A8' }}>{label}</span>
                      <span className="font-medium text-right" style={{ color: '#F0F0F5' }}>{value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-3 pt-3 leading-relaxed"
                  style={{ color: '#5A5A70', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {T.copyright}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="mt-5 flex flex-col gap-3 animate-fade-in-up delay-300">
          <Button onClick={handleCopyLink} fullWidth variant="secondary">
            {copied ? T.copied : T.copyLink}
          </Button>
          <Link to="/gift-form">
            <Button fullWidth variant="ghost">{T.makeGift}</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
