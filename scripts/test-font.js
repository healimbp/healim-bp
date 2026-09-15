const fs = require('fs');
const path = require('path');
const { Resvg, initWasm } = require('@resvg/resvg-js');

const svg = `<svg width="500" height="200" viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="500" height="200" fill="#ffffff"/>
  <text x="250" y="80" font-size="32" font-weight="900" fill="#0f172a" text-anchor="middle" font-family="Pretendard, 'Malgun Gothic', '맑은 고딕', sans-serif">
    테스트: 맑은 고딕 볼드 한글
  </text>
  <text x="250" y="140" font-size="20" font-weight="700" fill="#2563eb" text-anchor="middle" font-family="Pretendard, 'Malgun Gothic', '맑은 고딕', sans-serif">
    해아림한의원 부평점 통합진료센터
  </text>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 500 },
  font: {
    fontDirs: ['C:\\Windows\\Fonts'],
    loadSystemFonts: true,
    defaultFontFamily: 'Malgun Gothic'
  }
});

const pngData = resvg.render();
fs.writeFileSync(path.join(__dirname, 'test-font.png'), pngData.asPng());
console.log('Saved test-font.png successfully!');
