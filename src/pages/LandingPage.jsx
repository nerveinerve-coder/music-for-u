import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { LangSelector } from '../components/LangSelector';
import { useLang } from '../hooks/useLang';
import { translations } from '../utils/i18n';

// 랜딩 페이지용 다국어 텍스트
const LANDING_TEXT = {
  ko: {
    badge: '🎵 Music for U',
    heroTitle: '당신의 음악을\n지금 만들어보세요.',
    heroSub: '나를 위한 음악, 소중한 사람을 위한 선물 음악\n무엇이든 만들어드려요.',
    myMusic: {
      label: '내 음악 만들기',
      desc: '나만을 위한 음악',
      detail: '취향을 담은 나만의 곡',
      cta: '내 음악 만들기 →',
    },
    gift: {
      label: '음악 선물하기',
      desc: '소중한 사람을 위한 음악',
      detail: '마음을 담은 선물 페이지',
      cta: '음악 선물 만들기 →',
    },
    howTitle: '어떻게 만들어지나요?',
    howSub: '두 서비스 모두 간단해요.',
    steps: [
      { icon: '🎵', title: '취향을 알려줘요', desc: '좋아하는 가수와 노래, 분위기를 선택해요.' },
      { icon: '🤖', title: 'AI가 음악을 만들어요', desc: 'Suno AI로 세상에 하나뿐인 음악을 제작해요.' },
      { icon: '📧', title: '이메일로 받아요', desc: '완성된 음악 페이지 링크를 이메일로 받아요.' },
    ],
    footerNote: '입력하신 가수와 노래는 분위기 참고용으로만 사용해요.\n기존 곡을 복제하지 않고, 감성과 무드를 참고해 새롭게 제작해요.',
  },
  en: {
    badge: '🎵 Music for U',
    heroTitle: 'Your music,\nmade just for you.',
    heroSub: 'Music for yourself or a gift for someone special —\nwe make it happen.',
    myMusic: {
      label: 'Make My Music',
      desc: 'Music made for you',
      detail: 'A track that matches your vibe',
      cta: 'Make my music →',
    },
    gift: {
      label: 'Give a Music Gift',
      desc: 'Music for someone special',
      detail: 'A heartfelt gift page',
      cta: 'Create a music gift →',
    },
    howTitle: 'How does it work?',
    howSub: 'Both services are simple.',
    steps: [
      { icon: '🎵', title: 'Share your taste', desc: 'Tell us your favorite artist, song, and vibe.' },
      { icon: '🤖', title: 'AI creates your music', desc: 'Suno AI crafts a one-of-a-kind track for you.' },
      { icon: '📧', title: 'Get it by email', desc: 'Receive your music page link in your inbox.' },
    ],
    footerNote: 'Artist and song references are used only as creative inspiration.\nAll music is original — not a copy of any existing track.',
  },
  ja: {
    badge: '🎵 Music for U',
    heroTitle: 'あなたのための音楽を\n今すぐ作りましょう。',
    heroSub: '自分のための音楽も、大切な人へのギフトも\nどちらも作れます。',
    myMusic: {
      label: '自分の音楽を作る',
      desc: '自分だけのための音楽',
      detail: '好みにぴったりの一曲',
      cta: '自分の音楽を作る →',
    },
    gift: {
      label: '音楽ギフトを贈る',
      desc: '大切な人への音楽',
      detail: '想いを込めたギフトページ',
      cta: '音楽ギフトを作る →',
    },
    howTitle: 'どうやって作るの？',
    howSub: 'どちらのサービスもとても簡単です。',
    steps: [
      { icon: '🎵', title: '好みを教えます', desc: '好きなアーティスト・曲・雰囲気を選んでください。' },
      { icon: '🤖', title: 'AIが音楽を作ります', desc: 'Suno AIが世界にひとつだけの曲を制作します。' },
      { icon: '📧', title: 'メールで受け取ります', desc: '完成した音楽ページのリンクがメールに届きます。' },
    ],
    footerNote: '入力いただいたアーティスト・楽曲は、雰囲気の参考にのみ使用します。\n既存の曲をコピーせず、世界にひとつのオリジナル楽曲として制作します。',
  },
};

export function LandingPage() {
  const { lang } = useLang();
  const T = LANDING_TEXT[lang] || LANDING_TEXT.ko;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0F0F14', color: '#F0F0F5' }}>

      {/* 네비게이션 */}
      <nav className="px-5 py-5 flex items-center justify-between max-w-lg mx-auto">
        <span className="font-display text-xl font-bold" style={{ color: '#F0F0F5' }}>
          Music for U
        </span>
        <LangSelector />
      </nav>

      {/* Hero */}
      <section className="max-w-lg mx-auto px-5 pt-8 pb-4 text-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ backgroundColor: 'rgba(107,163,214,0.12)', color: '#6BA3D6', border: '1px solid rgba(107,163,214,0.2)' }}>
            {T.badge}
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight mb-4 whitespace-pre-line"
            style={{ color: '#F0F0F5' }}>
            {T.heroTitle}
          </h1>
          <p className="text-base leading-relaxed mb-10 whitespace-pre-line" style={{ color: '#9090A8' }}>
            {T.heroSub}
          </p>
        </div>

        {/* ✅ 두 서비스 선택 카드 — 동등한 중요도, 내음악이 왼쪽/위 */}
        <div className="flex flex-col gap-4 animate-fade-in-up delay-200">

          {/* 내 음악 만들기 카드 (위) */}
          <Link to="/my-music-form" className="block">
            <div className="rounded-3xl p-6 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background: 'linear-gradient(135deg, #1A2A3F 0%, #1A1A2E 100%)',
                border: '1px solid rgba(107,163,214,0.25)',
              }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: 'rgba(107,163,214,0.15)' }}>
                  🎧
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ backgroundColor: 'rgba(107,163,214,0.15)', color: '#6BA3D6' }}>
                  {T.myMusic.desc}
                </span>
              </div>
              <h2 className="text-xl font-bold mb-1.5" style={{ color: '#F0F0F5' }}>
                {T.myMusic.label}
              </h2>
              <p className="text-sm mb-4" style={{ color: '#9090A8' }}>
                {T.myMusic.detail}
              </p>
              <div className="flex items-center text-sm font-semibold" style={{ color: '#6BA3D6' }}>
                {T.myMusic.cta}
              </div>
            </div>
          </Link>

          {/* 음악 선물하기 카드 (아래) */}
          <Link to="/gift-form" className="block">
            <div className="rounded-3xl p-6 text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background: 'linear-gradient(135deg, #1F1A2E 0%, #1A1A24 100%)',
                border: '1px solid rgba(201,169,110,0.25)',
              }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: 'rgba(201,169,110,0.12)' }}>
                  🎁
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ backgroundColor: 'rgba(201,169,110,0.12)', color: '#C9A96E' }}>
                  {T.gift.desc}
                </span>
              </div>
              <h2 className="text-xl font-bold mb-1.5" style={{ color: '#F0F0F5' }}>
                {T.gift.label}
              </h2>
              <p className="text-sm mb-4" style={{ color: '#9090A8' }}>
                {T.gift.detail}
              </p>
              <div className="flex items-center text-sm font-semibold" style={{ color: '#C9A96E' }}>
                {T.gift.cta}
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 px-5" style={{ backgroundColor: '#13131A', marginTop: '2rem' }}>
        <div className="max-w-lg mx-auto">
          <h2 className="text-center text-xl font-bold mb-2" style={{ color: '#F0F0F5' }}>{T.howTitle}</h2>
          <p className="text-center text-sm mb-8" style={{ color: '#9090A8' }}>{T.howSub}</p>
          <div className="flex flex-col gap-5">
            {T.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: 'rgba(107,163,214,0.12)' }}>
                  {step.icon}
                </div>
                <div className="pt-1">
                  <h3 className="font-semibold text-sm mb-1" style={{ color: '#F0F0F5' }}>{step.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#9090A8' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-8 px-5 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="font-display font-bold mb-2" style={{ color: '#6BA3D6' }}>Music for U</p>
        <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: '#5A5A70' }}>
          {T.footerNote}
        </p>
      </footer>
    </div>
  );
}
