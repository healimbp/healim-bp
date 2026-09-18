const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const { generateCleanCardSVG, columnThumbnailDB } = require('./exact-thumbnail-builder');

const thumbsDir = path.join(__dirname, '..', 'static', 'thumbnails');
if (!fs.existsSync(thumbsDir)) {
  fs.mkdirSync(thumbsDir, { recursive: true });
}

const fontsDir = path.join(__dirname, 'fonts');
const totalSlugs = Object.keys(columnThumbnailDB);

console.log(`🎨 총 ${totalSlugs.length}개 전체 칼럼의 1:1 완벽 맞춤형 카드 썸네일 생성을 시작합니다...\n`);

totalSlugs.forEach((slug, idx) => {
  const cfg = columnThumbnailDB[slug];
  const svg = generateCleanCardSVG({ slug, ...cfg });

  const svgPath = path.join(thumbsDir, `${slug}.svg`);
  fs.writeFileSync(svgPath, svg, 'utf8');

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 900 },
    font: {
      fontDirs: [fontsDir, 'C:\\Windows\\Fonts'],
      loadSystemFonts: true,
      defaultFontFamily: 'Pretendard'
    }
  });

  const pngData = resvg.render();
  const pngPath = path.join(thumbsDir, `${slug}.png`);
  fs.writeFileSync(pngPath, pngData.asPng());
  console.log(`[${idx + 1}/${totalSlugs.length}] ✅ 1:1 맞춤 썸네일 생성 완료: ${slug}.png (${cfg.title})`);
});

console.log(`\n🎉 모든 ${totalSlugs.length}개 칼럼의 1:1 맞춤 카드 썸네일이 무결점으로 생성되었습니다!`);
