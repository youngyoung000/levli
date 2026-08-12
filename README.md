# Levli Landing

> **작업을 시작하기 전에 [`AGENTS.md`](./AGENTS.md)를 먼저 읽으세요.**
> 이 저장소를 실서비스 코드에 반영하는 순서·파일별 처리 방법·제거해야 할 데모 코드·
> 사람에게 확인할 항목이 그 문서에 정리돼 있습니다. AI 에이전트로 작업하는 경우도 동일합니다.

> 이 저장소는 Levli 랜딩(퍼블릭 5페이지) **스탠드얼론 디자인 확정본**입니다.
> 실서비스 로직(지갑 서명·서버 API·실데이터)은 들어 있지 않고, 화면만 완성돼 있습니다.
> 룰 상수는 `src/lib/rules-constants.ts`에 인라인되어 있습니다.


퍼블릭 랜딩 4페이지(홈·Rules·FAQ·Waitlist)의 **완성 구현 코드** 핸드오프 문서.
디자인은 코드로 구현되어 있으며 이 코드가 곧 스펙이다. Figma는 보조 참조용.

- **라이브 데모(상시)**: https://levli-landing.vercel.app (+ `/waitlist`, `/rules`, `/faq`)
  — Vercel 프로젝트 `levli-landing`, 재배포: 레포 루트에서 `vercel deploy --prod`
- Figma(디자인 원본·상태 캡처): https://www.figma.com/design/IqBa65jg7C6Uzmbqw9fvSM
  (Rules=1:2, FAQ=2:2, Waitlist=8:2 + 제출 모달/제출 후 히어로 캡처 페이지)
- 로컬 실행: `pnpm install && pnpm dev` → http://localhost:3001



## 0. 이 저장소에서 제외된 것 (모노레포에만 존재)

- `/how-it-works`, `/pricing`, `/legal/*` — 구 포털 컴포넌트 의존 페이지 (헤더·푸터의 해당 링크는 여기선 404)
- `/login`, 포털(대시보드·트레이딩), 백엔드 API — 연동 시 모노레포 참조

## 1. 페이지 / 파일 맵

| 경로 | 페이지 | 주요 파일 |
|---|---|---|
| `/` | 랜딩 홈 | `src/app/(public)/page.tsx` + `home.module.css` |
| `/rules` | Trading Rules | `src/app/(public)/rules/page.tsx` + `content-page.module.css`(공용) |
| `/faq` | FAQ | `src/app/(public)/faq/page.tsx`, `faq-explorer.tsx`(클라이언트 검색/필터), `faq-content.ts`(47문항 데이터) |
| `/waitlist` | Waitlist | `src/app/(public)/waitlist/page.tsx`, `waitlist-experience.tsx`(클라이언트 전체), `waitlist.module.css` |
| `/coming-soon` | Coming Soon | `src/app/(public)/coming-soon/page.tsx` + `coming-soon.module.css` |
| 공통 셸 | 헤더/푸터 | `src/app/(public)/layout.tsx` + `public-layout.module.css` |

컴포넌트:
- `components/brand/levli-logo.tsx` — 로고(콤비네이션/심볼)
- `components/marketing/` — 히어로 그래픽, 화살표, **`path-icons.tsx`**(홈 카드 아이콘 3종: PNG를 potrace로 벡터화한 SVG + 부위별 모션),
  **`terminal-preview.tsx`**(홈 "Inside the terminal" 목업 — 정적, 로직 없음)
- `components/wallet/` — **`wallet-auth.tsx`**(⚠ DEMO ONLY 지갑 세션 목 구현 — 이 파일만 교체하면 된다),
  `landing-wallet-login.tsx`(헤더 지갑 칩 + 팝오버, UI만)

에셋:
- `public/icons/` — icons8 PNG 원본(waitlist 벤핏·메달은 CSS mask로 민트 단색화해 사용)
- `public/images/` — 홈 최종 CTA 그래픽
- `public/logos/` — Backed by 파트너 로고 3종(Aster/Hyperliquid/Nado). **알파 bbox에 타이트 크롭된
  상태**라 CSS `height`가 곧 잉크 높이다. 로고 교체 시 반드시 동일하게 타이트 크롭할 것

홈 Backed by 섹션(`.backersSection`, FAQ ↔ 최종 CTA 사이) 실측 스펙 — 1440px 기준:
- 섹션 높이 650px, 콘텐츠 수직 중앙(헤딩 잉크 top 261, 로고 행 y350~395)
- 헤딩 `Backed by` = 다른 섹션 h2와 동일(64px/62.72 Host Grotesk, -2.24px)
- 로고 행: 총폭 667px(x387~1053) 중앙 정렬, 로고 간 간격 60px
- 로고 높이 Aster 46 / Hyperliquid 33 / Nado 36px(시각 무게 정렬), 폭은 원본 종횡비 유지
- Hyperliquid만 `translateY(3px)` — 디자인에서 x-height 기준 광학 정렬된 값
- 반응형(760px 이하 = 모바일): **로고 세로 스택**, 높이 27/19/21px(데스크톱의 약 70%), 간격 22px,
  Hyperliquid의 3px 광학 보정은 해제(세로 정렬에서는 불필요)

## 2. 디자인 토큰 (단일 소스)

**`src/styles/landing-tokens.css`** — `.levli-landing` 스코프의 랜딩 전용 레이어.
제품(포털) 토큰 `tokens.css`와 분리되어 있다. **랜딩에서 하드코딩 금지, 반드시 이 변수 사용.**

- 팔레트: `--lv-night`(#0b0d12) `--lv-night-soft` `--lv-ink`(#101217) `--lv-paper`(#f2f1e9)
  `--lv-paper-bright` `--lv-mint`(#00edd5) `--lv-mint-deep`(#00b8a7) `--lv-steel` `--lv-fog` 등
- 시맨틱: `--lv-action`, `--lv-line-dark`(white 15%), `--lv-line-light`(ink 20%), `--lv-muted-*`
- 타이포: display=Host Grotesk / body=Instrument Sans / value=Roboto Mono / meta=JetBrains Mono
  (전부 Google Fonts, `app/layout.tsx`에서 next/font 로드)
- 모션: `--lv-ease-out`(cubic-bezier(0.16,1,0.3,1)) `--lv-ease-spring` ·
  `--lv-motion-fast`(180ms) `--lv-motion-medium`(360ms) `--lv-motion-press`(110ms) · `--lv-shadow-action`
- 사용 규칙: 다크 섹션 위 텍스트 = white/steel 계열, 라이트(paper) 섹션 = ink/muted-light.
  수치(KPI·코드·순위)는 mono + `font-variant-numeric: tabular-nums`.

## 3. 모션 스펙

모든 모션은 `prefers-reduced-motion: reduce`에서 정지/숨김 처리되어 있음.

### 홈 — One clear path 카드 아이콘 (`path-icons.tsx` + `home.module.css`)
- Challenge: 깃발 조각이 폴 기준 펄럭임 — `flagWave` 2.6s ease-in-out 무한
- Trading: 상승 화살표가 좌→우로 그려짐(clip-path inset 리빌) — `trailReveal` 3.6s 무한
- Funded: 코인 그룹 바운스 — `coinBob` 2.2s(SVG 좌표 기준 -56px) 무한

### Waitlist 히어로 — 배경 라인 모션 (`waitlist.module.css` `.lineGroup` 블록)
5개 그룹이 순차로 "기존 라인에서 펼쳐졌다 복귀". **총 13.5s 루프.**
- 그룹당: 펼침 0.6s(ease-out) → 유지 0.5s → 복귀 0.6s(ease-in), 그룹 간 1s 간격(딜레이 2.7s 간격)
- 순서: ①중앙 상단 세로(디바이더→좌) ②좌하 가로(바닥→위) ③우상 가로(헤더 밑→아래)
  ④중앙 하단 세로 ⑤좌중 가로(가로 디바이더→위)
- 간격은 이동 방향으로 점감(디자인 실측값, nth-child `--tx/--ty` 참조)
- **앵커 구조(중요)**: 근사 % 아님. 그룹 1·4·5는 `.benefits`(가로 디바이더 호스트),
  그룹 2·3은 `.heroGrid`(세로 디바이더 = 우측 428px)에 앵커하고 라인을 길게 뻗은 뒤
  hero `overflow:hidden`으로 잘라 끝점이 항상 정확히 맞물린다. 구조 변경 시 이 관계 유지할 것.

### 홈 — Inside the terminal / Proof (개발 구현본에서 이식)
- 터미널 프레임: 차트 라인 `drawChart`, 종가 점 `chartPulse`, 오더북 깊이 `bookDepth`
- 섹션 라벨 점: `statusPulse` 2s / 히어로 배경 글로우: `glowBreath` 7s
- Proof 카드: 호버 시 배경·문구 색 전환(화살표는 디자인 결정으로 제거)
- 모바일(760px 이하): 터미널 프레임은 세로 스택이 아니라 **가로 스크롤**(`min-width: 660px`)

### /coming-soon
- h1 두 줄 순차 등장 `lineReveal`, 액세스 콘솔 패널 `consoleReveal`
- 히어로 격자 배경(`heroGrid`)과 780px 글로우 원

### Waitlist 기타
- 인풋 포커스: 민트 보더 + 글로우 (`.textInput:focus`)
- 제출 모달 틱박스: 박스→체크 순차 스트로크 드로잉 (`tickDraw`, 0.5s + 0.4s 딜레이 0.55s)
- 제출 버튼/X 공유 버튼: 민트 글로우 + 호버 시 화살표 이동
- 리더보드 페이지네이션: 50행/페이지, `‹ 1 2 3 4 … 6 ›` (윈도우 알고리즘 `buildPageItems`)

## 4. 상태별 확인 방법

지갑 연결은 SDK 없이 상태 전이만 재현하는 **목 구현**이다(`components/wallet/wallet-auth.tsx`).
등록 상태는 서버 없이 localStorage(`levli.waitlist.entry`)에만 저장된다.

| 상태 | 링크 | 화면 |
|---|---|---|
| 지갑 미연결 | `/waitlist` | Secure your spot → Connect Wallet 게이트 |
| 지갑 연결됨 | `/waitlist?demo=wallet` | 지갑 요약 카드 + X Handle·Referral 입력 + Join Waitlist |
| 등록 완료 | `/waitlist?demo=joined` | You're on the waitlist + 레퍼럴 코드/링크 + Share on X |
| 리더보드 데이터 | `/waitlist?lb=ranked` | 목데이터 273명 + 페이지네이션 |
| 데이터 + 내 순위 | `/waitlist?lb=ranked&demo=joined` | 위 + 6위에 YOU 행 |

- `?demo=` 는 저장소를 건드리지 않으므로 파라미터를 빼면 원래 상태로 돌아온다.
- 실제 흐름(Connect Wallet 클릭 → 연결 → 폼 → 제출 → 모달)도 그대로 동작한다.
- 레퍼럴 자동 입력: `/waitlist?ref=LEVLI-XXXXX` → 필드 자동 입력 + "Referral code applied"
- X 공유: `x.com/intent/post` — 슬로건 + @Levli_Official + 개인 레퍼럴 링크 자동 완성
- 헤더는 지갑 연결 시 주소 칩(`0x…`)으로 바뀌고, 클릭하면 주소 복사·연결 해제 팝오버가 열린다.

**위 파라미터·목데이터·페이지네이션은 검토용이다. 실서비스 반영 시 제거 대상 — `AGENTS.md` §3 참조.**

## 5. 미결 사항 / 서버 연동 지점

1. **Waitlist 등록 API 없음** — 지갑 서명·서버 등록·레퍼럴 코드 발급을 실구현으로 교체
   (`AGENTS.md` §3에 파일·상수 단위 목록)
2. **리더보드 실데이터** — 목데이터 → API, 페이지네이션은 서버 페이징으로 전환하거나 제거
3. **YOU 실순위** — 데모용 6위 고정을 실제 순위로
4. **Recent Payouts** — 삭제 확정(Proof 섹션이 그 자리). 실측 payout이 쌓이면 재검토
5. **용어 `payout` → `reward`** — 컴플라이언스 검토 결과인지 확인 필요. 맞다면 Rules 본문·ToS까지 통일
6. **KYC 문구 완화** — "현재 Trial/Evaluation/Funded에 KYC를 요구하지 않는다"는 법무 검토 대상
7. **법무 문서 링크** — 현재 외부 도메인(`levli-trading.vercel.app`). 최종 도메인 확정 시 교체
8. **헤더 Get Started** → `/coming-soon`. 포털 오픈 시 실제 진입점으로 교체

## 6. 품질 체크 상태

- `pnpm build` 통과, 5개 라우트(`/` `/rules` `/faq` `/waitlist` `/coming-soon`) 렌더 정상
- 반응형: 1100px / 760px 브레이크포인트 (waitlist 모바일 카드 순서: How it works → 내 스탯 → 리더보드,
  Partners 로고는 575px 이하 세로 스택)
- 히어로 높이는 `calc(100svh - 118px)` — 히어로 + facts가 첫 화면에 맞물린다.
  **창을 길게 만들어 전체 페이지를 한 장으로 캡처하면 히어로가 창 높이만큼 늘어나 왜곡된다.**
- 접근성: 폼 라벨(sr-only)·aria-invalid·모달 포커스 트랩/Esc·페이지네이션 aria-current·
  reduced-motion 대응 포함
