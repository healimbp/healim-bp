const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'exact-thumbnail-builder.js');
let content = fs.readFileSync(targetFile, 'utf8');

const newItems = {
  'piriformis-syndrome-buttock-sciatica': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '오래 앉아 있을 때 엉치가 찌릿하고 다리로 내려가는 저림',
    title: '이상근증후군 · 좌골신경통 한방 치료',
    subTitle: '엉덩이 속 굳어버린 이상근을 풀고 신경 압박을 해소하는 골반 추나 & 약침',
    step1: { title: '이상근 단축 & 좌골신경 포착 정밀 진단', desc: '허리디스크 방사통과의 정밀 감별 및 골반 회전 변위 체크' },
    step2: { title: '심부 둔근 이완 전침 & 정밀 소염약침', desc: '두꺼워진 이상근을 직접 이완하여 짓눌린 좌골신경 해방' },
    step3: { title: '골반-천골 교정 추나 & 둔근 스트레칭', desc: '틀어진 장골·천골 균형 정렬로 엉치 압박 재발 차단' }
  },
  'menopausal-hot-flashes-insomnia-herbal-care': {
    category: '맞춤보약 & 피로회복 클리닉',
    subHook: '시도 때도 없이 얼굴로 훅 달아오르는 열감과 식은땀',
    title: '여성 갱년기 · 상열감 · 불면증 한방 치료',
    subTitle: '부족해진 진액을 채우고 허열(虛熱)을 내리는 자음강화 맞춤 보약',
    step1: { title: '음허화동(陰虛火動) & 자율신경 실조 정밀 진단', desc: '호르몬 변화에 따른 상열감·식은땀·가슴 두근거림 평가' },
    step2: { title: '체질 맞춤 자음강화탕 & 가미소요산', desc: '신수(腎水)를 보충하고 위로 치솟는 허열을 부드럽게 진정' },
    step3: { title: '청심 안신 약침 & 온열 뜸 치료', desc: '과열된 교감신경을 안정시켜 깊은 숙면과 감정 기복 해소' }
  },
  'trigger-finger-stenosing-tenosynovitis': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '손가락이 굽혀진 채 총의 방아쇠처럼 "딸깍" 걸리는 통증',
    title: '방아쇠수지 · 손가락 건초염 한방 치료',
    subTitle: '두꺼워진 A1 도르래와 힘줄 유착을 비수술로 정밀 박리하는 전침 & 약침',
    step1: { title: 'A1 활차(도르래) 비후 & 힘줄 결절 정밀 진단', desc: '손바닥 압통점 결절 및 손가락 신전 잠김 현상 체크' },
    step2: { title: '도르래 미세 감압 심부 전침 & 소염약침', desc: '절개 수술 없이 두꺼워진 건막 섬유띠를 부드럽게 이완' },
    step3: { title: '수근간 관절 정렬 교정 & 건막 온열 치료', desc: '손가락 굴곡건 활주 경로를 넓혀 부드러운 굽힘 복원' }
  },
  'traffic-accident-lumbar-disc-sciatica': {
    category: '교통사고 후유증 & 자동차보험 클리닉',
    subHook: '접촉사고 충격으로 굳어버린 허리와 찌릿한 골반 통증',
    title: '교통사고 요추 염좌 · 골반 충격 한방 치료',
    subTitle: '척추 충격을 감압하고 어혈을 풀어주는 자동차보험 1:1 맞춤 통원 케어',
    step1: { title: '편타성 요추 손상 & 골반 비틀림 정밀 진단', desc: '추돌 시 충격으로 인한 척추 기립근 및 요방형근 손상 체크' },
    step2: { title: '어혈 배출 첩약 & 척추 감압 추나요법', desc: '미세 혈종을 녹여내고 좁아진 요추 관절 간격을 안전하게 확보' },
    step3: { title: '신경근 소염약침 & 한방 물리치료', desc: '본인부담금 0원으로 통증 완화부터 후유증 예방까지 집중 치료' }
  },
  'chronic-laryngitis-hoarseness-bopyego': {
    category: '만성기침·호흡기 & 보폐고 클리닉',
    subHook: '조금만 말해도 목이 갈라지고 쉰 목소리가 지속될 때',
    title: '만성 후두염 · 쉰 목소리 · 보폐고 한방 치료',
    subTitle: '건조해진 성대 점막에 진액을 채우고 염증을 가라앉히는 수제 보폐고',
    step1: { title: '성대 점막 건조 & 후두 염증도 정밀 진단', desc: '음성 피로도 및 후두 점막 발적·부종 상태 종합 평가' },
    step2: { title: '전통 옹기 고농축 수제 보폐고(補肺膏)', desc: '성대 표면 점액층을 복원하여 마찰 손상 방지 및 소염' },
    step3: { title: '청인 약침 & 발성 호흡 교정 티칭', desc: '인후부 미세 순환을 촉진하여 맑고 청아한 목소리 회복' }
  },
  'burnout-syndrome-brain-fatigue-gongjindan': {
    category: '맞춤보약 & 피로회복 클리닉',
    subHook: '쉬어도 멍하고 집중력이 바닥난 현대인의 "뇌 과부하"',
    title: '번아웃 증후군 · 뇌 피로 · 사향공진단',
    subTitle: '중추신경 피로를 씻어내고 뇌 혈류를 깨우는 식약처 인증 정품 사향공진단',
    step1: { title: '중추 뇌 피로 & 심신 소갈(消渴) 정밀 진단', desc: '자율신경 밸런스 및 만성 스트레스 코르티솔 고갈 평가' },
    step2: { title: '정품 인증 CITES 사향 함유 원방 공진단', desc: '개규(開竅) 작용으로 뇌세포에 산소와 영양을 즉각 공급' },
    step3: { title: '청뇌 안신 약침 & 두경부 림프 순환 추나', desc: '상초의 열을 내리고 전신 기혈 순환을 복원하여 활력 충전' }
  },
  'hallux-valgus-foot-pain-chuna': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '엄지발가락이 휘어지고 튀어나와 신발 신을 때마다 욱신거릴 때',
    title: '무지외반증 · 엄지발가락 관절염 한방 치료',
    subTitle: '무너진 족궁을 세우고 중족골 정렬을 맞추는 족부 추나 & 소염약침',
    step1: { title: '무지외반 변형 각도 & 종·횡족궁 무너짐 진단', desc: '1~4단계 외반 각도 측정 및 보행 시 족저 압력 불균형 체크' },
    step2: { title: '제1 중족지관절 소염약침 & 관절 가동 추나', desc: '돌출된 건막류(Bunion)의 마찰 염증을 가라앉히고 뼈 정렬 교정' },
    step3: { title: '후경골근 강화 전침 & 맞춤 족부 테이핑', desc: '발바닥 아치를 받쳐주어 보행 시 통증 재발 차단' }
  },
  'traffic-accident-wrist-ankle-impact-sprain': {
    category: '교통사고 후유증 & 자동차보험 클리닉',
    subHook: '핸들 충격으로 꺾인 손목과 페달 충격으로 삔 발목',
    title: '교통사고 손목 · 발목 관절 염좌 한방 치료',
    subTitle: '미세 관절 아탈구를 맞추고 어혈을 풀어주는 자동차보험 1:1 집중 케어',
    step1: { title: '수근관·족관절 인대 손상 & 관절 유격 정밀 진단', desc: '충돌 시 반작용으로 인한 손목 TFCC 및 발목 인대 손상 체크' },
    step2: { title: '어혈 제거 첩약 & 인대강화 약침 치료', desc: '관절 속 미세 출혈과 부종을 배출하고 늘어난 인대 재생' },
    step3: { title: '사지 관절 교정 추나 & 치료적 테이핑', desc: '본인부담금 0원으로 손목·발목 안정성 완벽 복원' }
  },
  'dry-cough-airconditioner-heater-bopyego': {
    category: '만성기침·호흡기 & 보폐고 클리닉',
    subHook: '건조한 공기나 찬바람만 쐬면 발작적으로 터지는 마른기침',
    title: '만성 마른기침 · 기관지 점막 건조 · 보폐고 치료',
    subTitle: '가래 없이 목만 간질간질한 폐음허 기침을 다스리는 수제 보폐고',
    step1: { title: '폐음허(肺陰虛) & 기관지 과민성 정밀 진단', desc: '감기약·기침약으로 안 멎는 기관지 점막 탈수 상태 분석' },
    step2: { title: '전통 옹기 고농축 수제 보폐고(補肺膏)', desc: '기관지 섬모에 진액을 채워 미세 자극 방어벽 형성' },
    step3: { title: '청폐 윤조 약침 & 폐경락 침구 치료', desc: '호흡기 면역력을 높여 계절 변화에도 편안한 숨결 완성' }
  },
  'male-menopause-stamina-vitality-tonic': {
    category: '맞춤보약 & 피로회복 클리닉',
    subHook: '자고 일어나도 천근만근 무겁고 자신감이 떨어질 때',
    title: '남성 갱년기 · 만성 무기력 · 원기 보약',
    subTitle: '고갈된 신정(腎精)을 채우고 남성 활력을 깨우는 맞춤 보정탕 & 공진단',
    step1: { title: '신양허(腎陽虛) & 남성 호르몬 저하 정밀 진단', desc: '아침 피로도·근력 저하·의욕 감퇴·면역력 종합 평가' },
    step2: { title: '체질 맞춤 보정탕 & 녹용 사향공진단', desc: '하초의 양기를 북돋우고 혈액순환과 테스토스테론 활성화' },
    step3: { title: '원기 회복 약침 & 온양 뜸 치료', desc: '기초 대사량을 올리고 전신 활력과 자신감 완벽 복원' }
  },
  'thoracic-outlet-syndrome-arm-numbness': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '팔을 들어 올리거나 잘 때 손가락 전체가 저리고 시린 통증',
    title: '흉곽출구증후군 · 팔저림 한방 치료',
    subTitle: '쇄골 아래 짓눌린 상완신경총과 쇄골하혈관을 해방하는 경추 추나 & 약침',
    step1: { title: '상완신경총 압박 부위 & 사각근 단축 정밀 진단', desc: '에디슨(Adson)·루스(Roos) 테스트 및 목디스크 방사통 감별' },
    step2: { title: '전사각근·소흉근 심부 전침 & 소염약침', desc: '두꺼워진 근막을 정밀 이완하여 짓눌린 신경·혈관 통로 개방' },
    step3: { title: '경추-흉곽 가동 추나 & 둥근 어깨 교정', desc: '말린 어깨(라운드숄더)를 펴고 쇄골 관절 공간 영구 확보' }
  },
  'traffic-accident-tinnitus-dizziness-syndrome': {
    category: '교통사고 후유증 & 자동차보험 클리닉',
    subHook: '접촉사고 충격 후 귀에서 삐 소리 나고 핑 도는 어지러움',
    title: '교통사고 이명 · 어지럼증 · 두통 한방 치료',
    subTitle: '상부 경추 충격을 교정하고 뇌 혈류를 안정시키는 자동차보험 1:1 맞춤 케어',
    step1: { title: '경추성 자율신경 실조 & 뇌혈류 장애 정밀 진단', desc: '이비인후과 검사상 정상인 편타성 경추 기인 이명·어지럼증 감별' },
    step2: { title: '어혈 청뇌 안신 한약 & 두경부 추나요법', desc: '미세 혈종을 제거하고 뇌척수액 순환과 뇌 혈류 개선' },
    step3: { title: '후두하근 정밀 약침 & 전침 신경 안정 치료', desc: '본인부담금 0원으로 메스꺼움·불안·두통까지 복합 치유' }
  },
  'reflux-laryngitis-throat-clearing-bopyego': {
    category: '만성기침·호흡기 & 보폐고 클리닉',
    subHook: '위산 역류로 목이 화끈거리고 가래 낀 듯 답답한 헛기침',
    title: '역류성 후두염 · 목 이물감 · 담적병 한방 치료',
    subTitle: '위장 내 독소 담적(痰積)을 삭히고 손상된 성대 점막을 재생하는 보폐고',
    step1: { title: '하부식도괄약근 이완 & 인후두 점막 산 손상 진단', desc: '명치 답답함·잦은 트림·목 이물감·신물 역류 종합 평가' },
    step2: { title: '위장 담적 제거 한약 & 수제 보폐고(補肺膏)', desc: '위장 연동 운동을 정상화하고 산으로 헐어버린 인후 점막 소염' },
    step3: { title: '복부 온열 뜸 & 인후부 정밀 약침 치료', desc: '역류 경로를 차단하고 맑은 호흡과 편안한 목 상태 복원' }
  },
  'post-surgery-chemo-recovery-immune-tonic': {
    category: '맞춤보약 & 피로회복 클리닉',
    subHook: '대수술이나 항암 치료 후 바닥난 체력과 떨어진 면역력',
    title: '수술 후 기력 회복 · 면역 보약 한방 치료',
    subTitle: '오장육부의 정기를 채우고 혈액 생성을 돕는 십전대보탕 & 원방경옥고',
    step1: { title: '기혈양허(氣血兩虛) & 위장 흡수력 정밀 진단', desc: '수술 후 혈색 불량·식욕 부진·만성 탈진·상처 회복도 평가' },
    step2: { title: '소화 편한 맞춤 회복 한약 & 전통 경옥고', desc: '위장에 부담 없이 부드럽게 흡수되어 적혈구·백혈구 생성 촉진' },
    step3: { title: '면역 강화 약침 & 온열 순환 뜸 치료', desc: '체온을 올리고 자연 치유력을 극대화하여 건강한 일상 복귀' }
  },
  'pes-anserine-bursitis-knee-pain': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '계단 내려갈 때 무릎 안쪽 5cm 아래가 찌릿하게 아플 때',
    title: '거위발건염 · 무릎 활액낭염 한방 치료',
    subTitle: '무릎 안쪽 세 힘줄의 마찰 염증을 가라앉히는 소염약침 & 관절 추나',
    step1: { title: '거위발건(봉공근·박근·반건양근) 활액낭염 진단', desc: '퇴행성 무릎 관절염·내측 반월상연골 파열과의 감별 검진' },
    step2: { title: '정밀 소염약침 & 심부 전침 요법', desc: '붓고 열나는 활액낭 염증을 가라앉히고 힘줄 유착 박리' },
    step3: { title: '경골-대퇴골 관절 가동 추나 & 햄스트링 이완', desc: 'O자형 휜 다리 하중을 분산시켜 무릎 안쪽 압박 해소' }
  },
  'traffic-accident-pediatric-night-terrors': {
    category: '교통사고 후유증 & 자동차보험 클리닉',
    subHook: '접촉사고 후 자다가 소리지르며 울고 보채는 우리 아이',
    title: '소아 교통사고 후유증 · 야경증 · 안신 한약',
    subTitle: '놀란 심신을 진정시키고 미세 충격을 치료하는 자동차보험 1:1 맞춤 케어',
    step1: { title: '소아 편타 손상 & 심신 불안(驚風) 정밀 진단', desc: '표현이 서툰 아이의 야제증·식욕 부진·짜증·근육 긴장 평가' },
    step2: { title: '맛있고 순한 무설탕 어린이 안신 첩약', desc: '놀란 심장을 진정시키고 소화기를 편안하게 다스림' },
    step3: { title: '아프지 않은 소아 자석침 & 온열 뜸 치료', desc: '본인부담금 0원으로 아이의 숙면과 정서적 안정 완성' }
  },
  'pediatric-sinusitis-rhinitis-drainage': {
    category: '만성기침·호흡기 & 보폐고 클리닉',
    subHook: '코가 꽉 막혀 입으로 숨쉬고 코골며 자는 아이',
    title: '소아 비염 · 축농증 · 한방 배농 요법',
    subTitle: '자극 없이 농을 배출하고 비강 점막 면역을 키우는 안심 한방 호흡기 치료',
    step1: { title: '비강 점막 종창 & 아데노이드 비대 정밀 진단', desc: '구강 호흡에 따른 구강 구조 변형 및 수면 무호흡 체크' },
    step2: { title: '순한 생약 비강 배농 청비 요법 & 보폐고', desc: '정체된 콧물을 시원하게 배출하고 코 점막 상피세포 보습' },
    step3: { title: '소아 면역 비염 한약 & 림프 순환 케어', desc: '항생제 내성 걱정 없이 스스로 이겨내는 코 면역력 완성' }
  },
  'pediatric-growth-immunity-herbal-tonic': {
    category: '맞춤보약 & 피로회복 클리닉',
    subHook: '또래보다 키가 작고 밥을 안 먹어 걱정인 우리 아이',
    title: '소아 성장 발달 · 식욕 부진 · 맞춤 성장 한약',
    subTitle: '소화 흡수력을 높이고 성장판에 영양을 공급하는 녹용 분골 성장 보약',
    step1: { title: '성장 잠재력 & 비위(脾胃) 허약 체질 정밀 진단', desc: '골연령·체성분·식습관·수면 패턴·소화기 흡수율 종합 평가' },
    step2: { title: '비위 강화 소아 첩약 & 최고급 녹용 분골', desc: '입맛을 돋우고 뼈와 근육의 성장을 자극하는 맞춤 처방' },
    step3: { title: '성장점 자극 침구 & 척추 밸런스 성장 추나', desc: '바른 자세와 깊은 숙면을 유도하여 키 성장 골든타임 완성' }
  },
  'achilles-tendinitis-heel-pain': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '아침 첫 발 디딜 때 뒤꿈치 위쪽이 뻣뻣하고 찌릿한 통증',
    title: '아킬레스건염 · 발뒤꿈치 통증 한방 치료',
    subTitle: '미세 파열된 건 조직을 재생하고 종아리 긴장을 푸는 봉약침 & 족부 추나',
    step1: { title: '아킬레스건 비후 & 건초 염증 정밀 진단', desc: '뒤꿈치 뼈 부착부 건염 및 비복근·가자미근 단축도 평가' },
    step2: { title: '인대강화 봉약침 & 심부 전침 요법', desc: '혈관이 부족한 건 조직에 혈류를 모아 콜라겐 섬유 증식' },
    step3: { title: '거골 교정 족부 추나 & 힐드롭 운동 티칭', desc: '발목 충격을 완충하여 보행 시 재발 방지' }
  },
  'traffic-accident-clavicle-chest-contusion': {
    category: '교통사고 후유증 & 자동차보험 클리닉',
    subHook: '안전벨트가 흉곽을 조여 숨 쉴 때마다 결리는 가슴 통증',
    title: '교통사고 가슴 타박상 · 쇄골 멍 한방 치료',
    subTitle: '흉부 미세 어혈을 녹여내고 흉곽 근막을 이완하는 자동차보험 1:1 집중 케어',
    step1: { title: '늑골 미세 골절 감별 & 흉곽 근막 손상 진단', desc: '기침·심호흡·자세 변경 시 찌릿한 흉부 통증 정밀 평가' },
    step2: { title: '어혈 소종 첩약 & 흉곽 이완 약침 치료', desc: '가슴 속 멍과 어혈을 빠르게 배출하고 호흡을 편안하게 개선' },
    step3: { title: '흉추-늑골 가동 추나 & 한방 물리치료', desc: '본인부담금 0원으로 안전벨트 후유증 완벽 해결' }
  },
  'bronchiectasis-chronic-phlegm-bopyego': {
    category: '만성기침·호흡기 & 보폐고 클리닉',
    subHook: '아침마다 끓어오르는 끈적한 가래와 반복되는 기관지염',
    title: '기관지확장증 · 만성 가래 · 보폐고 한방 치료',
    subTitle: '변형된 기관지 점막을 정화하고 배농력을 높이는 수제 보폐고',
    step1: { title: '기관지 탄력 저하 & 담열(痰熱) 울체 정밀 진단', desc: '누런 가래량·객혈 여부·호흡 곤란도·폐 기능 종합 평가' },
    step2: { title: '전통 옹기 고농축 수제 보폐고(補肺膏)', desc: '기관지 섬모 운동을 촉진하여 정체된 농성 가래 배출' },
    step3: { title: '청폐 화담 한약 & 폐수혈 정밀 약침', desc: '폐포 자생력을 강화하여 잦은 2차 세균 감염 차단' }
  },
  'elderly-frailty-appetite-deer-antler-tonic': {
    category: '맞춤보약 & 피로회복 클리닉',
    subHook: '걸음걸이가 느려지고 입맛을 잃으신 부모님의 "노쇠 증후군"',
    title: '부모님 기력 쇠약 · 식욕 부진 · 맞춤 녹용보약',
    subTitle: '소화 부담 없이 뼈와 근육을 튼튼히 하는 최고급 녹용 분골 & 원방경옥고',
    step1: { title: '간신휴허(肝腎虧虛) & 근감소 노쇠 정밀 진단', desc: '소화력·골다공증 위험도·기립성 저혈압·만성 피로도 평가' },
    step2: { title: '흡수 편한 맞춤 녹용 탕약 & 옹기 중탕 경옥고', desc: '위장에 무리 없이 오장육부의 원기를 채우고 혈류 순환 개선' },
    step3: { title: '원기 회복 약침 & 온열 뜸 치료', desc: '체온을 올리고 면역력을 증강하여 건강한 100세 활력 완성' }
  },
  'cervical-facet-syndrome-neck-pain': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '고개를 뒤로 젖히거나 돌릴 때 목 뒤 관절이 찌릿하게 걸릴 때',
    title: '경추 후관절증후군 · 목 결림 한방 치료',
    subTitle: '끼어있는 후관절 활액막을 풀고 C커브를 회복하는 경추 추나 & 약침',
    step1: { title: '경추 후관절 잠김(Facet Lock) 정밀 진단', desc: '스펄링(Spurling) 테스트 및 목디스크 신경근 압박과의 감별' },
    step2: { title: '후관절 활액막 소염약침 & 동작침법(MSAT)', desc: '염증을 즉각 가라앉히고 굳은 목 관절의 가동 범위 즉시 복원' },
    step3: { title: '경추 분절 감압 추나 & 베개 체형 교정', desc: '일자목을 바른 C커브로 정렬하여 관절 마모 재발 차단' }
  },
  'traffic-accident-insurance-treatment-guide': {
    category: '교통사고 후유증 & 자동차보험 클리닉',
    subHook: '조기 합의 후 재발하면 내 돈으로 치료? 똑똑한 환자의 선택',
    title: '교통사고 합의 전 필수 한방 치료 가이드',
    subTitle: '후유증 없는 완쾌를 위해 자동차보험으로 누리는 체계적 1:1 한방 솔루션',
    step1: { title: '사고 후 골든타임 3주 집중 케어 진단', desc: '편타 손상·미세 어혈·자율신경 불균형 종합 평가' },
    step2: { title: '본인부담금 0원 100% 자동차보험 보장', desc: '맞춤 한약 첩약·추나요법·정밀 약침·물리치료 전액 적용' },
    step3: { title: '완전 회복 후 안심 합의 원칙', desc: '통증과 가동 범위가 정상화될 때까지 안심하고 통원 치료' }
  },
  'vocal-polyp-voice-restoration-bopyego': {
    category: '만성기침·호흡기 & 보폐고 클리닉',
    subHook: '목소리가 완전히 갈라지고 성대에 물혹이 생겼을 때',
    title: '성대폴립 · 성대 부종 · 보폐고 한방 치료',
    subTitle: '수술 전 성대 점막의 혈종과 부종을 흡수시키는 수제 보폐고',
    step1: { title: '성대 점막 혈종 & 폴립 크기 정밀 진단', desc: '음성 남용으로 인한 성대 표막 파열 및 물혹 형성도 평가' },
    step2: { title: '전통 옹기 고농축 수제 보폐고(補肺膏)', desc: '성대 점막의 림프 순환을 도와 물혹 흡수 및 소염' },
    step3: { title: '청음 약침 & 발성 이완 침구 치료', desc: '성대 접촉 마찰을 최소화하여 맑고 건강한 음성 복원' }
  },
  'exam-student-concentration-chongmyeongtang': {
    category: '맞춤보약 & 피로회복 클리닉',
    subHook: '시험을 앞두고 머리가 멍하고 체력이 고갈된 수험생',
    title: '수험생 총명 공진단 · 뇌 피로 · 집중력 보약',
    subTitle: '원지·석창포·정품 사향으로 뇌 혈류를 맑게 깨우는 1:1 맞춤 총명탕',
    step1: { title: '수험생 스트레스 & 뇌 피로도 정밀 진단', desc: '기억력 감퇴·뒷목 결림·수면 장애·소화불량 종합 평가' },
    step2: { title: '동의보감 원방 총명탕 & 사향 총명공진단', desc: '중추신경 피로를 씻어내고 뇌세포 산소 공급 극대화' },
    step3: { title: '두경부 림프 순환 추나 & 청뇌 약침', desc: '상초의 열을 내리고 시험 당일 최상의 컨디션 완성' }
  },
  'trapezius-myofascial-pain-syndrome': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '어깨에 곰 한 마리가 앉아있는 듯 굳어진 만성 승모근 통증',
    title: '승모근 결림 · 근막통증증후군 한방 치료',
    subTitle: '통증유발점(Trigger Point)을 정밀 해소하고 체형을 펴는 추나 & 심부 약침',
    step1: { title: '상부 승모근 발통점 & 거북목 체형 정밀 진단', desc: '단단한 근경결 밴드 및 긴장성 두통 동반 여부 체크' },
    step2: { title: '심부 근막 이완 전침 & 소염 약침 치료', desc: '굳어버린 근육 매듭을 풀고 젖산과 노폐물 즉각 배출' },
    step3: { title: '경추-흉추 밸런스 추나 & 굽은 어깨 교정', desc: '어깨 하중을 정상화하여 만성 어깨 뭉침 영구 해소' }
  },
  'spondylolisthesis-lumbar-instability-chuna': {
    category: '척추·관절 & 추나 클리닉',
    subHook: '서 있거나 걸을 때 허리가 뚝 끊어질 듯한 척추 불안정증',
    title: '척추전방전위증 · 요추 불안정증 한방 치료',
    subTitle: '밀려난 척추뼈의 전방 전위를 제어하고 인대를 강화하는 감압 추나 & 약침',
    step1: { title: '요추 4-5번 전방 전위율(Meyerding 1~4단계) 정밀 진단', desc: '척추 협착증 동반 여부 및 다리 저림 신경근 압박 검진' },
    step2: { title: '인대강화 한방 약침 & 심부 코어 전침 치료', desc: '느슨해진 척추 후관절 인대를 조여주고 다열근 지지력 복원' },
    step3: { title: '골반 후방 경사 유도 교정 추나 & 굴곡 운동', desc: '과도한 요추 전만을 줄여 신경관 압박 재발 차단' }
  },
  'allergic-rhinitis-cold-air-sensitivity': {
    category: '만성기침·호흡기 & 보폐고 클리닉',
    subHook: '찬 공기나 아침 찬 기운에 콧물·재채기가 폭발할 때',
    title: '찬바람 알레르기 비염 · 폐한증 · 보폐고 치료',
    subTitle: '차가워진 폐를 따뜻하게 덥히고 코 점막 방어벽을 재건하는 온폐 한약',
    step1: { title: '폐한(肺寒) & 혈관운동성 비염 정밀 진단', desc: '온도 변화 과민도 및 비강 점막 창백·수양성 콧물 평가' },
    step2: { title: '온폐 산한 소청룡탕 & 고농축 수제 보폐고', desc: '폐의 찬 기운을 몰아내고 코 점막에 온기와 진액 공급' },
    step3: { title: '비강 온열 훈증 & 영향혈 면역 약침', desc: '환절기 찬바람에도 흔들림 없는 튼튼한 코 호흡 완성' }
  },
  'chronic-fatigue-adrenal-exhaustion-boyak': {
    category: '맞춤보약 & 피로회복 클리닉',
    subHook: '자고 일어나도 천근만근, 충전되지 않는 현대인의 방전 상태',
    title: '만성 피로 증후군 · 부신 피로 · 맞춤 회복 보약',
    subTitle: '고갈된 에너지를 채우고 코르티솔 균형을 맞추는 원방 공진단 & 경옥고',
    step1: { title: '부신 고갈(Adrenal Fatigue) & 기혈 허약 정밀 진단', desc: '자율신경 활성도·만성 염증 수치·수면의 질 종합 평가' },
    step2: { title: '체질 맞춤 보중익기탕 & 사향공진단', desc: '무너진 면역 체계를 복원하고 세포 미토콘드리아 에너지 활성화' },
    step3: { title: '청뇌 안신 약침 & 복부 온열 뜸 치료', desc: '자율신경 밸런스를 정상화하여 아침이 상쾌한 활력 완성' }
  }
};

let jsonInsert = '';
for (const [slug, data] of Object.entries(newItems)) {
  jsonInsert += `  '${slug}': ${JSON.stringify(data, null, 4)},\n`;
}

content = content.replace(/const columnThumbnailDB = \{/, `const columnThumbnailDB = {\n${jsonInsert}`);
fs.writeFileSync(targetFile, content, 'utf8');

console.log(`✅ exact-thumbnail-builder.js에 신규 ${Object.keys(newItems).length}개 썸네일 메타데이터 추가 완료!`);
