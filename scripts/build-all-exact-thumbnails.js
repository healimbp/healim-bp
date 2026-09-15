const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const { generateCleanCardSVG } = require('./exact-thumbnail-builder');

const thumbsDir = path.join(__dirname, '..', 'static', 'thumbnails');
if (!fs.existsSync(thumbsDir)) {
  fs.mkdirSync(thumbsDir, { recursive: true });
}

// 28 Column Exact Clean Thumbnails Config (1:1 clone of healimbp reference standard)
const thumbnailConfigs = {
  'acute-stiff-neck-nakchim': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '자고 일어났을 때 목 안 돌아가는 "급성 관절 잠김"',
    title: '부평 급성 낙침 · 목 결림 한방 치료',
    subTitle: '굳어버린 경추 후관절을 풀고 가동성을 되찾는 동작침 & 추나',
    step1: { title: '경추 후관절낭 감돈 & 근육 연축 정밀 진단', desc: '목 디스크 급성 방사통과의 정밀 감별 및 관절 잠김 체크' },
    step2: { title: '즉각 가동성 회복 동작침법 (MSAT)', desc: '침을 맞고 고개를 돌려 5분 만에 굳은 관절 잠김 해제' },
    step3: { title: '경추 관절 가동 추나 & 소염약침', desc: 'C커브 정상화 및 후관절 활액막염 즉각 진정' }
  },
  'tennis-elbow-lateral-epicondylitis': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '물건 들거나 비틀 때 찌릿한 팔꿈치 통증의 악순환',
    title: '부평 테니스엘보 · 외측상과염 한방 치료',
    subTitle: '손상된 힘줄 건증을 회복하고 팔꿈치 관절을 바로잡는 비수술 치료',
    step1: { title: 'ECRB 힘줄 건증(Tendinosis) 정밀 진단', desc: '미세 파열과 저혈관 부위의 산소 결핍 분석' },
    step2: { title: '소염약침 & 미세 침도 유착 박리', desc: '스테로이드 없이 염증 배출 및 혈류 공급' },
    step3: { title: '주관절 감압 추나 & 인대 강화 한약', desc: '콜라겐 합성 촉진 및 팔꿈치 운동사슬 정상화' }
  },
  'golf-elbow-medial-epicondylitis': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '손잡이 쥐거나 당길 때 팔꿈치 안쪽 뻐근함',
    title: '부평 골프엘보 · 내측상과염 한방 치료',
    subTitle: '굳어진 팔뚝 굴곡근을 풀고 인대를 재건하는 1:1 맞춤 케어',
    step1: { title: '굴곡근 건초염 & 척골신경 포착 진단', desc: '팔꿈치 안쪽 인대 긴장과 관절 마찰 검사' },
    step2: { title: '심부 근막 이완 & 중성어혈약침', desc: '굳어진 팔뚝 굴곡근 섬유화 박리 및 소염' },
    step3: { title: '상지 추나요법 & 인대 재건 한약', desc: '손목-팔꿈치 정렬 교정으로 재발 방지' }
  },
  'carpal-tunnel-wrist-pain': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '마우스 쓰거나 아기 안을 때 손끝 저림과 손목 통증',
    title: '손목터널증후군 · 건초염 한방 치료',
    subTitle: '수술 없이 신경 압박을 낮추고 손목 관절을 바로잡는 감압 침구',
    step1: { title: '정중신경 압박 & 횡수근인대 비후 진단', desc: '팔렌·핑겔스타인 30초 신경 손상도 체크' },
    step2: { title: '수근관 미세 감압 침도 & 소염약침', desc: '수술 없이 신경 압박을 낮추고 붓기 배출' },
    step3: { title: '수근골 교정 추나 & 완관절 테이핑', desc: '손목 8개 뼈의 균형 정렬 및 신경 재생' }
  },
  'ankle-sprain-ligament-chuna': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '삐끗한 후 멍들고 덜렁거리는 만성 발목 불안정증',
    title: '부평 발목 염좌 · 인대 파열 한방 치료',
    subTitle: '어혈 부종을 가라앉히고 거골 정렬을 맞추는 족부 추나요법',
    step1: { title: '전거비인대(ATFL) 손상 & 거골 변위 진단', desc: '1~3도 인대 파열 및 골절 감별 검사' },
    step2: { title: '어혈 배출 습부항 & 인대 강화 봉약침', desc: '조직 부종을 가라앉히고 콜라겐 증식 촉진' },
    step3: { title: '거골 정복 족부 추나 & 밸런스 회복', desc: '발목 힌지 관절 정상화로 잦은 삠 예방' }
  },
  'lumbar-disc-sciatica-chuna': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '의자에 앉기 힘들고 다리까지 찌릿한 방사통',
    title: '부평 허리디스크 · 좌골신경통 한방 추나',
    subTitle: '척추 내부 음압을 유도하여 튀어나온 수핵을 흡수시키는 비수술 치료',
    step1: { title: '수핵 탈출 & L4-L5 신경근 염증 정밀 진단', desc: '하지직거상(SLR) 척수 신경 압박도 체크' },
    step2: { title: 'COX 굴곡신연 척추 감압 추나요법', desc: '디스크 내부 음압 유도로 튀어나온 수핵 흡수' },
    step3: { title: '척수신경 소염약침 & 신경 재생 한약', desc: '신경막 무균 염증 제거 및 척추 기립근 강화' }
  },
  'turtle-neck-chuna': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '모니터 앞 거북목과 뻐근한 뒷목, 만성 두통',
    title: '부평 거북목 · 일자목 증후군 교정 추나',
    subTitle: '굳어진 경추 C커브를 복원하고 뇌 혈류를 개선하는 체형 교정',
    step1: { title: '경추 C커브 소실 & 흉추 후만 정밀 체형 분석', desc: '상부 승모근·견갑거근 단축 긴장도 측정' },
    step2: { title: '경추 이완 추나 & 후두하근 침도요법', desc: '굳은 목 관절을 열고 뇌 혈류 공급 정상화' },
    step3: { title: '1:1 맞춤 근막 강화 침구 치료', desc: '목디스크 진행 차단 및 바른 척추 정렬 복원' }
  },
  'cervicogenic-headache-neck-chuna': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '진통제를 먹어도 안 낫는 뒷머리 두통과 눈 피로',
    title: '경추성 두통 · 뒷목 결림 한방 치료',
    subTitle: '상부 경추 신경 압박을 해소하고 뇌척수액 순환을 돕는 추나',
    step1: { title: '상부 경추(C1-C3) 신경 압박 & 후두신경 포착', desc: '뇌 검사상 이상 없는 척추 기인 두통 감별' },
    step2: { title: '두개천골 추나 & 경추 감압 교정', desc: '목-머리 연결 신경근 압박 해제 및 뇌척수액 순환' },
    step3: { title: '후두하근 약침 & 청뇌 안신 한약', desc: '만성 뇌 피로 해소 및 편두통성 안통 완화' }
  },
  'frozen-shoulder-rotator-cuff': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '팔이 뒤로 안 올라가고 밤마다 쑤시는 어깨 통증',
    title: '부평 오십견 · 회전근개파열 한방 치료',
    subTitle: '굳어버린 견관절막 유착을 열고 가동 범위를 복원하는 한방 치료',
    step1: { title: '관절낭 유착 & 극상근건 파열 정밀 감별', desc: '어깨 전방위 관절 가동 범위(ROM) 측정' },
    step2: { title: '견관절 유착 박리 침도 & 관절강 약침', desc: '단단하게 굳은 관절막을 열고 염증 제거' },
    step3: { title: '어깨 관절 가동 추나 & 근골 한약', desc: '가동 범위 정상 회복 및 야간 통증 차단' }
  },
  'plantar-fasciitis-heel-pain': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '아침 첫발 디딜 때 뒤꿈치가 찢어질 듯한 통증',
    title: '족저근막염 · 발바닥 통증 한방 치료',
    subTitle: '뒤꿈치 염증을 신속히 배출하고 아킬레스건을 이완하는 맞춤 약침',
    step1: { title: '종골 부착부 미세 파열 & 족궁(Arch) 분석', desc: '비복근 단축 및 발바닥 충격 흡수 장애 진단' },
    step2: { title: '족저근막 소염약침 & 종아리 근막 이완', desc: '뒤꿈치 염증 신속 배출 및 아킬레스건 이완' },
    step3: { title: '발목-골반 밸런스 추나 & 재생 치료', desc: '족부 하중 분산 및 재발 없는 보행 복원' }
  },
  'knee-osteoarthritis-cartilage': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '계단 오르내릴 때 시큰거리고 붓는 무릎 관절',
    title: '퇴행성 무릎관절염 · 연골 마모 한방 치료',
    subTitle: '무릎 관절강 무균 염증을 잡고 연골을 재생하는 관절 한약',
    step1: { title: '관절강 간격 감소 & 활액막염 정밀 진단', desc: '1~4단계 연골 마모도 및 보행 패턴 분석' },
    step2: { title: '관절강 정밀 소염약침 & 봉약침', desc: '무릎에 찬 물을 말리고 무균성 염증 진정' },
    step3: { title: '슬관절 감압 추나 & 연골 재생 관절한약', desc: '관절 마찰 감소 및 뼈·인대 영양 공급' }
  },
  'spinal-stenosis-claudication': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '10분만 걸어도 다리가 터질 듯 저리고 쑤시는 파행',
    title: '척추관협착증 · 신경인성 파행 한방 치료',
    subTitle: '수술 없이 척추관 공간을 확보하고 보행 거리를 늘리는 감압 추나',
    step1: { title: '황색인대 비후 & 척추관 좁아짐 정밀 분석', desc: '허리디스크와의 보행 거리 차이 감별 진단' },
    step2: { title: '척추 감압 굴곡 추나 & 신경약침', desc: '척추관 공간을 확보하여 신경 혈류 개선' },
    step3: { title: '척추 심부 인대 강화 한약', desc: '수술 없이 보행 거리를 늘리고 다리 힘 회복' }
  },
  'tmj-jaw-clicking-pain': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '입 벌릴 때 딱딱 소리와 통증, 턱 비대칭',
    title: '턱관절 장애 · 개구장애 한방 치료',
    subTitle: '턱의 중심축을 바로잡아 디스크 마찰을 없애는 FCST 교정 추나',
    step1: { title: '턱관절 디스크 변위 & 교근·측두근 긴장 진단', desc: '턱 소리, 입 안 벌어짐, 두통 연관성 체크' },
    step2: { title: '턱관절 교정 추나 (FCST) & 상부경추 정렬', desc: '턱의 중심축을 바로잡아 디스크 마찰 제거' },
    step3: { title: '저작근 심부 약침 & 신경 안정 치료', desc: '수면 중 이갈이·이악물기 완화 및 안면 밸런스' }
  },
  'leg-edema-bujonghwan': {
    category: '만성부종 & 순환 클리닉',
    subHook: '오후만 되면 신발이 끼고 밤마다 쥐 나는 종아리',
    title: '퇴근길 종아리 부종 · 부종환 엔오',
    subTitle: '정맥 판막 혈류를 가속하고 림프 노폐물을 배출하는 한방 순환 치료',
    step1: { title: '하지 정맥 판막 부전 & 수독(水毒) 정체 진단', desc: '함요 부종 및 세포간질액 울혈 상태 체크' },
    step2: { title: '서근이수(舒筋利水) 당귀작약산 가감방', desc: '복령·택사로 붓기 배출 & 작약으로 근육 이완' },
    step3: { title: '산화질소(NO) 림프관 확장 & 비복근 약침', desc: '미세 모세혈관을 능동적으로 열어 혈류 가속' }
  },
  'morning-facial-hand-edema-bujonghwan': {
    category: '만성부종 & 순환 클리닉',
    subHook: '자고 일어나면 얼굴이 달덩이, 손가락 반지 꽉 낌',
    title: '아침 안면 · 손가락 부종 · 부종환 엔오',
    subTitle: '신장 부담 없이 탁한 림프 노폐물만 배출하는 이수소종 한방 처방',
    step1: { title: '검사상 이상 없는 특발성 부종 & 수독 분석', desc: '류마티스 조조강직과의 명확한 감별 진단' },
    step2: { title: '신장 부담 없는 한방 이수소종(利水消腫)', desc: '맑은 체액은 보존하고 탁한 림프 노폐물만 배출' },
    step3: { title: '안면 림프 배액 & 손가락 관절 이완 침구', desc: '아침마다 가볍고 또렷한 얼굴선 복원' }
  },
  'night-leg-cramp-circulatory-bujonghwan': {
    category: '만성부종 & 순환 클리닉',
    subHook: '새벽마다 비복근이 뒤틀리고 발가락 꼬이는 고통',
    title: '야간 다리 쥐(경련) · 작약감초탕 & 부종환',
    subTitle: '마그네슘으로 안 풀리는 혈류 정체를 해소하고 근육 경련을 차단',
    step1: { title: '마그네슘으로 안 풀리는 하지 정맥 울혈 진단', desc: '혈류 정체로 인한 근막 산소 결핍(허혈) 분석' },
    step2: { title: '천연 근육이완의 최고 명방 작약감초탕', desc: '파에오니플로린 성분이 과열된 근육 수축 차단' },
    step3: { title: '부종환 엔오 & 비복근 심부 어혈약침', desc: '야간 통증 없이 깊고 편안한 숙면 보장' }
  },
  'postpartum-surgery-edema-bujonghwan': {
    category: '만성부종 & 순환 클리닉',
    subHook: '출산 후 안 빠지는 붓기 & 수술 후 뭉친 멍과 부종',
    title: '산후 붓기 · 수술 후 부종 · 부종환 엔오',
    subTitle: '호박즙 대신 피멍과 어혈을 신속히 배출하는 양혈거어 맞춤 한약',
    step1: { title: '단순 이뇨제(호박즙)의 한계와 어혈성 부종 분석', desc: '기혈 허약과 파열된 모세혈관 복구 필요성 진단' },
    step2: { title: '양혈거어(養血祛瘀) 당귀작약산 복합 처방', desc: '자궁 오로 및 피멍 배출, 손상된 림프관 재생' },
    step3: { title: '산후풍 예방 & 섬유화 조직 연화 치료', desc: '수유 중에도 안전한 규격 한약재 1:1 조제' }
  },
  'chronic-cough-bopyego': {
    category: '만성기침·호흡기 & 보폐고 클리닉',
    subHook: '3주 이상 멎지 않는 잔기침, 마른기침, 목 이물감',
    title: '만성 기침 · 잔기침 · 보폐고 한방 치료',
    subTitle: '항생제로 안 낫는 메마른 기관지 점막을 촉촉하게 적시는 수제 보폐고',
    step1: { title: '기관지 점막 건조(Dry Mucosa) & 과민도 진단', desc: '항생제·진해거담제로 안 낫는 기침 원인 분석' },
    step2: { title: '전통 옹기 고농축 수제 보폐고(補肺膏)', desc: '기관지 섬모 점액을 채워 점막 소염 및 보습' },
    step3: { title: '폐수혈 정밀 약침 & 면역 체질 강화', desc: '기관지 자생력을 높여 환절기 감기·기침 차단' }
  },
  'chronic-rhinitis-postnasal-drip': {
    category: '만성기침·호흡기 & 보폐고 클리닉',
    subHook: '아침마다 목 뒤로 넘어가는 끈적한 가래와 코막힘',
    title: '만성 비염 · 후비루증후군 한방 치료',
    subTitle: '부비동 속 고인 농을 배출하고 코 점막 방어벽을 복구하는 비강 치료',
    step1: { title: '비강 점막 위축 & 후비루(PNDS) 신경 자극 분석', desc: '헛기침, 입냄새, 목 답답함의 근본 원인 체크' },
    step2: { title: '비강 한방 배농 요법 & 점막 재생 외용제', desc: '부비동 속 고인 농을 배출하고 염증 가라앉힘' },
    step3: { title: '보폐고 & 폐음 보강 맞춤 비염한약', desc: '온도·습도 변화에 민감한 코 점막 방어벽 복구' }
  },
  'vocal-cord-nodules-hoarse-voice': {
    category: '만성기침·호흡기 & 보폐고 클리닉',
    subHook: '목소리가 쉬고 갈라지는 강사·교사의 직업병',
    title: '성대결절 · 쉰 목소리 · 보폐고 치료',
    subTitle: '수술 없이 굳은 성대 결절을 부드럽게 연화하고 본래 목소리 복원',
    step1: { title: '성대 점막 마찰 충돌 & 미세 굳은살(결절) 진단', desc: '성대 폴립 및 만성 인후염 진행도 체크' },
    step2: { title: '성대 점막 윤활액 공급 보폐고(補肺膏)', desc: '수술 없이 굳은 결절 조직을 부드럽게 연화' },
    step3: { title: '인후 소염약침 & 발성 피로 회복 한약', desc: '맑고 편안한 본래의 목소리 톤 회복' }
  },
  'sinusitis-chronic-congestion': {
    category: '만성기침·호흡기 & 보폐고 클리닉',
    subHook: '누런 콧물, 안면 통증, 머리가 멍한 지독한 코막힘',
    title: '만성 축농증 · 부비동염 한방 치료',
    subTitle: '부비동 내 화농성 분비물을 시원하게 배출하는 한방 쾌비 배농 치료',
    step1: { title: '부비동 자연공 폐쇄 & 환기 장애 정밀 진단', desc: '항생제 내성으로 반복되는 만성 염증 분석' },
    step2: { title: '한방 쾌비 배농 치료 & 비강 정화 요법', desc: '부비동 내 화농성 분비물 시원하게 배출' },
    step3: { title: '청열해독 비강 한약 & 면역 방어벽 강화', desc: '재발 없는 건강한 호흡 통로 완성' }
  },
  'gongjindan-selection-guide': {
    category: '맞춤보약 & 공진단 클리닉',
    subHook: '자도 자도 풀리지 않는 만성 피로와 번아웃',
    title: '정품 사향공진단 · 활력·해울·총명 공진단',
    subTitle: '식약처 CITES 정품 사향 100% 보증, 체질별 맞춤 황실 명방',
    step1: { title: '식약처 CITES 정품 인증 사향 100% 확인', desc: 'L-무스콘 유효 성분 함량 및 진품 보증' },
    step2: { title: '수승화강(水升火降) 체질별 맞춤 조제', desc: '활력공진단, 스트레스 해울공진단, 총명 N공진단' },
    step3: { title: '뇌신경 활성화 & 면역력·기력 즉각 충전', desc: '원기 회복과 두뇌 피로를 깨우는 황실 명방' }
  },
  'kyungokhwa-fatigue-recovery': {
    category: '맞춤보약 & 공진단 클리닉',
    subHook: '기력 저하, 면역력 결핍, 수술 후 회복기 보약',
    title: '전통 원방경옥고 · 72시간 옹기 중탕',
    subTitle: '동의보감 전통 제법 3일 주야 숙성으로 온 가족 면역력 증진',
    step1: { title: '6년근 생지황·인삼·복령·꿀의 황금 배합', desc: '동의보감 전통 제법 3일 주야 옹기 숙성' },
    step2: { title: '폐음(肺陰) 보충 & 조혈 기능 촉진', desc: '만성 소모성 질환 및 마른기침, 피로 회복' },
    step3: { title: '온 가족 면역력 증진 & 항산화 효능', desc: '남녀노소 부담 없이 복용하는 순수 보약' }
  },
  'exam-student-chongmyeongtang': {
    category: '맞춤보약 & 공진단 클리닉',
    subHook: '머리가 멍하고 집중력이 떨어지는 수험생 뇌 피로',
    title: '수험생 총명탕 · 장원환 한방 처방',
    subTitle: '전두엽 뇌 혈류를 활성화하고 시험 불안을 낮추는 맞춤 총명탕',
    step1: { title: '브레인포그 & 전두엽 집중력 저하 정밀 진단', desc: '시험 불안과 수면 부족으로 인한 뇌 과열 체크' },
    step2: { title: '원지·석창포·복신 뇌 혈류 활성화 처방', desc: '신경전달물질 분비 촉진 및 기억력 강화' },
    step3: { title: '체력 증진 & 자율신경 안정 맞춤 한약', desc: 'D-Day까지 지치지 않는 최상의 멘탈 컨디션' }
  },
  'damjeok-reflux-dyspepsia': {
    category: '맞춤보약 & 소화기 클리닉',
    subHook: '내시경은 정상인데 속쓰림, 명치 답답, 잦은 트림',
    title: '담적병 · 역류성식도염 한방 치료',
    subTitle: '위장 외벽 근육층의 굳어진 담적을 삭히고 위장 운동성 정상화',
    step1: { title: '위장 외벽 근육층의 담적(痰積) 굳어짐 진단', desc: '복부 타진·압진으로 위장 운동성 저하 확인' },
    step2: { title: '담적 삭힘(소담건비) & 위장관 혈류 개선', desc: '굳은 위벽을 부드럽게 풀고 가스·소화불량 해소' },
    step3: { title: '자율신경 조절 & 복부 온열 침구 치료', desc: '역류성 식도염 재발 차단 및 장부 균형 회복' }
  },
  'traffic-accident-whiplash': {
    category: '교통사고 후유증 & 자동차보험 케어',
    subHook: '접촉사고 후 엑스레이에 안 나오는 목·어깨 통증',
    title: '교통사고 편타성 손상 · 어혈 한약 치료',
    subTitle: '미세 혈전을 제거하는 당귀수산 한약과 척추 전신 교정 추나',
    step1: { title: '가속-감속 충격 편타성 손상(Whiplash) 진단', desc: '미세 인대 파열과 신경 자극 정밀 체크' },
    step2: { title: '어혈 배출 당귀수산 한약 & 소염약침', desc: '사고 충격으로 뭉친 미세 혈전 신속 제거' },
    step3: { title: '척추 전신 교정 추나 & 물리 치료', desc: '본인부담금 0원 (자동차보험 100% 적용)' }
  },
  'traffic-accident-rib-back-sprain': {
    category: '교통사고 후유증 & 자동차보험 케어',
    subHook: '숨 쉴 때마다 결리고 콕콕 쑤시는 등과 옆구리',
    title: '교통사고 늑골 염좌 · 등 결림 한방 치료',
    subTitle: '안전벨트 압박으로 인한 늑간 신경통 완화 및 흉추 교정 추나',
    step1: { title: '안전벨트 압박 늑골 염좌 & 흉추 변위 진단', desc: '미세 골절 감별 및 늑간신경통 체크' },
    step2: { title: '통증 완화 침구 & 흉곽 이완 약침', desc: '호흡 시 결리는 등 근육 긴장 즉각 해소' },
    step3: { title: '흉추 교정 추나 & 어혈 한약 통원 케어', desc: '사고 후유증 없는 완전한 척추 안정화' }
  },
  'traffic-accident-concussion-headache': {
    category: '교통사고 후유증 & 자동차보험 케어',
    subHook: '사고 후 머리가 멍하고 어지러움, 메스꺼움, 불면',
    title: '교통사고 뇌진탕 증후군 · 신경 안정 한방 치료',
    subTitle: '과열된 뇌 신경계를 진정시키고 뇌 혈류를 회복하는 청뇌안신 한약',
    step1: { title: '뇌 미세 충격 & 자율신경 불균형 정밀 평가', desc: '두통, 이명, 어지럼증, 불안 장애 종합 진단' },
    step2: { title: '청뇌안신(淸腦安神) 한약 & 두개천골 추나', desc: '과열된 뇌 신경계를 진정시키고 뇌 혈류 회복' },
    step3: { title: '맞춤 통원 집중 치료 (자동차보험 0원)', desc: '만성 신경 쇠약으로의 진행 원천 차단' }
  },
  'de-quervain-wrist-tenosynovitis': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '엄지손가락 움직이거나 스마트폰 쥘 때 칼로 베는 듯한 손목 통증',
    title: '부평 드퀘르벵 손목 건초염 한방 치료',
    subTitle: '제1신전구획 활액막 염증을 가라앉히고 수근관절을 안정화하는 비수술 케어',
    step1: { title: '제1신전구획 건초염 & 핀켈스타인 정밀 진단', desc: '단무지신근·장무지외전건 마찰 및 활액막 비후 분석' },
    step2: { title: '제1구획 정밀 소염약침 & 미세 침도요법', desc: '스테로이드 부작용 없이 활액낭 염증 배출 및 유착 박리' },
    step3: { title: '수근골 관절가동 추나 & 건(腱) 강화 한약', desc: '요골-수근골 부정렬 교정 및 힘줄 콜라겐 재생' }
  }
};

console.log(`🎨 총 ${Object.keys(thumbnailConfigs).length}개 칼럼의 사용자 지정 초깔끔 카드 썸네일 생성을 시작합니다...\n`);

Object.entries(thumbnailConfigs).forEach(([slug, cfg], idx) => {
  const svg = generateCleanCardSVG({
    category: cfg.category,
    subHook: cfg.subHook,
    title: cfg.title,
    subTitle: cfg.subTitle,
    step1: cfg.step1,
    step2: cfg.step2,
    step3: cfg.step3
  });

  const svgPath = path.join(thumbsDir, `${slug}.svg`);
  fs.writeFileSync(svgPath, svg, 'utf8');

  const fontsDir = path.join(__dirname, 'fonts');
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
  console.log(`[${idx + 1}/${Object.keys(thumbnailConfigs).length}] ✅ 깔끔 카드 썸네일 완료: ${slug}.png`);
});

console.log(`\n🎉 모든 28개 칼럼의 초깔끔 카드 썸네일 생성이 완료되었습니다!`);
