const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const baseDir = path.join(__dirname, '..', 'content', 'column');
const thumbsDir = path.join(__dirname, '..', 'static', 'thumbnails');
const scriptsDir = path.join(__dirname);

// 1. Process all Markdown articles
const dirs = fs.readdirSync(baseDir).filter(d => !d.startsWith('_') && fs.statSync(path.join(baseDir, d)).isDirectory());

let mdUpdatedCount = 0;

dirs.forEach(slug => {
  const mdPath = path.join(baseDir, slug, 'index.md');
  if (!fs.existsSync(mdPath)) return;

  let content = fs.readFileSync(mdPath, 'utf8');
  const original = content;

  // Replacements for 침도 / Acupotomy
  content = content
    .replace(/미세 유착 박리 침도요법\(Acupotomy\)/g, '심부 근막 이완 전침 & 소염약침 요법')
    .replace(/미세 유착 박리 침도요법/g, '심부 근막 이완 전침 & 소염약침 요법')
    .replace(/미세 침도 유착 박리/g, '심부 근막 이완 & 정밀 소염약침')
    .replace(/미세 침도 박리술/g, '심부 전침 및 신경감압 약침술')
    .replace(/미세 침도 박리/g, '심부 전침 및 소염약침 치료')
    .replace(/미세 침도 절개/g, '정밀 약침 및 근막 이완')
    .replace(/침도요법\(Acupotomy\)/g, '소염약침 및 심부 전침 요법')
    .replace(/침도요법/g, '소염약침 및 심부 전침 요법')
    .replace(/침도 치료/g, '소염약침 및 전침 치료')
    .replace(/침도치료/g, '소염약침 및 심부전침치료')
    .replace(/소염약침 & 침도/g, '소염약침 & 전침치료')
    .replace(/소염약침과 침도/g, '소염약침과 심부전침')
    .replace(/약침과 침도/g, '약침과 심부 전침')
    .replace(/약침·침도/g, '약침·전침')
    .replace(/침도/g, '심부 전침')
    .replace(/Acupotomy/gi, 'Deep Electroacupuncture');

  if (content !== original) {
    fs.writeFileSync(mdPath, content, 'utf8');
    mdUpdatedCount++;
    console.log(`✅ [MD 수정 완료] ${slug}`);
  }
});

console.log(`\n🎉 총 ${mdUpdatedCount}개 칼럼에서 침도 관련 문구를 소염약침·심부전침으로 교체 완료!`);

// 2. Process all SVG and PNG thumbnails
const svgFiles = fs.readdirSync(thumbsDir).filter(f => f.endsWith('.svg'));
let svgUpdatedCount = 0;

svgFiles.forEach(file => {
  const svgPath = path.join(thumbsDir, file);
  let svgContent = fs.readFileSync(svgPath, 'utf8');
  const original = svgContent;

  svgContent = svgContent
    .replace(/침도요법/g, '소염약침')
    .replace(/침도치료/g, '전침치료')
    .replace(/침도/g, '약침')
    .replace(/Acupotomy/gi, 'Pharmacopuncture');

  if (svgContent !== original) {
    fs.writeFileSync(svgPath, svgContent, 'utf8');
    // Re-render PNG
    const pngPath = svgPath.replace(/\.svg$/, '.png');
    const resvg = new Resvg(svgContent, { fitTo: { mode: 'width', value: 1080 } });
    fs.writeFileSync(pngPath, resvg.render().asPng());
    svgUpdatedCount++;
    console.log(`🖼️ [썸네일 수정 및 재렌더링] ${file} -> PNG 생성 완료`);
  }
});

console.log(`\n🎉 총 ${svgUpdatedCount}개 썸네일에서 침도 문구 수정 및 고화질 PNG 재생성 완료!`);

// 3. Process scripts that define article templates
const scriptFiles = [
  'build-deep-medical-columns.js',
  'build-deep-part1.js',
  'build-all-exact-thumbnails.js',
  'generate-part1.js',
  'generate-part2.js',
  'setup-complete-publishing-system.js'
];

scriptFiles.forEach(sf => {
  const sp = path.join(scriptsDir, sf);
  if (!fs.existsSync(sp)) return;
  let sContent = fs.readFileSync(sp, 'utf8');
  const original = sContent;

  sContent = sContent
    .replace(/미세 유착 박리 침도요법\(Acupotomy\)/g, '심부 근막 이완 전침 & 소염약침 요법')
    .replace(/미세 유착 박리 침도요법/g, '심부 근막 이완 전침 & 소염약침 요법')
    .replace(/미세 침도 유착 박리/g, '심부 근막 이완 & 정밀 소염약침')
    .replace(/미세 침도 박리술/g, '심부 전침 및 신경감압 약침술')
    .replace(/미세 침도 박리/g, '심부 전침 및 소염약침 치료')
    .replace(/침도요법\(Acupotomy\)/g, '소염약침 및 심부 전침 요법')
    .replace(/침도요법/g, '소염약침 및 심부 전침 요법')
    .replace(/침도 치료/g, '소염약침 및 전침 치료')
    .replace(/침도치료/g, '소염약침 및 심부전침치료')
    .replace(/소염약침 & 침도/g, '소염약침 & 전침치료')
    .replace(/소염약침과 침도/g, '소염약침과 심부전침')
    .replace(/약침과 침도/g, '약침과 심부 전침')
    .replace(/약침·침도/g, '약침·전침')
    .replace(/침도/g, '심부 전침')
    .replace(/Acupotomy/gi, 'Deep Electroacupuncture');

  if (sContent !== original) {
    fs.writeFileSync(sp, sContent, 'utf8');
    console.log(`📝 [스크립트 템플릿 수정 완료] ${sf}`);
  }
});
