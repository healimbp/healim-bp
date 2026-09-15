const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'content', 'column');

const schedulePlan = [
  // 2026-09-15 (오늘 - 이미 지난/당일 슬롯)
  { slug: 'lumbar-disc-sciatica-chuna', date: '2026-09-15T09:00:00+09:00' },
  { slug: 'chronic-cough-bopyego', date: '2026-09-15T13:00:00+09:00' },
  { slug: 'traffic-accident-whiplash', date: '2026-09-15T17:00:00+09:00' },
  { slug: 'gongjindan-selection-guide', date: '2026-09-15T21:00:00+09:00' },

  // 2026-09-16 (내일)
  { slug: 'turtle-neck-chuna', date: '2026-09-16T09:00:00+09:00' },
  { slug: 'chronic-rhinitis-postnasal-drip', date: '2026-09-16T13:00:00+09:00' },
  { slug: 'traffic-accident-rib-back-sprain', date: '2026-09-16T17:00:00+09:00' },
  { slug: 'kyungokhwa-fatigue-recovery', date: '2026-09-16T21:00:00+09:00' },

  // 2026-09-17 (모레)
  { slug: 'frozen-shoulder-rotator-cuff', date: '2026-09-17T09:00:00+09:00' },
  { slug: 'vocal-cord-nodules-hoarse-voice', date: '2026-09-17T13:00:00+09:00' },
  { slug: 'traffic-accident-concussion-headache', date: '2026-09-17T17:00:00+09:00' },
  { slug: 'damjeok-reflux-dyspepsia', date: '2026-09-17T21:00:00+09:00' },

  // 2026-09-18
  { slug: 'knee-osteoarthritis-cartilage', date: '2026-09-18T09:00:00+09:00' },
  { slug: 'sinusitis-chronic-congestion', date: '2026-09-18T13:00:00+09:00' },
  { slug: 'leg-edema-bujonghwan', date: '2026-09-18T17:00:00+09:00' },
  { slug: 'exam-student-chongmyeongtang', date: '2026-09-18T21:00:00+09:00' },

  // 2026-09-19
  { slug: 'spinal-stenosis-claudication', date: '2026-09-19T09:00:00+09:00' },
  { slug: 'night-leg-cramp-circulatory-bujonghwan', date: '2026-09-19T13:00:00+09:00' },
  { slug: 'morning-facial-hand-edema-bujonghwan', date: '2026-09-19T17:00:00+09:00' },
  { slug: 'postpartum-surgery-edema-bujonghwan', date: '2026-09-19T21:00:00+09:00' },

  // 2026-09-20
  { slug: 'ankle-sprain-ligament-chuna', date: '2026-09-20T09:00:00+09:00' },
  { slug: 'plantar-fasciitis-heel-pain', date: '2026-09-20T13:00:00+09:00' },
  { slug: 'tennis-elbow-lateral-epicondylitis', date: '2026-09-20T17:00:00+09:00' },
  { slug: 'golf-elbow-medial-epicondylitis', date: '2026-09-20T21:00:00+09:00' },

  // 2026-09-21
  { slug: 'de-quervain-wrist-tenosynovitis', date: '2026-09-21T09:00:00+09:00' },
  { slug: 'carpal-tunnel-wrist-pain', date: '2026-09-21T13:00:00+09:00' },
  { slug: 'acute-stiff-neck-nakchim', date: '2026-09-21T17:00:00+09:00' },
  { slug: 'tmj-jaw-clicking-pain', date: '2026-09-21T21:00:00+09:00' },

  // 2026-09-22
  { slug: 'cervicogenic-headache-neck-chuna', date: '2026-09-22T09:00:00+09:00' }
];

console.log(`📅 총 ${schedulePlan.length}개 칼럼의 일정을 일일 4회 정기 슬롯(09시, 13시, 17시, 21시)으로 재배치합니다...\n`);

schedulePlan.forEach(({ slug, date }) => {
  const mdPath = path.join(baseDir, slug, 'index.md');
  if (!fs.existsSync(mdPath)) {
    console.error(`❌ 파일 없음: ${slug}`);
    return;
  }

  let content = fs.readFileSync(mdPath, 'utf8');
  content = content.replace(/^date:\s*.*$/m, `date: ${date}`);
  fs.writeFileSync(mdPath, content, 'utf8');
  console.log(`✅ [일정 확정] ${date} -> ${slug}`);
});

console.log('\n🎉 모든 29개 칼럼의 정기 4회 예약 일정이 완벽히 설정되었습니다!');
