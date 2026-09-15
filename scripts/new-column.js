const fs = require('fs');
const path = require('path');

const slug = process.argv[2];
const customDate = process.argv[3]; // e.g. '2026-09-20' for scheduled publishing

if (!slug) {
  console.log('\n❌ 사용법: npm run new:column <칼럼영문슬러그> [발행예정일 YYYY-MM-DD]');
  console.log('예시 1 (오늘 즉시 발행): npm run new:column frozen-shoulder');
  console.log('예시 2 (예약 자동 발행): npm run new:column frozen-shoulder 2026-09-25\n');
  process.exit(1);
}

const targetDir = path.join(__dirname, '..', 'content', 'column', slug);
const targetFile = path.join(targetDir, 'index.md');

if (fs.existsSync(targetFile)) {
  console.log(`\n⚠️ 이미 존재하는 칼럼입니다: content/column/${slug}/index.md\n`);
  process.exit(1);
}

const publishDate = customDate || new Date().toISOString().slice(0, 10);

const template = `---
title: "새 칼럼 제목을 입력하세요"
date: ${publishDate}
summary: "칼럼의 핵심 요약 2~3줄을 작성해 주세요. 네이버 및 구글 검색 결과 설명란에 노출됩니다."
category: "척추·관절 통증"
tags: ["부평한의원", "추나요법", "도수치료", "약침"]
type: column
layout: single
---

<div class="voice-box">
  <div class="voice-line">"환자분께서 자주 하시는 질문이나 생생한 증상 호소 1"</div>
  <div class="voice-line">"환자분께서 자주 하시는 질문이나 생생한 증상 호소 2"</div>
</div>

<div class="intro-body">
  <p>
    부평역 인근에서 근무하시거나 거주하시는 환자분들의 생생한 상황으로 도입부를 시작합니다.
  </p>
  <p>
    증상의 발생 배경과 오늘 칼럼에서 다룰 핵심 치료 방향을 알기 쉽게 소개합니다.
  </p>
</div>

<div class="toc">
  <div class="toc-title">📌 칼럼 목차</div>
  <ol>
    <li>첫 번째 주제: 증상의 원인과 특징</li>
    <li>두 번째 주제: 방치했을 때 생기는 문제점</li>
    <li>세 번째 주제: 한의학적 맞춤 치료 기전 (추나·약침·한약)</li>
    <li>네 번째 주제: 진료실에서 전하는 일상 속 관리법</li>
  </ol>
</div>

### 1. 첫 번째 주제: 증상의 원인과 특징

구체적인 해부학적/생리학적 설명과 원인을 환자의 눈높이에서 쉽게 설명합니다.

### 2. 두 번째 주제: 방치했을 때 생기는 문제점

단순 통증을 넘어 만성화될 경우 나타나는 신체적 변화를 설명합니다.

### 3. 세 번째 주제: 한의학적 맞춤 치료 기전

해아림한의원 부평점 통합진료센터의 1:1 맞춤 치료법(추나요법, 소염약침, 침구치료, 맞춤 한약)을 소개합니다.

### 4. 네 번째 주제: 진료실에서 전하는 일상 속 관리법

집이나 직장에서 실천할 수 있는 초구체적인 생활 관리 요령과 스트레칭법을 안내합니다.
`;

fs.mkdirSync(targetDir, { recursive: true });
fs.writeFileSync(targetFile, template, 'utf8');

console.log(`\n✅ 칼럼 파일 생성 완료!`);
console.log(`📄 파일 경로: content/column/${slug}/index.md`);
console.log(`📅 발행(예약)일: ${publishDate}`);
if (customDate && new Date(customDate) > new Date()) {
  console.log(`⏰ [예약 발행 모드] ${customDate} 오전 9시에 GitHub Actions를 통해 자동 발행됩니다.\n`);
} else {
  console.log(`🚀 [즉시 발행 모드] Git 푸시 시 즉시 사이트에 배포됩니다.\n`);
}
