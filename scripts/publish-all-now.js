const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'content', 'column');

// 28 columns in logical chronological order (from older to newest up to today 2026-09-15 12:00 KST)
const columnSchedule = [
  { slug: 'gongjindan-selection-guide', date: '2026-09-01T09:00:00+09:00' },
  { slug: 'kyungokhwa-fatigue-recovery', date: '2026-09-01T15:00:00+09:00' },
  { slug: 'traffic-accident-whiplash', date: '2026-09-02T09:00:00+09:00' },
  { slug: 'traffic-accident-rib-back-sprain', date: '2026-09-02T15:00:00+09:00' },
  { slug: 'traffic-accident-concussion-headache', date: '2026-09-03T09:00:00+09:00' },
  { slug: 'turtle-neck-chuna', date: '2026-09-04T09:00:00+09:00' },
  { slug: 'cervicogenic-headache-neck-chuna', date: '2026-09-04T15:00:00+09:00' },
  { slug: 'lumbar-disc-sciatica-chuna', date: '2026-09-05T09:00:00+09:00' },
  { slug: 'spinal-stenosis-claudication', date: '2026-09-05T15:00:00+09:00' },
  { slug: 'acute-stiff-neck-nakchim', date: '2026-09-06T09:00:00+09:00' },
  { slug: 'frozen-shoulder-rotator-cuff', date: '2026-09-07T09:00:00+09:00' },
  { slug: 'tennis-elbow-lateral-epicondylitis', date: '2026-09-07T15:00:00+09:00' },
  { slug: 'golf-elbow-medial-epicondylitis', date: '2026-09-08T09:00:00+09:00' },
  { slug: 'carpal-tunnel-wrist-pain', date: '2026-09-08T15:00:00+09:00' },
  { slug: 'ankle-sprain-ligament-chuna', date: '2026-09-09T09:00:00+09:00' },
  { slug: 'plantar-fasciitis-heel-pain', date: '2026-09-09T15:00:00+09:00' },
  { slug: 'knee-osteoarthritis-cartilage', date: '2026-09-10T09:00:00+09:00' },
  { slug: 'tmj-jaw-clicking-pain', date: '2026-09-10T15:00:00+09:00' },
  { slug: 'chronic-cough-bopyego', date: '2026-09-11T09:00:00+09:00' },
  { slug: 'vocal-cord-nodules-hoarse-voice', date: '2026-09-11T15:00:00+09:00' },
  { slug: 'chronic-rhinitis-postnasal-drip', date: '2026-09-12T09:00:00+09:00' },
  { slug: 'sinusitis-chronic-congestion', date: '2026-09-12T15:00:00+09:00' },
  { slug: 'damjeok-reflux-dyspepsia', date: '2026-09-13T09:00:00+09:00' },
  { slug: 'exam-student-chongmyeongtang', date: '2026-09-13T15:00:00+09:00' },
  { slug: 'leg-edema-bujonghwan', date: '2026-09-14T09:00:00+09:00' },
  { slug: 'morning-facial-hand-edema-bujonghwan', date: '2026-09-14T15:00:00+09:00' },
  { slug: 'postpartum-surgery-edema-bujonghwan', date: '2026-09-15T09:00:00+09:00' },
  { slug: 'night-leg-cramp-circulatory-bujonghwan', date: '2026-09-15T11:00:00+09:00' }
];

let updatedCount = 0;

columnSchedule.forEach(item => {
  const filePath = path.join(baseDir, item.slug, 'index.md');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Replace date: ... with item.date
    content = content.replace(/^date:\s*.*$/m, `date: ${item.date}`);
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
    console.log(`✅ 날짜 업데이트: ${item.slug} -> ${item.date}`);
  } else {
    console.warn(`⚠️ 파일 없음: ${filePath}`);
  }
});

console.log(`\n🎉 총 ${updatedCount}개 칼럼의 발행일이 2026년 9월 1일~15일로 즉시 발행 설정되었습니다!`);
