// 앱 전역에서 사용하는 상수값들이에요

export const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || '';
export const SITE_BASE_URL = import.meta.env.VITE_SITE_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');

// 선물 대상 목록
export const GIFT_TARGETS = [
  { value: '연인', label: '연인', emoji: '💑' },
  { value: '친구', label: '친구', emoji: '👫' },
  { value: '가족', label: '가족', emoji: '👨‍👩‍👧' },
  { value: '동료', label: '동료', emoji: '🤝' },
  { value: '나', label: '나', emoji: '🙋' },
  { value: '기타', label: '기타', emoji: '💌' },
];

// 선물 목적 목록
export const GIFT_PURPOSES = [
  { value: '생일', label: '생일', emoji: '🎂' },
  { value: '기념일', label: '기념일', emoji: '💝' },
  { value: '응원', label: '응원', emoji: '🌟' },
  { value: '위로', label: '위로', emoji: '🤗' },
  { value: '고백', label: '고백', emoji: '💌' },
  { value: '감사', label: '감사', emoji: '🙏' },
  { value: '그냥 선물', label: '그냥 선물', emoji: '🎁' },
];

// 음악 분위기 목록
export const MUSIC_MOODS = [
  '따뜻한', '잔잔한', '설레는', '몽환적인', '신나는',
  '위로되는', '로맨틱한', '새벽 감성', '시티팝', '어쿠스틱',
];

// MBTI 선택지
export const MBTI_OPTIONS = [
  { group: 'EI', label: '에너지 방향', options: ['E', 'I'] },
  { group: 'NS', label: '인식 방식', options: ['N', 'S'] },
  { group: 'FT', label: '판단 방식', options: ['F', 'T'] },
  { group: 'PJ', label: '생활 방식', options: ['P', 'J'] },
];
