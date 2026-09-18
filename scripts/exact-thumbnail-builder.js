const fs = require('fs');
const path = require('path');

function escapeXML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/\([\u4e00-\u9fa5\s·]+\)/g, '')
    .trim();
}

// 37개 전 칼럼 1:1 완벽 맞춤형 썸네일 데이터베이스 (중복/오기 0%)
const columnThumbnailDB = {
  'acute-stiff-neck-nakchim': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '자고 일어났을 때 목 안 돌아가는 "급성 관절 잠김"',
    title: '부평 급성 낙침 · 목 결림 한방 치료',
    subTitle: '굳어버린 경추 후관절을 풀고 가동성을 되찾는 동작침 & 추나',
    step1: { title: '경추 후관절낭 감돈 & 근육 연축 정밀 진단', desc: '목 디스크 급성 방사통과의 정밀 감별 및 관절 잠김 체크' },
    step2: { title: '즉각 가동성 회복 동작침법 (MSAT)', desc: '침을 맞고 고개를 돌려 5분 만에 굳은 관절 잠김 해제' },
    step3: { title: '경추 관절 가동 추나 & 소염약침', desc: 'C커브 정상화 및 후관절 활액막염 즉각 진정' }
  },
  'allergic-rhinitis-seasonal-bopyego': {
    category: '만성기침·호흡기 & 보폐고 클리닉',
    subHook: '환절기마다 터지는 콧물·재채기·눈 가려움증',
    title: '알레르기 비염 · 만성 콧물 · 보폐고 치료',
    subTitle: '면역 과민반응을 진정시키고 비강 점막 방어벽을 재건하는 한방 치료',
    step1: { title: '폐한(肺寒) & 비폐기허 점막 면역 진단', desc: '온도·습도 민감도 및 비강 점막 창백·울혈도 평가' },
    step2: { title: '전통 옹기 고농축 수제 보폐고(補肺膏)', desc: '호흡기 점막에 수분을 공급하고 항알레르기 면역 강화' },
    step3: { title: '비강 배농 청열 요법 & 면역 비염 한약', desc: '환절기에도 재발 없는 튼튼한 코 호흡 환경 완성' }
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
  'carpal-tunnel-wrist-pain': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '마우스 쓰거나 아기 안을 때 손끝 저림과 손목 통증',
    title: '손목터널증후군 · 수근관증후군 한방 치료',
    subTitle: '수술 없이 신경 압박을 낮추고 손목 관절을 바로잡는 감압 침구',
    step1: { title: '정중신경 압박 & 횡수근인대 비후 진단', desc: '팔렌(Phalen) 30초 신경 손상도 체크' },
    step2: { title: '수근관 미세 감압 심부 전침 & 소염약침', desc: '수술 없이 신경 압박을 낮추고 붓기 배출' },
    step3: { title: '수근골 교정 추나 & 완관절 테이핑', desc: '손목 8개 뼈의 균형 정렬 및 신경 재생' }
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
  'chronic-ankle-instability-chuna': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '길 걷다 툭하면 삐끗하는 덜렁거리는 발목',
    title: '만성 발목 불안정증 · 습관성 발목 삠 치료',
    subTitle: '늘어난 인대를 조여주고 고유수용성 감각을 복원하는 한방 교정',
    step1: { title: '만성 거골 아탈구 & 전비골건 약화 진단', desc: '발목 관절 유격 및 고유수용기 감각 저하 측정' },
    step2: { title: '인대강화 봉약침 & 심부 전침 자극', desc: '늘어난 인대 콜라겐 섬유 수축 및 결합력 강화' },
    step3: { title: '족관절 모빌리제이션 추나 & 밸런스 훈련', desc: '울퉁불퉁한 길에서도 흔들림 없는 발목 지지대 구축' }
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
  'cubital-tunnel-ulnar-nerve-chuna': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '4·5번째 손가락이 저리고 팔꿈치 안쪽이 찌릿할 때',
    title: '주관증후군 · 팔꿈치터널 척골신경 포착 한방 치료',
    subTitle: '팔꿈치 척골신경 주행 통로를 넓히고 손가락 마비를 예방하는 비수술 감압',
    step1: { title: '척골신경 주행로 압박 & 프로망(Froment) 징후 진단', desc: '손가락 근력 약화 및 저림 부위 정밀 감별' },
    step2: { title: '주관절 내측 감압 심부 전침 & 소염약침', desc: '신경 통로 부종 완화 및 신경막 염증 제거' },
    step3: { title: '상지 신경 가동 추나 & 인대 이완 요법', desc: '팔꿈치 굴곡 시 신경 마찰을 줄여 재발 방지' }
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
  'de-quervain-wrist-tenosynovitis': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '엄지손가락 젖힐 때 칼로 베는 듯한 손목 바깥쪽 통증',
    title: '드퀘르벵 · 손목건초염 한방 약침 치료',
    subTitle: '단무지신근·장무지외전근 힘줄 마찰을 줄이고 염증을 가라앉히는 비수술 케어',
    step1: { title: '핑켈스타인(Finkelstein) 건초 마찰 & 활액막염 진단', desc: '엄지손가락 힘줄 염증도 및 국소 열감 평가' },
    step2: { title: '정밀 소염약침 & 완관절 심부 전침', desc: '스테로이드 부작용 없이 힘줄 건막 염증 신속 진정' },
    step3: { title: '수근골 감압 교정 & 맞춤 보호 테이핑', desc: '엄지-손목 운동역학 교정으로 만성화 차단' }
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
  'frozen-shoulder-rotator-cuff': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '팔이 뒤로 안 올라가고 밤마다 쑤시는 어깨 통증',
    title: '부평 오십견 · 회전근개파열 한방 치료',
    subTitle: '굳어버린 견관절막 유착을 열고 가동 범위를 복원하는 한방 치료',
    step1: { title: '관절낭 유착 & 극상근건 파열 정밀 감별', desc: '어깨 전방위 관절 가동 범위(ROM) 측정' },
    step2: { title: '견관절 유착 박리 심부 전침 & 관절강 약침', desc: '단단하게 굳은 관절막을 열고 염증 제거' },
    step3: { title: '어깨 관절 가동 추나 & 근골 한약', desc: '가동 범위 정상 회복 및 야간 통증 차단' }
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
  'gongjindan-selection-guide': {
    category: '맞춤보약 & 공진단 클리닉',
    subHook: '자도 자도 풀리지 않는 만성 피로와 번아웃',
    title: '정품 사향공진단 · 활력·해울·총명 공진단',
    subTitle: '식약처 CITES 정품 사향 100% 보증, 체질별 맞춤 황실 명방',
    step1: { title: '식약처 CITES 정품 인증 사향 100% 확인', desc: 'L-무스콘 유효 성분 함량 및 진품 보증' },
    step2: { title: '수승화강(水升火降) 체질별 맞춤 조제', desc: '활력공진단, 스트레스 해울공진단, 총명 N공진단' },
    step3: { title: '뇌신경 활성화 & 면역력·기력 즉각 충전', desc: '원기 회복과 두뇌 피로를 깨우는 황실 명방' }
  },
  'intercostal-neuralgia-chest-pain': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '숨 들이쉴 때마다 콕콕 쑤시고 결리는 가슴·옆구리 통증',
    title: '늑간신경통 · 가슴 옆구리 통증 한방 치료',
    subTitle: '갈비뼈 사이 신경 압박을 풀고 흉곽 팽창을 원활하게 돕는 신경 감압',
    step1: { title: '늑간신경 주행로 염증 & 흉추 후관절 변위 진단', desc: '심장·폐 질환과의 정밀 감별 및 압통점 체크' },
    step2: { title: '늑간근 이완 정밀 소염약침 & 심부 침구', desc: '갈비뼈 사이 굳은 근막을 풀고 신경 자극 진정' },
    step3: { title: '흉추 감압 교정 추나 & 기혈 순환 한약', desc: '깊은 호흡 시에도 결림 없는 편안한 흉곽 복원' }
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
  'kyungokhwa-fatigue-recovery': {
    category: '맞춤보약 & 공진단 클리닉',
    subHook: '기력 저하, 면역력 결핍, 수술 후 회복기 보약',
    title: '전통 원방경옥고 · 72시간 옹기 중탕',
    subTitle: '동의보감 전통 제법 3일 주야 숙성으로 온 가족 면역력 증진',
    step1: { title: '6년근 생지황·인삼·복령·꿀의 황금 배합', desc: '동의보감 전통 제법 3일 주야 옹기 숙성' },
    step2: { title: '폐음(肺陰) 보충 & 조혈 기능 촉진', desc: '만성 소모성 질환 및 마른기침, 피로 회복' },
    step3: { title: '온 가족 면역력 증진 & 항산화 효능', desc: '남녀노소 부담 없이 복용하는 순수 보약' }
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
  'lumbar-disc-sciatica-chuna': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '의자에 앉기 힘들고 다리까지 찌릿한 방사통',
    title: '부평 허리디스크 · 좌골신경통 한방 추나',
    subTitle: '척추 내부 음압을 유도하여 튀어나온 수핵을 흡수시키는 비수술 치료',
    step1: { title: '수핵 탈출 & L4-L5 신경근 염증 정밀 진단', desc: '하지직거상(SLR) 척수 신경 압박도 체크' },
    step2: { title: 'COX 굴곡신연 척추 감압 추나요법', desc: '디스크 내부 음압 유도로 튀어나온 수핵 흡수' },
    step3: { title: '척수신경 소염약침 & 신경 재생 한약', desc: '신경막 무균 염증 제거 및 척추 기립근 강화' }
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
  'pelvic-asymmetry-correction-chuna': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '골반이 틀어지고 치마가 한쪽으로 돌아갈 때 "체형 불균형"',
    title: '부평 골반 비대칭 · 틀어진 골반 교정 추나',
    subTitle: '장골·천골 변위를 바로잡고 만성 요통과 다리 길이 차이를 해결하는 비수술 치료',
    step1: { title: '골반 비틀림 & 다리 길이 차이 정밀 진단', desc: '장골 전후방 회전변위 및 천장관절 기능 장애 측정' },
    step2: { title: '골반 분절 교정 추나 & 이상근 이완 심부 전침', desc: '골반 수평축 복원 및 좌골신경 압박 완화' },
    step3: { title: '체형 안정화 한방 침구 & 근막 강화', desc: '척추-골반 지지대 회복으로 요통 재발 차단' }
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
  'postpartum-body-pain-sanhuboyak': {
    category: '맞춤보약 & 여성 클리닉',
    subHook: '출산 후 온몸 뼈마디가 시리고 쑤시는 산후풍 증상',
    title: '산후풍 예방 · 산후 관절통 · 1:1 산후보약',
    subTitle: '이완된 관절과 인대를 조이고 기혈을 돋우는 수유 안심 맞춤 한약',
    step1: { title: '릴랙신 호르몬 관절 이완 & 기혈 허손 정밀 진단', desc: '손목·골반·무릎 시림 및 체온 조절 이상 체크' },
    step2: { title: '오로 배출 1단계 & 기혈 보강 2단계 처방', desc: '자궁 수축 촉진 및 뼈마디 시림 원천 차단' },
    step3: { title: '수유 중에도 100% 안전한 규격 한약재 조제', desc: '산모 체력 회복과 신생아 건강을 동시에 지키는 명방' }
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
  'sinusitis-chronic-congestion': {
    category: '만성기침·호흡기 & 보폐고 클리닉',
    subHook: '누런 콧물, 안면 통증, 머리가 멍한 지독한 코막힘',
    title: '만성 축농증 · 부비동염 한방 치료',
    subTitle: '부비동 내 화농성 분비물을 시원하게 배출하는 한방 쾌비 배농 치료',
    step1: { title: '부비동 자연공 폐쇄 & 환기 장애 정밀 진단', desc: '항생제 내성으로 반복되는 만성 염증 분석' },
    step2: { title: '한방 쾌비 배농 치료 & 비강 정화 요법', desc: '부비동 내 화농성 분비물 시원하게 배출' },
    step3: { title: '청열해독 비강 한약 & 면역 방어벽 강화', desc: '재발 없는 건강한 호흡 통로 완성' }
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
  'tennis-elbow-lateral-epicondylitis': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '물건 들거나 비틀 때 찌릿한 팔꿈치 통증의 악순환',
    title: '부평 테니스엘보 · 외측상과염 한방 치료',
    subTitle: '손상된 힘줄 건증을 회복하고 팔꿈치 관절을 바로잡는 비수술 치료',
    step1: { title: 'ECRB 힘줄 건증(Tendinosis) 정밀 진단', desc: '미세 파열과 저혈관 부위의 산소 결핍 분석' },
    step2: { title: '소염약침 & 심부 근막 이완 & 정밀 소염약침', desc: '스테로이드 없이 염증 배출 및 혈류 공급' },
    step3: { title: '주관절 감압 추나 & 인대 강화 한약', desc: '콜라겐 합성 촉진 및 팔꿈치 운동사슬 정상화' }
  },
  'tinnitus-dizziness-autonomic-care': {
    category: '맞춤보약 & 신경 클리닉',
    subHook: '귀에서 삐- 소리와 머리가 핑 도는 만성 어지럼증',
    title: '이명 · 어지럼증 · 자율신경 뇌 혈류 한방 치료',
    subTitle: '경추 정렬을 바로잡고 내이 혈류를 개선하는 두개천골 추나 & 청신 한약',
    step1: { title: '상부경추 아탈구 & 내이 달팽이관 허혈 진단', desc: '이비인후과 검사상 이상 없는 척추·신경 기인성 감별' },
    step2: { title: '경추-두개골 교정 추나 & 측두근 이완 약침', desc: '추골동맥 혈류를 열어 귀 신경계 산소 공급 촉진' },
    step3: { title: '청신안신(淸神安神) 맞춤 한약 처방', desc: '과흥분된 청신경 진정 및 만성 뇌 피로 회복' }
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
  'traffic-accident-autonomic-trauma': {
    category: '교통사고 후유증 & 자동차보험 케어',
    subHook: '사고 후 가슴 두근거림, 불안, 불면, 깜짝 놀람',
    title: '교통사고 외상후 스트레스 · 심담허겁 한방 치료',
    subTitle: '과열된 교감신경을 진정시키고 놀란 심장을 달래는 안신 한약',
    step1: { title: '급성 충격 후 자율신경 불균형 & 심담허겁 진단', desc: '두근거림, 소화장애, 수면장애 종합 평가' },
    step2: { title: '온담탕·가미소요산 계열 맞춤 안신 한약', desc: '놀란 신경계를 가라앉히고 미세 어혈 동시 제거' },
    step3: { title: '자율신경 조절 침구 & 전신 이완 케어', desc: '자동차보험 100% 적용 (본인부담금 0원)' }
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
  'traffic-accident-rib-back-sprain': {
    category: '교통사고 후유증 & 자동차보험 케어',
    subHook: '숨 쉴 때마다 결리고 콕콕 쑤시는 등과 옆구리',
    title: '교통사고 늑골 염좌 · 등 결림 한방 치료',
    subTitle: '안전벨트 압박으로 인한 늑간 신경통 완화 및 흉추 교정 추나',
    step1: { title: '안전벨트 압박 늑골 염좌 & 흉추 변위 진단', desc: '미세 골절 감별 및 늑간신경통 체크' },
    step2: { title: '통증 완화 침구 & 흉곽 이완 약침', desc: '호흡 시 결리는 등 근육 긴장 즉각 해소' },
    step3: { title: '흉추 교정 추나 & 어혈 한약 통원 케어', desc: '사고 후유증 없는 완전한 척추 안정화' }
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
  'turtle-neck-chuna': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '모니터 앞 거북목과 뻐근한 뒷목, 만성 두통',
    title: '부평 거북목 · 일자목 증후군 교정 추나',
    subTitle: '굳어진 경추 C커브를 복원하고 뇌 혈류를 개선하는 체형 교정',
    step1: { title: '경추 C커브 소실 & 흉추 후만 정밀 체형 분석', desc: '상부 승모근·견갑거근 단축 긴장도 측정' },
    step2: { title: '경추 이완 추나 & 후두하근 소염약침 및 심부 전침 요법', desc: '굳은 목 관절을 열고 뇌 혈류 공급 정상화' },
    step3: { title: '1:1 맞춤 근막 강화 침구 치료', desc: '목디스크 진행 차단 및 바른 척추 정렬 복원' }
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
  'myofascial-rhomboid-scapular-pain': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '모니터만 보면 날개뼈 안쪽이 칼로 찌르듯 결리는 등 통증',
    title: '부평 날개뼈 통증 · 능형근 담결림 한방 치료',
    subTitle: '굽은 등을 펴고 굳어진 능형근 근막통증유발점을 푸는 흉추 추나 & 약침',
    step1: { title: '능형근·견갑거근 발통점(Trigger Point) & 흉추 후만 정밀 진단', desc: '목디스크 방사통과의 정밀 감별 및 견갑골 가동성 체크' },
    step2: { title: '심부 근막 이완 전침 & 정밀 소염약침', desc: '굳어버린 통증유발점을 직접 이완하고 젖산 노폐물 배출' },
    step3: { title: '흉추 신연 감압 추나 & 능형근 스트레칭', desc: '굽은 등을 펴고 견갑골을 제자리로 정렬하여 재발 방지' }
  },
  'globus-hystericus-throat-lump-bopyego': {
    category: '만성기침·호흡기 & 보폐고 클리닉',
    subHook: '삼켜도 안 넘어가고 뱉어도 안 나오는 목 안의 걸림감',
    title: '만성 목 이물감 · 매핵기 · 보폐고 한방 치료',
    subTitle: '스트레스로 굳은 인후부 기체(氣滯)를 풀고 점막을 적시는 반하후박탕 & 보폐고',
    step1: { title: '인후두 역류 & 기체(氣滯) 울결 매핵기 정밀 감별 진단', desc: '상부 식도 괄약근 긴장도 및 점막 건조도 종합 평가' },
    step2: { title: '전통 옹기 고농축 수제 보폐고 & 반하후박탕 가감방', desc: '인후 점막에 윤활액을 공급하고 뭉친 담음(痰飮) 삭힘' },
    step3: { title: '인후 혈자리 정밀 약침 & 자율신경 안정 침구', desc: '과열된 교감신경을 진정시키고 목구멍 압박감 즉각 해소' }
  }
};

function getThumbnailConfig(slug, fallbackTitle = '', fallbackCategory = '') {
  if (slug && columnThumbnailDB[slug]) {
    return columnThumbnailDB[slug];
  }
  return {
    category: fallbackCategory || '척추·관절 & 추나 클리닉',
    subHook: '만성화되기 전 원인부터 바로잡는 1:1 맞춤 진료',
    title: fallbackTitle || '해아림한의원 부평점 통합진료',
    subTitle: '정밀 진단과 비수술 한방 통합 솔루션',
    step1: { title: '근본 원인 및 체질 정밀 진단', desc: '이학적 검진 및 증상별 원인 분석' },
    step2: { title: '맞춤 한방 침구 & 정밀 약침 치료', desc: '통증 완화 및 염증 배출 집중 케어' },
    step3: { title: '체형 교정 추나 & 자생력 강화 한약', desc: '재발 방지 및 전신 균형 회복' }
  };
}

function generateCleanCardSVG(params) {
  let cfg;
  if (params.slug && columnThumbnailDB[params.slug]) {
    cfg = columnThumbnailDB[params.slug];
  } else if (params.step1 && params.step2 && params.step3) {
    cfg = params;
  } else {
    cfg = getThumbnailConfig(params.slug, params.title, params.category);
  }

  const cleanTitle = escapeXML(cfg.title || params.title);
  const cleanCategory = escapeXML(cfg.category || params.category);
  const cleanSubHook = escapeXML(cfg.subHook || params.subHook);
  const cleanSubTitle = escapeXML(cfg.subTitle || params.subTitle);
  const step1 = cfg.step1 || params.step1;
  const step2 = cfg.step2 || params.step2;
  const step3 = cfg.step3 || params.step3;

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
    <rect x="0" y="0" width="620" height="38" rx="8" fill="#ecfdf5" />
    <text x="16" y="25" font-size="15.5" font-weight="900" fill="#047857" font-family="Pretendard, 'Malgun Gothic', sans-serif" letter-spacing="-0.02em">
      ${cleanSubHook}
    </text>
  </g>

  <!-- 2. Main Title (High-Impact Crisp Pitch Black) -->
  <g transform="translate(90, 235)">
    <text font-size="34" font-weight="900" fill="#0f172a" font-family="Pretendard, 'Malgun Gothic', sans-serif" letter-spacing="-0.03em">
      ${cleanTitle}
    </text>
  </g>

  <!-- 3. Subtitle Description -->
  <g transform="translate(90, 275)">
    <text font-size="18.5" font-weight="800" fill="#334155" font-family="Pretendard, 'Malgun Gothic', sans-serif" letter-spacing="-0.02em">
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
    <text x="110" y="46" font-size="19.5" font-weight="900" fill="#0f172a" font-family="Pretendard, 'Malgun Gothic', sans-serif" letter-spacing="-0.02em">
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
    <text x="110" y="46" font-size="19.5" font-weight="900" fill="#0f172a" font-family="Pretendard, 'Malgun Gothic', sans-serif" letter-spacing="-0.02em">
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
    <text x="110" y="46" font-size="19.5" font-weight="900" fill="#0f172a" font-family="Pretendard, 'Malgun Gothic', sans-serif" letter-spacing="-0.02em">
      ${escapeXML(step3.title)}
    </text>
    <text x="110" y="76" font-size="14.5" font-weight="600" fill="#475569" font-family="Pretendard, 'Malgun Gothic', sans-serif" letter-spacing="-0.01em">
      ${escapeXML(step3.desc)}
    </text>
  </g>

  <!-- 8. Bottom Dark Navy Footer Capsule -->
  <g transform="translate(90, 735)">
    <rect x="0" y="0" width="720" height="54" rx="14" fill="#0f172a" />
    <text x="360" y="33" font-size="15" font-weight="800" fill="#ffffff" text-anchor="middle" font-family="Pretendard, 'Malgun Gothic', sans-serif" letter-spacing="-0.02em">
      해아림한의원 부평점 · 1:1 맞춤 통합진료 클리닉 (부평역 7번 출구 도보 5분)
    </text>
  </g>
</svg>`;

  return svg;
}

module.exports = {
  generateCleanCardSVG,
  columnThumbnailDB,
  getThumbnailConfig
};
