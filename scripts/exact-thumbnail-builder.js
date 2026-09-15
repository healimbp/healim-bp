function escapeXML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    // Remove Hanja inside parentheses e.g. (落枕) or (痰積病)
    .replace(/\([\u4e00-\u9fa5\s·]+\)/g, '')
    .trim();
}

function generateCleanCardSVG({
  category = '척추·관절 & 추나 클리닉',
  subHook = '자고 일어났을 때 목 안 돌아가는 "급성 관절 잠김"',
  title = '급성 낙침 · 목 결림 한방 치료',
  subTitle = '굳어버린 경추 후관절을 풀고 가동성을 되찾는 동작침 & 추나',
  step1 = { title: '경추 후관절낭 감돈 & 근육 연축 정밀 진단', desc: '목 디스크 급성 방사통과의 정밀 감별 및 관절 잠김 체크' },
  step2 = { title: '즉각 가동성 회복 동작침법 (MSAT)', desc: '침을 맞고 고개를 돌려 5분 만에 굳은 관절 잠김 해제' },
  step3 = { title: '경추 관절 가동 추나 & 소염약침', desc: 'C커브 정상화 및 후관절 활액막염 즉각 진정' }
}) {
  const cleanTitle = escapeXML(title);
  const cleanCategory = escapeXML(category);
  const cleanSubHook = escapeXML(subHook);
  const cleanSubTitle = escapeXML(subTitle);

  const svg = `<svg width="900" height="960" viewBox="0 0 900 960" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient (Dark Teal-Navy) -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#081b18" />
      <stop offset="100%" stop-color="#061219" />
    </linearGradient>

    <!-- Card Shadow -->
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Outer Dark Teal/Navy Canvas -->
  <rect x="0" y="0" width="900" height="960" rx="36" fill="url(#bgGrad)" />

  <!-- Top Floating Pill (Teal / Forest Green) -->
  <g transform="translate(450, 64)">
    <rect x="-190" y="-22" width="380" height="44" rx="22" fill="#0d9488" />
    <text x="0" y="6" font-size="16.5" font-weight="900" fill="#ffffff" text-anchor="middle" font-family="Pretendard, 'Malgun Gothic', sans-serif" letter-spacing="-0.02em">
      ${cleanCategory}
    </text>
  </g>

  <!-- Inner Pure White Card -->
  <g filter="url(#cardShadow)">
    <rect x="45" y="112" width="810" height="804" rx="32" fill="#ffffff" />
  </g>

  <!-- Content inside White Card -->
  <!-- 1. Sub-Hook Pill (Light Mint Green Background + Dark Green Bold Text) -->
  <g transform="translate(90, 155)">
    <rect x="0" y="0" width="580" height="38" rx="8" fill="#ecfdf5" />
    <text x="16" y="25" font-size="16" font-weight="900" fill="#047857" font-family="Pretendard, 'Malgun Gothic', sans-serif" letter-spacing="-0.02em">
      ${cleanSubHook}
    </text>
  </g>

  <!-- 2. Main Title (High-Impact Crisp Pitch Black) -->
  <g transform="translate(90, 235)">
    <text font-size="36" font-weight="900" fill="#0f172a" font-family="Pretendard, 'Malgun Gothic', sans-serif" letter-spacing="-0.03em">
      ${cleanTitle}
    </text>
  </g>

  <!-- 3. Subtitle Description -->
  <g transform="translate(90, 275)">
    <text font-size="20" font-weight="800" fill="#334155" font-family="Pretendard, 'Malgun Gothic', sans-serif" letter-spacing="-0.02em">
      ${cleanSubTitle}
    </text>
  </g>

  <!-- 4. Subtle Dashed Divider Line -->
  <line x1="90" y1="305" x2="810" y2="305" stroke="#e2e8f0" stroke-width="1.5" stroke-dasharray="6,6" />

  <!-- 5. Step 01 Card (Mint/Teal Accent) -->
  <g transform="translate(90, 330)">
    <rect x="0" y="0" width="720" height="114" rx="16" fill="#f0fdfa" stroke="#ccfbf1" stroke-width="1.5" />
    <!-- Number Badge Icon -->
    <rect x="18" y="20" width="74" height="74" rx="12" fill="#e6fffa" />
    <circle cx="55" cy="57" r="24" fill="#0d9488" />
    <text x="55" y="65" font-size="22" font-weight="900" fill="#ffffff" text-anchor="middle" font-family="Pretendard, 'Malgun Gothic', sans-serif">1</text>
    <!-- Card Text -->
    <text x="110" y="46" font-size="20" font-weight="900" fill="#0f172a" font-family="Pretendard, 'Malgun Gothic', sans-serif" letter-spacing="-0.02em">
      ${escapeXML(step1.title)}
    </text>
    <text x="110" y="76" font-size="14.5" font-weight="600" fill="#475569" font-family="Pretendard, 'Malgun Gothic', sans-serif" letter-spacing="-0.01em">
      ${escapeXML(step1.desc)}
    </text>
  </g>

  <!-- 6. Step 02 Card (Warm Amber Accent) -->
  <g transform="translate(90, 462)">
    <rect x="0" y="0" width="720" height="114" rx="16" fill="#fefce8" stroke="#fef08a" stroke-width="1.5" />
    <!-- Number Badge Icon -->
    <rect x="18" y="20" width="74" height="74" rx="12" fill="#fef9c3" />
    <circle cx="55" cy="57" r="24" fill="#d97706" />
    <text x="55" y="65" font-size="22" font-weight="900" fill="#ffffff" text-anchor="middle" font-family="Pretendard, 'Malgun Gothic', sans-serif">2</text>
    <!-- Card Text -->
    <text x="110" y="46" font-size="20" font-weight="900" fill="#0f172a" font-family="Pretendard, 'Malgun Gothic', sans-serif" letter-spacing="-0.02em">
      ${escapeXML(step2.title)}
    </text>
    <text x="110" y="76" font-size="14.5" font-weight="600" fill="#475569" font-family="Pretendard, 'Malgun Gothic', sans-serif" letter-spacing="-0.01em">
      ${escapeXML(step2.desc)}
    </text>
  </g>

  <!-- 7. Step 03 Card (Cool Blue Accent) -->
  <g transform="translate(90, 594)">
    <rect x="0" y="0" width="720" height="114" rx="16" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5" />
    <!-- Number Badge Icon -->
    <rect x="18" y="20" width="74" height="74" rx="12" fill="#dbeafe" />
    <circle cx="55" cy="57" r="24" fill="#2563eb" />
    <text x="55" y="65" font-size="22" font-weight="900" fill="#ffffff" text-anchor="middle" font-family="Pretendard, 'Malgun Gothic', sans-serif">3</text>
    <!-- Card Text -->
    <text x="110" y="46" font-size="20" font-weight="900" fill="#0f172a" font-family="Pretendard, 'Malgun Gothic', sans-serif" letter-spacing="-0.02em">
      ${escapeXML(step3.title)}
    </text>
    <text x="110" y="76" font-size="14.5" font-weight="600" fill="#475569" font-family="Pretendard, 'Malgun Gothic', sans-serif" letter-spacing="-0.01em">
      ${escapeXML(step3.desc)}
    </text>
  </g>

  <!-- 8. Bottom Dark Navy Footer Capsule -->
  <g transform="translate(90, 735)">
    <rect x="0" y="0" width="720" height="54" rx="14" fill="#0f172a" />
    <text x="360" y="33" font-size="15.5" font-weight="800" fill="#ffffff" text-anchor="middle" font-family="Pretendard, 'Malgun Gothic', sans-serif" letter-spacing="-0.02em">
      해아림한의원 부평점 · 1:1 맞춤 통합진료 클리닉 (부평역 7번 출구 도보 1분)
    </text>
  </g>
</svg>`;

  return svg;
}

module.exports = { generateCleanCardSVG };
