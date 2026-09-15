# 해아림한의원 부평점 통합진료센터 (healim-clinic)

척추·관절 통증, 추나요법, 교통사고 후유증, 만성 호흡기(보폐고), 맞춤 보약 특화 서브 공식 홈페이지  
- **특화 서브 도메인**: `https://healim-bp.com`
- **본원(뇌신경정신) 대표 도메인**: `https://healimbp.com`

---

## 🚀 1. GitHub 저장소 등록 및 최초 배포 방법

### ① GitHub에서 새 저장소(Repository) 생성
1. [GitHub](https://github.com/new)에 접속하여 새 저장소를 생성합니다. (예: `healim-clinic` 또는 `healim-bp`)
2. **Public** 또는 **Private** 중 원하는 형태로 생성합니다. (README 추가 체크 해제)

### ② 로컬 저장소와 GitHub 원격 저장소 연결 & 푸시
VS Code 터미널(또는 CMD)에서 아래 명령어를 순서대로 실행합니다:

```bash
# 1. GitHub 원격 저장소 연결 (본인 계정 URL로 변경)
git remote add origin https://github.com/<본인깃허브아이디>/<저장소이름>.git

# 2. main 브랜치로 푸시
git push -u origin main
```

### ③ GitHub Pages 배포 설정 (최초 1회)
1. GitHub 저장소 상단 메뉴에서 **Settings** > **Pages** 클릭
2. **Build and deployment > Source** 항목을 `Deploy from a branch`에서 👉 **`GitHub Actions`**로 변경
3. 설정 즉시 `.github/workflows/deploy.yml`이 자동 실행되어 약 1~2분 후 배포가 완료됩니다.

---

## ✍️ 2. 건강 칼럼 자동 발행 & 예약 발행 가이드

### ① 새 칼럼 템플릿 생성 명령어

```bash
# [방법 A] 오늘 날짜로 즉시 발행 칼럼 생성
npm run new:column shoulder-pain-chuna

# [방법 B] 특정 날짜로 예약 자동 발행 칼럼 생성 (예: 2026년 9월 25일)
npm run new:column shoulder-pain-chuna 2026-09-25
```

생성된 `content/column/shoulder-pain-chuna/index.md` 파일에 칼럼 본문을 작성합니다.

### ② GitHub에 커밋 & 푸시하여 자동 발행

```bash
git add .
git commit -m "feat: add new column on shoulder pain"
git push
```

### ⏰ 자동 발행 작동 원리 (GitHub Actions)
- **즉시 발행**: 오늘 날짜(또는 과거 날짜)가 적힌 칼럼은 `git push` 즉시 사이트에 게시됩니다.
- **예약 자동 발행**: 미래 날짜(예: `2026-09-25`)가 적힌 칼럼은 푸시해도 사이트에 바로 나타나지 않고 대기 상태로 유지되며, **매일 한국시간 오전 9시(00:00 UTC)와 오후 9시(12:00 UTC)**에 GitHub Actions가 자동 실행되어 해당 날짜가 되면 사이트에 자동 발행됩니다.
- **수동 즉시 재배포**: GitHub 저장소의 **Actions** 탭 > `Deploy Hugo Site & Scheduled Column Auto-Publish` > **Run workflow** 버튼 클릭.

---

## 💻 로컬 개발 & 빌드 명령어

```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행 (http://localhost:1313)
npm run dev

# 프로덕션 정적 파일 빌드 (./public)
npm run build
```

---

## 📍 기본 정보
- **위치**: 인천광역시 부평구 경원대로 1412, 2층 (부평동 534-48, 부평역 7번 출구 도보 5분)
- **전화**: 032-719-3472
- **진료시간**: 월·수·금 09:30 ~ 20:00 (야간) / 화·목 09:30 ~ 19:00 / 토 09:30 ~ 15:00 (점심시간 없음)
