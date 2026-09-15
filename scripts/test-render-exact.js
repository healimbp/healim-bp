const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const { generateCleanCardSVG } = require('./exact-thumbnail-builder');

const svg = generateCleanCardSVG({
  category: '척추·관절 & 추나 클리닉',
  subHook: '자고 일어났을 때 목 안 돌아가는 "급성 관절 잠김"',
  title: '부평 급성 낙침 · 목 결림 한방 치료',
  subTitle: '굳어버린 경추 후관절을 풀고 가동성을 되찾는 동작침 & 추나',
  step1: { title: '경추 후관절낭 감돈 & 근육 연축 정밀 진단', desc: '목 디스크 급성 방사통과의 정밀 감별 및 관절 잠김 체크' },
  step2: { title: '즉각 가동성 회복 동작침법 (MSAT)', desc: '침을 맞고 고개를 돌려 5분 만에 굳은 관절 잠김 해제' },
  step3: { title: '경추 관절 가동 추나 & 소염약침', desc: 'C커브 정상화 및 후관절 활액막염 즉각 진정' }
});

const fontsDir = path.join(__dirname, 'fonts');
const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 900 },
  font: {
    fontDirs: [fontsDir, 'C:\\Windows\\Fonts'],
    loadSystemFonts: true,
    defaultFontFamily: 'Pretendard'
  }
});

const outPath = path.join(__dirname, '..', 'static', 'thumbnails', 'test-exact.png');
fs.writeFileSync(outPath, resvg.render().asPng());
console.log('Saved test-exact.png');
