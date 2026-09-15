const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const columnsDir = path.join(__dirname, '..', 'content', 'column');
const outDir = path.join(__dirname, '..', 'static', 'thumbnails');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function escapeXML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function splitTitleForCard(title) {
  // Try splitting by comma or question mark or colon
  if (title.includes(',')) {
    const parts = title.split(',');
    return {
      line1: parts[0].trim(),
      line2: parts.slice(1).join(',').trim()
    };
  }
  if (title.includes('?')) {
    const parts = title.split('?');
    return {
      line1: parts[0].trim() + '?',
      line2: parts.slice(1).join('').trim()
    };
  }
  if (title.length > 25) {
    const mid = Math.floor(title.length / 2);
    const spaceIdx = title.indexOf(' ', mid - 5);
    if (spaceIdx !== -1) {
      return {
        line1: title.substring(0, spaceIdx).trim(),
        line2: title.substring(spaceIdx).trim()
      };
    }
  }
  return { line1: title, line2: '' };
}

function generateSVG({ title, category, tags, slug }) {
  const { line1, line2 } = splitTitleForCard(title);
  
  // Category color accents
  let badgeBg = '#2F5D50';
  let accentColor = '#38bdf8';
  if (category.includes('부종')) {
    badgeBg = '#059669';
    accentColor = '#34d399';
  } else if (category.includes('교통사고')) {
    badgeBg = '#dc2626';
    accentColor = '#f87171';
  } else if (category.includes('호흡기') || category.includes('기침')) {
    badgeBg = '#0284c7';
    accentColor = '#38bdf8';
  } else if (category.includes('보약') || category.includes('공진단')) {
    badgeBg = '#b45309';
    accentColor = '#fbbf24';
  }

  const svg = `<svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#091b15" />
      <stop offset="50%" stop-color="#122f25" />
      <stop offset="100%" stop-color="#071510" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.08)" />
      <stop offset="100%" stop-color="rgba(255,255,255,0.02)" />
    </linearGradient>
    <filter id="glow1" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="90" result="blur" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="675" fill="url(#bgGrad)" />

  <!-- Ambient Glow -->
  <circle cx="1050" cy="120" r="300" fill="${accentColor}" opacity="0.15" filter="url(#glow1)" />
  <circle cx="150" cy="550" r="280" fill="#2F5D50" opacity="0.25" filter="url(#glow1)" />

  <!-- Outer Glass Frame -->
  <rect x="40" y="40" width="1120" height="595" rx="24" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />

  <!-- Header Section -->
  <g transform="translate(80, 80)">
    <!-- Clinic Logo Badge -->
    <rect x="0" y="0" width="46" height="46" rx="14" fill="#2F5D50" />
    <text x="23" y="31" font-size="22" font-weight="900" fill="#ffffff" text-anchor="middle" font-family="'Pretendard', 'Malgun Gothic', sans-serif">해</text>

    <!-- Clinic Name -->
    <text x="60" y="32" font-size="22" font-weight="800" fill="#ffffff" font-family="'Pretendard', 'Malgun Gothic', sans-serif">
      해아림한의원 부평점 <tspan fill="#a7f3d0" font-weight="600" font-size="18">통합진료센터</tspan>
    </text>

    <!-- Category Badge -->
    <rect x="800" y="2" width="240" height="42" rx="21" fill="${badgeBg}" />
    <text x="920" y="28" font-size="16" font-weight="800" fill="#ffffff" text-anchor="middle" font-family="'Pretendard', 'Malgun Gothic', sans-serif">
      ${escapeXML(category)}
    </text>
  </g>

  <!-- Decorative Divider -->
  <line x1="80" y1="155" x2="1120" y2="155" stroke="rgba(255,255,255,0.1)" stroke-width="1" />

  <!-- Main Headline -->
  <g transform="translate(80, 235)">
    <text font-family="'Pretendard', 'Malgun Gothic', 'Noto Sans KR', sans-serif">
      <tspan x="0" y="0" font-size="44" font-weight="900" fill="#ffffff">${escapeXML(line1)}</tspan>
      ${line2 ? `<tspan x="0" y="65" font-size="38" font-weight="800" fill="#e2e8f0">${escapeXML(line2)}</tspan>` : ''}
    </text>
  </g>

  <!-- Subtitle Feature Card -->
  <g transform="translate(80, 395)">
    <rect x="0" y="0" width="1040" height="90" rx="18" fill="rgba(15, 23, 42, 0.6)" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
    
    <!-- Specialist Tag -->
    <rect x="25" y="24" width="170" height="42" rx="10" fill="#2F5D50" />
    <text x="110" y="50" font-size="16" font-weight="800" fill="#ffffff" text-anchor="middle" font-family="'Pretendard', 'Malgun Gothic', sans-serif">
      한방침구과 전문의
    </text>

    <text x="215" y="52" font-size="20" font-weight="700" fill="#f8fafc" font-family="'Pretendard', 'Malgun Gothic', sans-serif">
      권형근 대표원장 1:1 직접 책임 진료 ｜ 비수술 한방 솔루션
    </text>
  </g>

  <!-- Footer Information Bar -->
  <g transform="translate(80, 560)">
    <circle cx="10" cy="10" r="5" fill="#34d399" />
    <text x="25" y="16" font-size="16" font-weight="600" fill="#94a3b8" font-family="'Pretendard', 'Malgun Gothic', sans-serif">
      인천 부평구 경원대로 1412, 2층 (부평역 7번 출구 도보 5분)
    </text>

    <text x="1040" y="16" font-size="17" font-weight="800" fill="#fbbf24" text-anchor="end" font-family="'Pretendard', 'Malgun Gothic', sans-serif">
      ☎ 032-719-3472
    </text>
  </g>
</svg>`;

  return svg;
}

const dirs = fs.readdirSync(columnsDir).filter(d => !d.startsWith('_') && fs.statSync(path.join(columnsDir, d)).isDirectory());

console.log(`🎨 총 ${dirs.length}개 칼럼의 16:9 메인 대표 썸네일 이미지를 생성합니다...\n`);

dirs.forEach((slug, idx) => {
  const mdPath = path.join(columnsDir, slug, 'index.md');
  if (!fs.existsSync(mdPath)) return;

  const content = fs.readFileSync(mdPath, 'utf8');
  const titleMatch = content.match(/title:\s*"([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : slug;

  const categoryMatch = content.match(/category:\s*"([^"]+)"/);
  const category = categoryMatch ? categoryMatch[1] : '건강 칼럼';

  const tagsMatch = content.match(/tags:\s*\[(.*?)\]/);
  let tags = [];
  if (tagsMatch) {
    tags = tagsMatch[1].split(',').map(t => t.trim().replace(/^["']|["']$/g, ''));
  }

  const svg = generateSVG({ title, category, tags, slug });
  
  // Save SVG
  const svgPath = path.join(outDir, `${slug}.svg`);
  fs.writeFileSync(svgPath, svg, 'utf8');

  // Render PNG with resvg
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1200
    }
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  const pngPath = path.join(outDir, `${slug}.png`);
  fs.writeFileSync(pngPath, pngBuffer);

  console.log(`[${idx + 1}/${dirs.length}] 썸네일 생성 완료: ${slug}.png`);
});

console.log(`\n🎉 모든 대표 썸네일 이미지(1200x675 PNG) 생성이 완료되었습니다! (${outDir})`);
