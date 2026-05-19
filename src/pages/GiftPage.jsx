import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchGiftData } from '../utils/api';
import { Button } from '../components/Button';
import { useLang } from '../hooks/useLang';
import { translations } from '../utils/i18n';

// [대괄호] 안의 내용을 제거하는 함수예요
// 예: "사랑해 [Verse 1] 그대여" → "사랑해  그대여"
function stripBrackets(text) {
  if (!text) return '';
  return text.replace(/\[.*?\]/g, '').replace(/\n{3,}/g, '\n\n').trim();
}

export function GiftPage() {
  const { giftId } = useParams();
  const { lang } = useLang();
  const T = translations[lang].gift;
  const [gift, setGift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [lyricsOpen, setLyricsOpen] = useState(false); // 가사 토글 상태

  useEffect(() => {
    if (!giftId) { setError(T.errorSub); setLoading(false); return; }
    fetchGiftData(giftId)
      .then(data => { setGift(data); setLoading(false); })
      .catch(() => { setError(T.errorSub); setLoading(false); });
  }, [giftId]);

  const handleCopyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); }
    catch { /* fallback */ }
    setCopied(true); setTimeout(() => setCopied(false), 2500);
  };

  // Google Drive URL → iframe preview URL 변환
  const getPreviewUrl = (driveUrl) => {
    if (!driveUrl) return null;
    const match = driveUrl.match(/\/file\/d\/([^/]+)/);
    if (!match) return null;
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  };

  // 로딩 중
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F0F14' }}>
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mb-4"
          style={{ borderColor: '#6BA3D6', borderTopColor: 'transparent' }} />
        <p className="text-sm animate-pulse-soft" style={{ color: '#9090A8' }}>{T.loading}</p>
      </div>
    </div>
  );

  // 오류
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
  const previewUrl = getPreviewUrl(gift?.driveUrl);

  // [대괄호] 제거한 가사
  const cleanLyrics = stripBrackets(gift?.lyrics);
  const hasLyrics = cleanLyrics && cleanLyrics.length > 0;

  // 가사 토글 라벨 (언어별)
  const lyricsLabel = lang === 'ja' ? '歌詞' : lang === 'en' ? 'Lyrics' : '가사';

  const musicInfoRows = [
    [T.musicInfoRows[0], gift?.artistName],
    [T.musicInfoRows[1], gift?.songTitle],
    [T.musicInfoRows[2], gift?.moods],
    gift?.mbti ? [T.musicInfoRows[3], gift.mbti] : null,
  ].filter(Boolean);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0F1520 0%, #0F0F14 40%)' }}>
      <header className="px-5 py-5 text-center">
        <Link to="/" className="font-display text-base font-bold opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: '#6BA3D6' }}>
          Music for U
        </Link>
      </header>

      <main className="max-w-md mx-auto px-5 pb-16">
        {/* 선물 카드 */}
        <div className="rounded-3xl overflow-hidden animate-scale-in"
          style={{
            backgroundColor: '#1A1A24',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
          }}>

          {/* 카드 헤더 */}
          <div className="px-7 py-8 text-center"
            style={{
              background: 'linear-gradient(135deg, #1A2A3F 0%, #1A1A2E 100%)',
              borderBottom: '1px solid rgba(255,255,255,0.06)'
            }}>
            <p className="text-xs font-medium tracking-widest uppercase mb-3"
              style={{ color: '#6BA3D6', opacity: 0.7 }}>
              {T.giftFor}
            </p>
            <h1 className="font-display text-3xl font-bold mb-2" style={{ color: '#F0F0F5' }}>
              {gift?.receiverName}{lang === 'ko' ? '님' : lang === 'ja' ? 'さん' : ''}
            </h1>
            <p className="text-sm" style={{ color: '#9090A8' }}>From. {gift?.senderName}</p>
          </div>

          {/* 메시지 */}
          <div className="px-7 py-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-xs text-center tracking-widest uppercase mb-3" style={{ color: '#5A5A70' }}>
              {T.messageLabel}
            </p>
            <blockquote className="font-display text-lg text-center leading-relaxed italic"
              style={{ color: '#F0F0F5' }}>
              "{gift?.message}"
            </blockquote>
          </div>

          {/* 음악 영역 */}
          <div className="px-7 py-6">
            {isReady ? (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-center tracking-widest uppercase" style={{ color: '#5A5A70' }}>
                  {T.arrived}
                </p>

                {/* Google Drive iframe 플레이어 */}
                {previewUrl ? (
                  <div className="rounded-2xl overflow-hidden"
                    style={{ border: '1px solid rgba(107,163,214,0.2)', backgroundColor: '#111' }}>
                    <iframe
                      src={previewUrl}
                      width="100%"
                      height="80"
                      allow="autoplay"
                      title="음악 선물 재생"
                      style={{ display: 'block', border: 'none' }}
                    />
                  </div>
                ) : (
                  <div className="rounded-2xl p-5 text-center"
                    style={{ backgroundColor: 'rgba(107,163,214,0.08)', border: '1px solid rgba(107,163,214,0.15)' }}>
                    <div className="text-3xl mb-2">🎵</div>
                    <p className="text-sm" style={{ color: '#9090A8' }}>아래 버튼으로 음악을 들어보세요.</p>
                  </div>
                )}

                {/* ✅ 가사 토글 - iframe 바로 아래 */}
                {hasLyrics && (
                  <div className="rounded-2xl overflow-hidden"
                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}>

                    {/* 토글 버튼 */}
                    <button
                      type="button"
                      onClick={() => setLyricsOpen(prev => !prev)}
                      aria-expanded={lyricsOpen}
                      className="w-full flex items-center justify-between px-4 py-3 transition-colors"
                      style={{
                        backgroundColor: lyricsOpen ? 'rgba(107,163,214,0.1)' : 'rgba(255,255,255,0.04)',
                        cursor: 'pointer',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span style={{ color: '#6BA3D6', fontSize: '14px' }}>♪</span>
                        <span className="text-sm font-medium" style={{ color: '#F0F0F5' }}>
                          {lyricsLabel}
                        </span>
                      </div>
                      {/* 열림/닫힘 화살표 */}
                      <span
                        style={{
                          color: '#9090A8',
                          fontSize: '11px',
                          transform: lyricsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.25s ease',
                          display: 'inline-block',
                        }}
                      >
                        ▼
                      </span>
                    </button>

                    {/* 가사 내용 - 토글 열리면 표시 */}
                    {lyricsOpen && (
                      <div
                        className="px-5 py-4"
                        style={{
                          borderTop: '1px solid rgba(255,255,255,0.06)',
                          backgroundColor: 'rgba(0,0,0,0.2)',
                        }}
                      >
                        <p
                          className="text-sm leading-loose whitespace-pre-wrap"
                          style={{ color: '#C8C8D8', fontFamily: 'var(--font-body)' }}
                        >
                          {cleanLyrics}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Drive 직접 열기 버튼 */}
                <a href={gift.driveUrl} target="_blank" rel="noopener noreferrer">
                  <Button fullWidth size="lg">{T.openDrive}</Button>
                </a>

                {/* 재생 안 될 때 안내 */}
                <p className="text-xs text-center" style={{ color: '#5A5A70' }}>
                  {lang === 'ja'
                    ? '再生できない場合は上のボタンをお試しください。'
                    : lang === 'en'
                    ? "If the player doesn't work, use the button above."
                    : '재생이 안 되면 위 버튼으로 들어보세요.'}
                </p>
              </div>
            ) : (
              // 아직 음악 준비 중
              <div className="text-center py-4">
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

        {/* 링크 복사 & 나도 만들기 버튼 */}
        <div className="mt-5 flex flex-col gap-3 animate-fade-in-up delay-300">
          <Button onClick={handleCopyLink} fullWidth variant="secondary">
            {copied ? T.copied : T.copyLink}
          </Button>
          <Link to="/gift-form">
            <Button fullWidth variant="ghost">{T.makeYours}</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
