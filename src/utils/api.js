// 구글 앱스 스크립트와 통신하는 함수들이에요
// 구글 앱스 스크립트 = 구글이 만든 자동화 도구예요

import { APPS_SCRIPT_URL } from './constants';

/**
 * 신청 데이터를 구글 시트에 저장해요
 * @param {Object} formData - 사용자가 입력한 신청 정보
 * @returns {Object} - 저장 결과 (성공/실패, 신청 ID 등)
 */
export async function submitGiftRequest(formData) {
  if (!APPS_SCRIPT_URL) {
    throw new Error('APPS_SCRIPT_URL이 설정되지 않았어요. .env 파일을 확인해주세요.');
  }

  const response = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    // Google Apps Script는 JSON 직접 전송이 어려워서 텍스트로 보내요
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'text/plain',
    },
    // redirect: follow는 Apps Script의 리다이렉트를 따라가기 위해 필요해요
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`서버 오류가 발생했어요. (${response.status})`);
  }

  const data = await response.json();

  if (data.status !== 'success') {
    throw new Error(data.message || '저장 중 오류가 발생했어요.');
  }

  return data;
}

/**
 * 선물 페이지 데이터를 가져와요
 * @param {string} giftId - 신청 ID
 * @returns {Object} - 선물 페이지에 필요한 데이터
 */
export async function fetchGiftData(giftId) {
  if (!APPS_SCRIPT_URL) {
    throw new Error('APPS_SCRIPT_URL이 설정되지 않았어요.');
  }

  const url = `${APPS_SCRIPT_URL}?action=getGift&id=${encodeURIComponent(giftId)}`;

  const response = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
  });

  if (!response.ok) {
    throw new Error(`데이터를 불러오지 못했어요. (${response.status})`);
  }

  const data = await response.json();

  if (data.status !== 'success') {
    throw new Error(data.message || '데이터를 찾지 못했어요.');
  }

  return data.gift;
}

/**
 * 내 음악 신청 데이터를 저장해요
 */
export async function submitMyMusicRequest(formData) {
  if (!APPS_SCRIPT_URL) {
    throw new Error('APPS_SCRIPT_URL이 설정되지 않았어요.');
  }

  const response = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify({ ...formData, type: 'my-music' }),
    headers: { 'Content-Type': 'text/plain' },
    redirect: 'follow',
  });

  if (!response.ok) throw new Error(`서버 오류가 발생했어요. (${response.status})`);

  const data = await response.json();
  if (data.status !== 'success') throw new Error(data.message || '저장 중 오류가 발생했어요.');

  return data;
}

/**
 * 내 음악 페이지 데이터를 가져와요
 */
export async function fetchMyMusicData(myId) {
  if (!APPS_SCRIPT_URL) throw new Error('APPS_SCRIPT_URL이 설정되지 않았어요.');

  const url = `${APPS_SCRIPT_URL}?action=getMyMusic&id=${encodeURIComponent(myId)}`;
  const response = await fetch(url, { method: 'GET', redirect: 'follow' });

  if (!response.ok) throw new Error(`데이터를 불러오지 못했어요. (${response.status})`);

  const data = await response.json();
  if (data.status !== 'success') throw new Error(data.message || '데이터를 찾지 못했어요.');

  return data.myMusic;
}
