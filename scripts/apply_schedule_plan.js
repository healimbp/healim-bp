const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'content', 'column');

// 전체 칼럼 일정표 (오늘 2026-09-19부터 2026-09-28까지 매일 4회 정기 발행)
const schedulePlan = [
  // [1] 오늘 (2026-09-19, 토)
  { slug: 'de-quervain-wrist-tenosynovitis', date: '2026-09-19T09:00:00+09:00' }, // 이미 발송 완료
  { slug: 'intercostal-neuralgia-chest-pain', date: '2026-09-19T13:00:00+09:00' },
  { slug: 'tinnitus-dizziness-autonomic-care', date: '2026-09-19T17:00:00+09:00' },
  { slug: 'chronic-ankle-instability-chuna', date: '2026-09-19T21:00:00+09:00' },

  // [2] 내일 (2026-09-20, 일)
  { slug: 'allergic-rhinitis-seasonal-bopyego', date: '2026-09-20T09:00:00+09:00' },
  { slug: 'traffic-accident-autonomic-trauma', date: '2026-09-20T13:00:00+09:00' },
  { slug: 'postpartum-body-pain-sanhuboyak', date: '2026-09-20T17:00:00+09:00' },
  { slug: 'cubital-tunnel-ulnar-nerve-chuna', date: '2026-09-20T21:00:00+09:00' },

  // [3] 모레 (2026-09-21, 월)
  { slug: 'myofascial-rhomboid-scapular-pain', date: '2026-09-21T09:00:00+09:00' },
  { slug: 'globus-hystericus-throat-lump-bopyego', date: '2026-09-21T13:00:00+09:00' },
  { slug: 'piriformis-syndrome-buttock-sciatica', date: '2026-09-21T17:00:00+09:00' },
  { slug: 'menopausal-hot-flashes-insomnia-herbal-care', date: '2026-09-21T21:00:00+09:00' },

  // [4] 2026-09-22 (화)
  { slug: 'trigger-finger-stenosing-tenosynovitis', date: '2026-09-22T09:00:00+09:00' },
  { slug: 'traffic-accident-lumbar-disc-sciatica', date: '2026-09-22T13:00:00+09:00' },
  { slug: 'chronic-laryngitis-hoarseness-bopyego', date: '2026-09-22T17:00:00+09:00' },
  { slug: 'burnout-syndrome-brain-fatigue-gongjindan', date: '2026-09-22T21:00:00+09:00' },

  // [5] 2026-09-23 (수)
  { slug: 'hallux-valgus-foot-pain-chuna', date: '2026-09-23T09:00:00+09:00' },
  { slug: 'traffic-accident-wrist-ankle-impact-sprain', date: '2026-09-23T13:00:00+09:00' },
  { slug: 'dry-cough-airconditioner-heater-bopyego', date: '2026-09-23T17:00:00+09:00' },
  { slug: 'male-menopause-stamina-vitality-tonic', date: '2026-09-23T21:00:00+09:00' },

  // [6] 2026-09-24 (목)
  { slug: 'thoracic-outlet-syndrome-arm-numbness', date: '2026-09-24T09:00:00+09:00' },
  { slug: 'traffic-accident-tinnitus-dizziness-syndrome', date: '2026-09-24T13:00:00+09:00' },
  { slug: 'reflux-laryngitis-throat-clearing-bopyego', date: '2026-09-24T17:00:00+09:00' },
  { slug: 'post-surgery-chemo-recovery-immune-tonic', date: '2026-09-24T21:00:00+09:00' },

  // [7] 2026-09-25 (금)
  { slug: 'pes-anserine-bursitis-knee-pain', date: '2026-09-25T09:00:00+09:00' },
  { slug: 'traffic-accident-pediatric-night-terrors', date: '2026-09-25T13:00:00+09:00' },
  { slug: 'pediatric-sinusitis-rhinitis-drainage', date: '2026-09-25T17:00:00+09:00' },
  { slug: 'pediatric-growth-immunity-herbal-tonic', date: '2026-09-25T21:00:00+09:00' },

  // [8] 2026-09-26 (토)
  { slug: 'achilles-tendinitis-heel-pain', date: '2026-09-26T09:00:00+09:00' },
  { slug: 'traffic-accident-clavicle-chest-contusion', date: '2026-09-26T13:00:00+09:00' },
  { slug: 'bronchiectasis-chronic-phlegm-bopyego', date: '2026-09-26T17:00:00+09:00' },
  { slug: 'elderly-frailty-appetite-deer-antler-tonic', date: '2026-09-26T21:00:00+09:00' },

  // [9] 2026-09-27 (일)
  { slug: 'cervical-facet-syndrome-neck-pain', date: '2026-09-27T09:00:00+09:00' },
  { slug: 'traffic-accident-insurance-treatment-guide', date: '2026-09-27T13:00:00+09:00' },
  { slug: 'vocal-polyp-voice-restoration-bopyego', date: '2026-09-27T17:00:00+09:00' },
  { slug: 'exam-student-concentration-chongmyeongtang', date: '2026-09-27T21:00:00+09:00' },

  // [10] 2026-09-28 (월)
  { slug: 'trapezius-myofascial-pain-syndrome', date: '2026-09-28T09:00:00+09:00' },
  { slug: 'spondylolisthesis-lumbar-instability-chuna', date: '2026-09-28T13:00:00+09:00' },
  { slug: 'allergic-rhinitis-cold-air-sensitivity', date: '2026-09-28T17:00:00+09:00' },
  { slug: 'chronic-fatigue-adrenal-exhaustion-boyak', date: '2026-09-28T21:00:00+09:00' }
];

console.log(`📅 총 ${schedulePlan.length}개 칼럼의 일정을 확정 적용합니다...\n`);

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

console.log('\n🎉 9월 28일까지 매일 4회(09, 13, 17, 21시) 정기 자동발행 캘린더 세팅 완료!');
