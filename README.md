# Binder Clone (brand-monitor)

브랜드 부정 이슈 실시간 모니터링 서비스 데모. `desk.teambinder.ai`의 UI/UX 구조를 참고해 처음부터 새로 만든 프로젝트입니다.

## 구성

- `src/` — React + TypeScript + Vite 프론트엔드 (포트 5173)
- `server/` — Express 백엔드 (포트 8787). 네이버 검색 API로 실제 게시물을 수집하고 감성 분석 후 저장합니다.

## 실행 방법

### 1. 프론트엔드

```bash
npm install
npm run dev
```

### 2. 백엔드 (실제 데이터 수집을 쓰려면 필요)

```bash
cd server
npm install
cp .env.example .env   # 키 입력 후 저장
npm run dev
```

백엔드 없이 프론트엔드만 실행해도 시연용 목업 데이터로 전체 화면을 볼 수 있습니다. 백엔드가 켜져 있으면 새로 등록하는 키워드는 실제 네이버 검색 결과를 수집합니다.

## 필요한 API 키

### 네이버 검색 API (필수 — 실제 수집 기능)

1. https://developers.naver.com/apps/#/register 접속 후 애플리케이션 등록 (무료)
2. 사용 API에서 "검색" 체크
3. 발급받은 Client ID / Client Secret을 `server/.env`에 입력

```
NAVER_CLIENT_ID=발급받은값
NAVER_CLIENT_SECRET=발급받은값
```

키가 없으면 크롤링 요청 시 안내 메시지만 표시되고 서비스는 정상 동작합니다.

### Anthropic API (선택 — 고품질 감성 분석)

`ANTHROPIC_API_KEY`를 설정하면 수집된 게시물의 긍정/부정 판단을 Claude가 수행합니다. 설정하지 않으면 내장된 한국어 키워드 사전 기반 분석으로 자동 대체됩니다.

## 아직 없는 기능

- 실제 로그인(카카오/구글 OAuth) — 각 서비스 콘솔에서 OAuth 앱을 등록해야 하는 영역이라 보류했습니다.
- 슬랙 알림 실전송 — 설정 화면에서 Webhook URL은 저장되지만 실제 전송 로직은 아직 없습니다.
- AI 종합 인사이트 요약의 실시간 생성 — 현재는 예시 데이터로 구성되어 있고, 실시간 감지 탭의 이슈만 백엔드와 연동됩니다.
