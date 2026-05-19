/**
 * =====================================================
 * Music for U - Google Apps Script
 * =====================================================
 *
 * 이 파일을 Google Apps Script에 붙여넣으세요.
 * 아래 상수값 3개만 본인 것으로 바꾸면 돼요!
 * =====================================================
 */

// =====================================================
// ⚙️ 여기만 수정하면 돼요!
// =====================================================

/** 관리자 이메일 주소 */
const ADMIN_EMAIL = 'nerveinerve@gmail.com';

/** Google Sheets 스프레드시트 ID
 * 시트 URL에서 복사하세요:
 * https://docs.google.com/spreadsheets/d/[여기가 ID]/edit
 */
const SPREADSHEET_ID = '1UMporoxC0OyFeu3HtT3CdQGjREyKJinBLqQF88Vfj5E';

/** 배포된 웹사이트 주소
 * Vercel 배포 후 나오는 URL을 넣어주세요.
 * 예: https://music-for-u.vercel.app
 */
const SITE_BASE_URL = 'http://localhost:5173';

/** 시트 이름 */
const SHEET_NAME = '신청목록';

// =====================================================
// 컬럼 번호 정의 (A=1, B=2, ...)
// =====================================================
const COL = {
  CREATED_AT: 1,    // A: 접수 시간
  GIFT_ID: 2,       // B: 신청 ID
  LANGUAGE: 3,      // C: 언어
  GIFT_TARGET: 4,   // D: 선물 대상
  RECEIVER_NAME: 5, // E: 받는 사람 이름
  SENDER_NAME: 6,   // F: 보내는 사람 이름
  GIFT_PURPOSE: 7,  // G: 선물 목적
  MESSAGE: 8,       // H: 짧은 메시지
  MBTI: 9,          // I: MBTI
  ARTIST_NAME: 10,  // J: 가수 이름
  SONG_TITLE: 11,   // K: 노래 제목
  MOODS: 12,        // L: 원하는 분위기
  EMAIL: 13,        // M: 신청자 이메일
  STATUS: 14,       // N: 제작 상태
  DRIVE_URL: 15,    // O: Google Drive 음악 링크
  GIFT_PAGE_URL: 16,// P: 선물 페이지 링크
  EMAIL_STATUS: 17, // Q: 이메일 발송 상태
  MEMO: 18,         // R: 메모
  LYRICS: 19,       // S: 가사 ← 새로 추가!
};

// =====================================================
// 신청 ID 생성 함수
// =====================================================
function generateGiftId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `mfu_${timestamp}_${random}`;
}

// =====================================================
// doPost: 신청 데이터를 받아서 저장해요
// =====================================================
function doPost(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    const data = JSON.parse(e.postData.contents);

    if (!data.receiverName || !data.email || !data.giftTarget) {
      return createJsonResponse({ status: 'error', message: '필수 항목이 빠져있어요.' }, headers);
    }

    const giftId = generateGiftId();
    const createdAt = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    const giftPageUrl = `${SITE_BASE_URL}/gift/${giftId}`;

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) {
      return createJsonResponse({ status: 'error', message: `"${SHEET_NAME}" 시트를 찾을 수 없어요.` }, headers);
    }

    sheet.appendRow([
      createdAt,                 // A: 접수 시간
      giftId,                    // B: 신청 ID
      data.language || 'ko',     // C: 언어
      data.giftTarget || '',     // D: 선물 대상
      data.receiverName || '',   // E: 받는 사람
      data.senderName || '',     // F: 보내는 사람
      data.giftPurpose || '',    // G: 선물 목적
      data.message || '',        // H: 메시지
      data.mbti || '',           // I: MBTI
      data.artistName || '',     // J: 가수
      data.songTitle || '',      // K: 노래
      data.moods || '',          // L: 분위기
      data.email || '',          // M: 이메일
      '접수 완료',               // N: 제작 상태
      '',                        // O: Drive 링크 (비워둠)
      giftPageUrl,               // P: 선물 페이지 링크
      '미발송',                  // Q: 이메일 발송 상태
      '',                        // R: 메모 (비워둠)
      '',                        // S: 가사 (비워둠 - 관리자가 나중에 입력)
    ]);

    sendAdminNotification(data, giftId, giftPageUrl, createdAt);

    return createJsonResponse({
      status: 'success',
      giftId: giftId,
      giftPageUrl: giftPageUrl,
      message: '신청이 접수되었어요.',
    }, headers);

  } catch (error) {
    console.error('doPost 오류:', error);
    return createJsonResponse({
      status: 'error',
      message: '저장 중 오류가 발생했어요: ' + error.message,
    }, headers);
  }
}

// =====================================================
// doGet: 선물 페이지 데이터를 가져와요
// =====================================================
function doGet(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const action = e.parameter.action;
    const id = e.parameter.id;

    if (action !== 'getGift' || !id) {
      return createJsonResponse({ status: 'error', message: '잘못된 요청이에요.' }, headers);
    }

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) {
      return createJsonResponse({ status: 'error', message: '시트를 찾을 수 없어요.' }, headers);
    }

    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[COL.GIFT_ID - 1] === id) {
        return createJsonResponse({
          status: 'success',
          gift: {
            giftId: row[COL.GIFT_ID - 1],
            receiverName: row[COL.RECEIVER_NAME - 1],
            senderName: row[COL.SENDER_NAME - 1],
            giftPurpose: row[COL.GIFT_PURPOSE - 1],
            message: row[COL.MESSAGE - 1],
            mbti: row[COL.MBTI - 1],
            artistName: row[COL.ARTIST_NAME - 1],
            songTitle: row[COL.SONG_TITLE - 1],
            moods: row[COL.MOODS - 1],
            status: row[COL.STATUS - 1],
            driveUrl: row[COL.DRIVE_URL - 1],
            lyrics: row[COL.LYRICS - 1] || '',  // ← 가사 추가! 없으면 빈 문자열
            // 이메일 등 민감한 정보는 제외해요
          },
        }, headers);
      }
    }

    return createJsonResponse({ status: 'error', message: '선물 정보를 찾을 수 없어요.' }, headers);

  } catch (error) {
    console.error('doGet 오류:', error);
    return createJsonResponse({
      status: 'error',
      message: '데이터를 불러오는 중 오류가 발생했어요.',
    }, headers);
  }
}

// =====================================================
// sendReadyGiftEmails: 완성된 음악 이메일 일괄 발송
// Apps Script에서 직접 실행할 수 있어요
// =====================================================
function sendReadyGiftEmails() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  if (!sheet) { Logger.log(`"${SHEET_NAME}" 시트를 찾을 수 없어요.`); return; }

  const data = sheet.getDataRange().getValues();
  let sentCount = 0;

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const status = row[COL.STATUS - 1];
    const driveUrl = row[COL.DRIVE_URL - 1];
    const emailStatus = row[COL.EMAIL_STATUS - 1];
    const email = row[COL.EMAIL - 1];

    if (status === '제작 완료' && driveUrl && emailStatus !== '발송 완료') {
      const giftId = row[COL.GIFT_ID - 1];
      const receiverName = row[COL.RECEIVER_NAME - 1];
      const giftPageUrl = row[COL.GIFT_PAGE_URL - 1];

      try {
        sendGiftEmail(email, receiverName, giftPageUrl);
        sheet.getRange(i + 1, COL.EMAIL_STATUS).setValue('발송 완료');
        Logger.log(`이메일 발송 완료: ${email} (${giftId})`);
        sentCount++;
      } catch (err) {
        Logger.log(`이메일 발송 실패: ${email} - ${err.message}`);
        sheet.getRange(i + 1, COL.EMAIL_STATUS).setValue('발송 실패');
      }
    }
  }

  Logger.log(`총 ${sentCount}건 이메일 발송 완료`);
}

// =====================================================
// onEditTrigger: 제작 상태 변경 시 자동 이메일 발송
// =====================================================
function onEditTrigger(e) {
  try {
    const sheet = e.source.getSheetByName(SHEET_NAME);
    if (!sheet || e.source.getActiveSheet().getName() !== SHEET_NAME) return;

    const editedRow = e.range.getRow();
    const editedCol = e.range.getColumn();

    if (editedCol !== COL.STATUS) return;

    const rowData = sheet.getRange(editedRow, 1, 1, COL.LYRICS).getValues()[0];
    const status = rowData[COL.STATUS - 1];
    const driveUrl = rowData[COL.DRIVE_URL - 1];
    const emailStatus = rowData[COL.EMAIL_STATUS - 1];
    const email = rowData[COL.EMAIL - 1];

    if (status === '제작 완료' && driveUrl && emailStatus !== '발송 완료') {
      const receiverName = rowData[COL.RECEIVER_NAME - 1];
      const giftPageUrl = rowData[COL.GIFT_PAGE_URL - 1];
      sendGiftEmail(email, receiverName, giftPageUrl);
      sheet.getRange(editedRow, COL.EMAIL_STATUS).setValue('발송 완료');
    }
  } catch (error) {
    console.error('onEditTrigger 오류:', error);
  }
}

// =====================================================
// 내부 함수들
// =====================================================

function sendGiftEmail(email, receiverName, giftPageUrl) {
  const subject = 'Music for U 음악 선물이 완성되었어요 🎵';
  const body = `안녕하세요.

신청하신 Music for U 음악 선물이 완성되었어요.

아래 링크에서 ${receiverName}님을 위한 음악과 메시지를 먼저 확인하실 수 있습니다.

선물 페이지 링크:
${giftPageUrl}

확인 후 소중한 분께 직접 전달해주세요.
카카오톡, 문자, DM 등으로 링크를 공유하시면 돼요.

---

입력해주신 메시지와 음악 취향을 바탕으로,
기존 곡을 복제하지 않고 새로운 음악으로 제작했습니다.

링크가 열리지 않거나 음악 확인이 어려우시면
이 이메일로 답장해주세요.

감사합니다.
Music for U 드림`;

  GmailApp.sendEmail(email, subject, body);
}

function sendAdminNotification(data, giftId, giftPageUrl, createdAt) {
  const subject = `새 Music for U 신청이 들어왔어요 - ${data.receiverName}님을 위한 선물`;
  const body = `새로운 음악 선물 신청이 접수되었어요.

===== 신청 정보 =====

접수 시간: ${createdAt}
신청 ID: ${giftId}
선물 대상: ${data.giftTarget}
받는 분: ${data.receiverName}
보내는 분: ${data.senderName}
선물 목적: ${data.giftPurpose}
마음 한 줄: ${data.message}
MBTI: ${data.mbti || '미입력'}
좋아하는 가수: ${data.artistName}
좋아하는 노래: ${data.songTitle}
원하는 분위기: ${data.moods}
신청자 이메일: ${data.email}

선물 페이지 링크:
${giftPageUrl}

===== 다음 작업 =====

1. Suno AI로 음악을 제작해주세요.
2. 음악 파일을 Google Drive에 업로드해주세요.
3. Google Drive 공유를 "링크가 있는 모든 사용자" 보기로 설정해주세요.
4. Suno에서 생성된 가사가 있으면 복사해두세요.
5. Google Sheets에서 해당 행의 O열(Google Drive 음악 링크)에 링크를 입력하세요.
6. S열(가사)에 가사를 붙여넣으세요. (없으면 비워도 됩니다)
   ※ 가사 중 [대괄호] 안의 내용은 선물 페이지에서 자동으로 숨겨져요.
7. N열(제작 상태)을 "제작 완료"로 변경하세요.
8. 그러면 신청자에게 자동으로 이메일이 발송돼요.

Google Sheets에서 확인하기:
https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`;

  GmailApp.sendEmail(ADMIN_EMAIL, subject, body);
}

function createJsonResponse(data, headers) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}