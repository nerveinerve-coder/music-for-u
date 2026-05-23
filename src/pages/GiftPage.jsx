import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchGiftData } from '../utils/api';
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

export function GiftPage() {
  const { giftId } = useParams();
  const { lang } = useLang();
  const T = translations[lang].gift;
  const [gift, setGift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!giftId) { setError(T.errorSub); setLoading(false); return; }
    fetchGiftData(giftId)
      .then(data => { setGift(data); setLoading(false); })
      .catch(() => { setError(T.errorSub); setLoading(false); });
  }, [giftId]);

  const handleCopyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); } catch { }
    setCopied(true); setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = async () => {
    if (!gift?.driveUrl) return;
    setDownloading(true);
    try {
      const response = await fetch(gift.driveUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'music-gift.wav';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(gift.driveUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

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

  const isReady = gift?.status === '제작 완료' && gift?.driveUrl;
  const urlType = getUrlType(gift?.driveUrl);
  const drivePreviewUrl = urlType === 'drive' ? getDrivePreviewUrl(gift?.driveUrl) : null;
  const cleanLyrics = stripBrackets(gift?.lyrics);
  const hasLyrics = cleanLyrics && cleanLyrics.length > 0;
  const hasMessage = gift?.message && gift.message.trim().length > 0;

  const receiverLabel = lang === 'ko'
    ? `${gift?.receiverName}님에게 전하는 선물`
    : lang === 'ja'
    ? `${gift?.receiverName}さんへのギフト`
    : `A gift for ${gift?.receiverName}`;

  const musicInfoRows = [
    [T.musicInfoRows[0], gift?.artistName],
    [T.musicInfoRows[1], gift?.songTitle],
    [T.musicInfoRows[2], gift?.moods],
    gift?.mbti ? [T.musicInfoRows[3], gift.mbti] : null,
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
        <div className="rounded-3xl overflow-hidden animate-scale-in"
          style={{
            backgroundColor: '#1A1A24',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
          }}>

          {/* 헤더 — MyMusicPage 스타일 따름 */}
          <div className="px-7 py-8 text-center"
            style={{
              background: 'linear-gradient(135deg, #1F1A2E 0%, #1A1A2E 100%)',
              borderBottom: '1px solid rgba(255,255,255,0.06)'
            }}>
            {/* 선물 아이콘 */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
              style={{ backgroundColor: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.2)' }}>
              <span className="text-2xl">🎁</span>
            </div>

            {/* [받는 사람 이름]에게 전하는 선물 */}
            <p className="text-xs font-medium tracking-widest uppercase mb-2"
              style={{ color: '#C9A96E', opacity: 0.8 }}>
              {receiverLabel}
            </p>

            {/* MBTI */}
            {gift?.mbti && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3"
                style={{ backgroundColor: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)' }}>
                <span className="font-display text-sm font-bold tracking-widest" style={{ color: '#C9A96E' }}>
                  {gift.mbti}
                </span>
              </div>
            )}

            {/* Suno Title */}
            <h1 className="font-display text-2xl font-bold mb-2" style={{ color: '#F0F0F5' }}>
              {gift?.sunoTitle || `${gift?.artistName} × ${gift?.songTitle}`}
            </h1>

            {/* 분위기 */}
            <p className="text-sm" style={{ color: '#9090A8' }}>
              {(gift?.moods || '').split(', ').join(' · ')}
            </p>
          </div>

          {/* 음악 영역 */}
          <div className="px-7 py-6">
            {isReady ? (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-center tracking-widest uppercase" style={{ color: '#5A5A70' }}>
                  {T.arrived}
                </p>

                {/* Cloudinary: 직접 재생 */}
                {urlType === 'cloudinary' && (
                  <div className="rounded-2xl p-4"
                    style={{ backgroundColor: 'rgba(107,163,214,0.08)', border: '1px solid rgba(107,163,214,0.2)' }}>
                    <p className="text-xs text-center mb-3" style={{ color: '#9090A8' }}>
                      {lang === 'ja' ? '🎵 再生する' : lang === 'en' ? '🎵 Play now' : '🎵 바로 재생해보세요'}
                    </p>
                    <audio controls preload="metadata" className="w-full" aria-label="음악 선물 재생">
                      <source src={gift.driveUrl} />
                    </audio>
                  </div>
                )}

                {/* Cloudinary 다운로드 버튼 */}
                {urlType === 'cloudinary' && (
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={downloading}
                    className="flex items-center justify-center gap-2 mt-1 w-full py-2.5 rounded-xl text-sm font-medium transition-colors"
                    style={{ backgroundColor: 'rgba(107,163,214,0.15)', color: '#6BA3D6', cursor: 'pointer' }}
                    aria-label="음악 다운로드">
                    {downloading
                      ? <><span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span>{lang === 'ja' ? 'ダウンロード中...' : lang === 'en' ? 'Downloading...' : '다운로드 중...'}</span></>
                      : <><span>⬇️</span>
                          <span>{lang === 'ja' ? '音楽をダウンロード' : lang === 'en' ? 'Download music' : '음악 다운로드'}</span></>
                    }
                  </button>
                )}

                {/* Drive: iframe 재생 */}
                {urlType === 'drive' && drivePreviewUrl && (
                  <div className="rounded-2xl overflow-hidden"
                    style={{ border: '1px solid rgba(107,163,214,0.2)', backgroundColor: '#111' }}>
                    <iframe src={drivePreviewUrl} width="100%" height="80"
                      allow="autoplay" title="음악 선물 재생"
                      style={{ display: 'block', border: 'none' }} />
                  </div>
                )}

                {/* Drive 열기 버튼 */}
                {urlType === 'drive' && (
                  <a href={gift.driveUrl} target="_blank" rel="noopener noreferrer">
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
                        <span className="text-sm font-medium" style={{ color: '#F0F0F5' }}>
                          {lang === 'ja' ? '歌詞' : lang === 'en' ? 'Lyrics' : '가사'}
                        </span>
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

                {/* 메시지 토글 — 가사와 음악정보 사이 */}
                {hasMessage && (
                  <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(201,169,110,0.2)' }}>
                    <button type="button" onClick={() => setMessageOpen(prev => !prev)}
                      aria-expanded={messageOpen}
                      className="w-full flex items-center justify-between px-4 py-3 transition-colors"
                      style={{ backgroundColor: messageOpen ? 'rgba(201,169,110,0.08)' : 'rgba(201,169,110,0.04)', cursor: 'pointer' }}>
                      <div className="flex items-center gap-2">
                        <span style={{ color: '#C9A96E', fontSize: '14px' }}>💌</span>
                        <span className="text-sm font-medium" style={{ color: '#F0F0F5' }}>
                          {'From. ' + gift?.senderName}
                        </span>
                      </div>
                      <span style={{
                        color: '#9090A8', fontSize: '11px',
                        transform: messageOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.25s ease', display: 'inline-block',
                      }}>▼</span>
                    </button>
                    {messageOpen && (
                      <div className="px-5 py-4"
                        style={{ borderTop: '1px solid rgba(201,169,110,0.12)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap font-display italic"
                          style={{ color: '#F0F0F5' }}>
                          "{gift?.message}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-4xl mb-4 animate-pulse-soft">🎵</div>
                <h2 className="text-base font-semibold mb-2" style={{ color: '#F0F0F5' }}>{T.preparing}</h2>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#9090A8' }}>{T.preparingSub}</p>
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
            <Button fullWidth variant="ghost">{T.makeYours}</Button>
          </Link>
          <Link to="/">
            <Button fullWidth variant="ghost">
              {lang === 'ja' ? 'ホームへ' : lang === 'en' ? 'Go to home' : '홈으로 가기'}
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
