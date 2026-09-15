const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const columnsDir = path.join(__dirname, '..', 'content', 'column');
const thumbsDir = path.join(__dirname, '..', 'static', 'thumbnails');

if (!fs.existsSync(thumbsDir)) {
  fs.mkdirSync(thumbsDir, { recursive: true });
}

function escapeXML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Generate Premium Card-News Style 1080x1080 Thumbnail (Exact match to healimbp standard)
function generateCardThumbnailSVG({ title, category, tip, pillar1, pillar2, pillar3 }) {
  // Accent colors by category
  let bgGradStart = '#071813';
  let bgGradMid = '#0f2f25';
  let bgGradEnd = '#05110d';
  let badgeColor = '#2F5D50';
  let accentColor = '#34d399';
  let tipBg = 'rgba(47, 93, 80, 0.4)';

  if (category.includes('교통사고')) {
    bgGradStart = '#180a0a';
    bgGradMid = '#301313';
    bgGradEnd = '#100505';
    badgeColor = '#dc2626';
    accentColor = '#f87171';
    tipBg = 'rgba(220, 38, 38, 0.3)';
  } else if (category.includes('호흡기') || category.includes('기침') || category.includes('비염')) {
    bgGradStart = '#071520';
    bgGradMid = '#0c273d';
    bgGradEnd = '#040d14';
    badgeColor = '#0284c7';
    accentColor = '#38bdf8';
    tipBg = 'rgba(2, 132, 199, 0.3)';
  } else if (category.includes('보약') || category.includes('공진단')) {
    bgGradStart = '#1a1205';
    bgGradMid = '#33230a';
    bgGradEnd = '#0f0a03';
    badgeColor = '#b45309';
    accentColor = '#fbbf24';
    tipBg = 'rgba(180, 83, 9, 0.3)';
  } else if (category.includes('부종')) {
    bgGradStart = '#051a14';
    bgGradMid = '#0b3528';
    bgGradEnd = '#03100c';
    badgeColor = '#059669';
    accentColor = '#34d399';
    tipBg = 'rgba(5, 150, 105, 0.3)';
  }

  // Split title into 2 punchy lines
  let line1 = title;
  let line2 = '';
  if (title.includes(',')) {
    const parts = title.split(',');
    line1 = parts[0].trim();
    line2 = parts.slice(1).join(',').trim();
  } else if (title.includes('?')) {
    const parts = title.split('?');
    line1 = parts[0].trim() + '?';
    line2 = parts.slice(1).join('').trim();
  } else if (title.length > 22) {
    const mid = Math.floor(title.length / 2);
    const spaceIdx = title.indexOf(' ', mid - 4);
    if (spaceIdx !== -1) {
      line1 = title.substring(0, spaceIdx).trim();
      line2 = title.substring(spaceIdx).trim();
    }
  }

  const svg = `<svg width="1080" height="1080" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgGradStart}" />
      <stop offset="50%" stop-color="${bgGradMid}" />
      <stop offset="100%" stop-color="${bgGradEnd}" />
    </linearGradient>
    <filter id="blurEffect" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="110" />
    </filter>
  </defs>

  <!-- Background -->
  <rect x="0" y="0" width="1080" height="1080" fill="url(#bgGrad)" />

  <!-- Ambient Glow -->
  <circle cx="950" cy="140" r="360" fill="${accentColor}" opacity="0.22" filter="url(#blurEffect)" />
  <circle cx="120" cy="940" r="320" fill="${badgeColor}" opacity="0.28" filter="url(#blurEffect)" />

  <!-- Top Header Bar (Exact match to healimbp insta card) -->
  <g transform="translate(60, 55)">
    <rect x="0" y="0" width="960" height="66" rx="33" fill="rgba(255, 255, 255, 0.08)" stroke="rgba(255, 255, 255, 0.16)" stroke-width="1.5" />
    <circle cx="40" cy="33" r="18" fill="${badgeColor}" />
    <text x="40" y="40" font-size="16" font-weight="900" fill="#ffffff" text-anchor="middle" font-family="'Pretendard', 'Malgun Gothic', sans-serif">H</text>
    <text x="75" y="41" font-size="22" font-weight="700" fill="#ffffff" font-family="'Pretendard', 'Malgun Gothic', sans-serif">해아림한의원 부평점 통합진료센터</text>
    <rect x="760" y="15" width="175" height="36" rx="18" fill="rgba(255, 255, 255, 0.12)" />
    <text x="847" y="39" font-size="16" font-weight="800" fill="${accentColor}" text-anchor="middle" font-family="'Pretendard', 'Malgun Gothic', sans-serif">한방침구과 전문의</text>
  </g>

  <!-- Category Badge -->
  <g transform="translate(60, 165)">
    <rect x="0" y="0" width="280" height="48" rx="24" fill="${badgeColor}" />
    <text x="140" y="31" font-size="20" font-weight="800" fill="#ffffff" text-anchor="middle" font-family="'Pretendard', 'Malgun Gothic', sans-serif">
      ${escapeXML(category)}
    </text>
  </g>

  <!-- Main Headline Title (Bold & Crisp) -->
  <g transform="translate(60, 275)">
    <text font-family="'Pretendard', 'Malgun Gothic', sans-serif">
      <tspan x="0" y="0" font-size="50" font-weight="900" fill="#ffffff" text-anchor="start">${escapeXML(line1)}</tspan>
      ${line2 ? `<tspan x="0" y="68" font-size="46" font-weight="800" fill="#e2e8f0" text-anchor="start">${escapeXML(line2)}</tspan>` : ''}
    </text>
  </g>

  <!-- Subtitle Card (TIP Bar) -->
  <g transform="translate(60, 490)">
    <rect x="0" y="0" width="960" height="110" rx="22" fill="rgba(255, 255, 255, 0.06)" stroke="rgba(255, 255, 255, 0.14)" stroke-width="1.5" />
    <rect x="35" y="30" width="50" height="50" rx="25" fill="${tipBg}" />
    <text x="60" y="62" font-size="20" font-weight="900" fill="${accentColor}" text-anchor="middle" font-family="'Pretendard', 'Malgun Gothic', sans-serif">TIP</text>
    <text x="105" y="65" font-size="22" font-weight="600" fill="#e2e8f0" font-family="'Pretendard', 'Malgun Gothic', sans-serif">
      ${escapeXML(tip || '방치하면 만성화되는 통증과 염증, 조기 원인 치료가 핵심입니다')}
    </text>
  </g>

  <!-- 3 Key Topic Pillars (3개 카드 뉴스 블록) -->
  <g transform="translate(60, 640)">
    <!-- Box 1 -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="300" height="250" rx="24" fill="rgba(15, 23, 42, 0.88)" stroke="${accentColor}" stroke-width="1.5" stroke-opacity="0.4" />
      <rect x="25" y="25" width="60" height="32" rx="16" fill="${badgeColor}" />
      <text x="55" y="47" font-size="15" font-weight="800" fill="#ffffff" text-anchor="middle" font-family="'Pretendard', 'Malgun Gothic', sans-serif">01</text>
      <text x="100" y="49" font-size="22" font-weight="800" fill="#ffffff" font-family="'Pretendard', 'Malgun Gothic', sans-serif">자가진단</text>
      <text font-family="'Pretendard', 'Malgun Gothic', sans-serif">
        <tspan x="25" y="115" font-size="19" font-weight="500" fill="#94a3b8" text-anchor="start">${escapeXML(pillar1?.t1 || '내 증상 위험도')}</tspan>
        <tspan x="25" y="150" font-size="19" font-weight="500" fill="#94a3b8" text-anchor="start">${escapeXML(pillar1?.t2 || '30초 자가 체크')}</tspan>
      </text>
    </g>

    <!-- Box 2 -->
    <g transform="translate(330, 0)">
      <rect x="0" y="0" width="300" height="250" rx="24" fill="rgba(15, 23, 42, 0.88)" stroke="${accentColor}" stroke-width="1.5" stroke-opacity="0.4" />
      <rect x="25" y="25" width="60" height="32" rx="16" fill="${badgeColor}" />
      <text x="55" y="47" font-size="15" font-weight="800" fill="#ffffff" text-anchor="middle" font-family="'Pretendard', 'Malgun Gothic', sans-serif">02</text>
      <text x="100" y="49" font-size="22" font-weight="800" fill="#ffffff" font-family="'Pretendard', 'Malgun Gothic', sans-serif">원인분석</text>
      <text font-family="'Pretendard', 'Malgun Gothic', sans-serif">
        <tspan x="25" y="115" font-size="19" font-weight="500" fill="#94a3b8" text-anchor="start">${escapeXML(pillar2?.t1 || '근막·신경·기혈')}</tspan>
        <tspan x="25" y="150" font-size="19" font-weight="500" fill="#94a3b8" text-anchor="start">${escapeXML(pillar2?.t2 || '핵심 발병 기전')}</tspan>
      </text>
    </g>

    <!-- Box 3 -->
    <g transform="translate(660, 0)">
      <rect x="0" y="0" width="300" height="250" rx="24" fill="rgba(15, 23, 42, 0.88)" stroke="${accentColor}" stroke-width="1.5" stroke-opacity="0.4" />
      <rect x="25" y="25" width="60" height="32" rx="16" fill="${badgeColor}" />
      <text x="55" y="47" font-size="15" font-weight="800" fill="#ffffff" text-anchor="middle" font-family="'Pretendard', 'Malgun Gothic', sans-serif">03</text>
      <text x="100" y="49" font-size="22" font-weight="800" fill="#ffffff" font-family="'Pretendard', 'Malgun Gothic', sans-serif">맞춤치료</text>
      <text font-family="'Pretendard', 'Malgun Gothic', sans-serif">
        <tspan x="25" y="115" font-size="19" font-weight="500" fill="#94a3b8" text-anchor="start">${escapeXML(pillar3?.t1 || '추나·약침·한약')}</tspan>
        <tspan x="25" y="150" font-size="19" font-weight="500" fill="#94a3b8" text-anchor="start">${escapeXML(pillar3?.t2 || '1:1 비수술 솔루션')}</tspan>
      </text>
    </g>
  </g>

  <!-- Bottom Footer Bar -->
  <g transform="translate(60, 970)">
    <line x1="0" y1="0" x2="960" y2="0" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1" />
    <text x="0" y="38" font-size="18" font-weight="600" fill="#94a3b8" font-family="'Pretendard', 'Malgun Gothic', sans-serif">
      인천 부평구 경원대로 1404 그랑프리빌딩 7층 (부평역 7번 출구 도보 1분) ｜ ☎ 032-719-3472
    </text>
    <text x="960" y="38" font-size="18" font-weight="800" fill="${accentColor}" text-anchor="end" font-family="'Pretendard', 'Malgun Gothic', sans-serif">
      해아림한의원 부평점
    </text>
  </g>
</svg>`;

  return svg;
}

module.exports = { generateCardThumbnailSVG };
