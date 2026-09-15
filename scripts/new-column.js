const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const { generateCardThumbnailSVG } = require('./exact-thumbnail-builder');

const slug = process.argv[2];
const customDate = process.argv[3]; // e.g. '2026-09-20'
const customSlot = process.argv[4] || '1'; // 1 (09:00), 2 (13:00), 3 (17:00), 4 (21:00)

if (!slug) {
  console.log('\n❌ 사용법: npm run new:column <칼럼영문슬러그> [발행예정일 YYYY-MM-DD] [시간대 1~4]');
  console.log('  - 시간대 1: 09:00 (아침)');
  console.log('  - 시간대 2: 13:00 (점심)');
  console.log('  - 시간대 3: 17:00 (오후)');
  console.log('  - 시간대 4: 21:00 (저녁)');
  console.log('\n예시 1 (오늘 즉시 발행): npm run new:column frozen-shoulder');
  console.log('예시 2 (내일 점심 13시 예약): npm run new:column frozen-shoulder 2026-09-16 2\n');
  process.exit(1);
}

const targetDir = path.join(__dirname, '..', 'content', 'column', slug);
const targetFile = path.join(targetDir, 'index.md');
const thumbsDir = path.join(__dirname, '..', 'static', 'thumbnails');

if (!fs.existsSync(thumbsDir)) {
  fs.mkdirSync(thumbsDir, { recursive: true });
}

if (fs.existsSync(targetFile)) {
  console.log(`\n⚠️ 이미 존재하는 칼럼입니다: content/column/${slug}/index.md\n`);
  process.exit(1);
}

const slotTimes = {
  '1': '09:00:00',
  '2': '13:00:00',
  '3': '17:00:00',
  '4': '21:00:00'
};

const selectedTime = slotTimes[customSlot] || '09:00:00';
const baseDate = customDate || new Date().toISOString().slice(0, 10);
const publishDatetime = `${baseDate}T${selectedTime}+09:00`;

const template = `---
title: "새 칼럼 제목을 입력하세요"
date: ${publishDatetime}
summary: "칼럼의 핵심 요약 2~3줄을 작성해 주세요. 네이버 및 구글 검색 결과 설명란(meta description)에 노출됩니다."
category: "척추·관절 통증"
tags: ["부평동한의원", "삼산동한의원", "산곡동한의원", "부개동한의원", "추나요법", "약침치료", "한방치료"]
type: column
layout: single
---

<div class="voice-box">
  <div class="voice-line">"환자분께서 자주 호소하시는 생생한 증상 호소문 1"</div>
  <div class="voice-line">"환자분께서 자주 호소하시는 생생한 증상 호소문 2"</div>
</div>

<div class="intro-body">
  <p>
    [부평동, 삼산동, 산곡동, 부개동] 등 부평 인근에서 근무하시거나 거주하시는 환자분들의 생생한 상황으로 생활 밀착형 도입부를 시작합니다.
  </p>
  <p>
    증상의 발생 배경과 오늘 칼럼에서 다룰 핵심 치료 방향을 알기 쉽게 소개합니다.
  </p>
</div>

<div class="toc">
  <div class="toc-title">📌 칼럼 목차</div>
  <ol>
    <li>증상의 해부학적·생리학적 발생 기전과 원인</li>
    <li>진행 단계별 중증도 및 30초 자가진단법</li>
    <li>한의학적 병리 진단 및 현대의학 매칭 비교</li>
    <li>3대 체질별 맞춤 변증 유형</li>
    <li>해아림 부평점의 1:1 비수술 복합 치료 시스템</li>
    <li>진료실 자주 묻는 질문 (FAQ 3문 3답)</li>
  </ol>
</div>

### 01. 증상의 해부학적·생리학적 발생 기전과 원인

구체적인 해부학적/생리학적 설명과 원인을 환자의 눈높이에서 깊이 있게 설명합니다.

### 02. 진행 단계별 중증도 및 30초 자가진단법

초기, 중기, 말기의 단계별 증상 변화와 진료실에서 시행하는 자가진단법을 설명합니다.

### 03. 한의학적 병리 진단 및 현대의학 매칭 비교

동의보감 및 한의학 원전 기반의 병리 기전과 현대의학적 질환명을 매칭하여 설명합니다.

### 04. 3대 체질별 맞춤 변증 유형

1. **급성 어혈염증형**: 초기 손상 및 급성 염증 상태 (처방 원리).
2. **만성 한습저체형**: 만성화되어 굳고 시린 상태 (처방 원리).
3. **간신기혈허약형**: 노화 및 체력 저하로 인한 퇴행성 상태 (처방 원리).

### 05. 해아림 부평점의 1:1 비수술 복합 치료 시스템

1. **정밀 추나요법**: 관절 및 척추의 구조적 정렬을 바로잡습니다.
2. **소염 & 인대강화 약침**: 천연 한약재 성분으로 신경 염증을 가라앉히고 조직을 재생합니다.
3. **체질 맞춤 한약**: 기혈 순환을 촉진하고 자생력을 복원합니다.

### 06. 진료실 자주 묻는 질문 (FAQ 3문 3답)

**Q1. 첫 번째 자주 묻는 질문은 무엇인가요?**
질문에 대한 한방침구과 전문의의 명쾌하고 전문적인 답변을 작성합니다.

**Q2. 두 번째 자주 묻는 질문은 무엇인가요?**
질문에 대한 한방침구과 전문의의 명쾌하고 전문적인 답변을 작성합니다.

**Q3. 세 번째 자주 묻는 질문은 무엇인가요?**
질문에 대한 한방침구과 전문의의 명쾌하고 전문적인 답변을 작성합니다.

---

<div class="callout-box">
  <div class="callout-title">🏥 해아림한의원 부평점 통합진료센터 클리닉 안내</div>
  <p>
    증상은 몸이 보내는 쉼과 치유의 절박한 신호입니다.<br>
    한방침구과 전문의 권형근 대표원장의 1:1 맞춤 정밀 진단을 통해 비수술 한방 복합 치료로 건강한 일상을 되찾으세요.
  </p>
  <div class="clinic-info-grid">
    <div><strong>위치:</strong> 인천 부평구 경원대로 1412, 2층 (부평역 7번 출구 도보 5분)</div>
    <div><strong>진료권역:</strong> 부평동, 삼산동, 산곡동, 부개동, 청천동, 갈산동, 십정동, 일신동 등 부평구 전역 및 인근 지역</div>
    <div><strong>진료:</strong> 월·수·금 야간진료 (09:30~20:00) | 화·목 (09:30~19:00) | 토 (09:30~15:00, 점심시간 없음)</div>
    <div><strong>예약/문의:</strong> 032-719-3472 | 네이버 예약 및 카카오톡 상담 가능</div>
  </div>
</div>
`;

fs.mkdirSync(targetDir, { recursive: true });
fs.writeFileSync(targetFile, template, 'utf8');

// Automatically generate 1080x1080 card thumbnail PNG & SVG
const svg = generateCardThumbnailSVG({
  title: '새 칼럼 제목을 입력하세요',
  category: '척추·관절 통증'
});
const svgPath = path.join(thumbsDir, `${slug}.svg`);
const pngPath = path.join(thumbsDir, `${slug}.png`);
fs.writeFileSync(svgPath, svg, 'utf8');

const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1080 } });
fs.writeFileSync(pngPath, resvg.render().asPng());

console.log(`\n✅ 6단계 심층 칼럼 마크다운 파일 생성 완료!`);
console.log(`📄 파일 경로: content/column/${slug}/index.md`);
console.log(`🖼️ 1080x1080 카드 썸네일 생성 완료: static/thumbnails/${slug}.png`);
console.log(`📅 예약 일시: ${publishDatetime} (${customSlot}회차 - ${selectedTime})`);
console.log(`⏰ GitHub Actions를 통해 해당 일시에 자동으로 사이트 발행 및 텔레그램으로 전송됩니다.\n`);
