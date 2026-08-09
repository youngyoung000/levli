# Levli Landing

> 이 저장소는 Levli 랜딩(퍼블릭 4페이지) **스탠드얼론** 코드입니다.
> 원본 모노레포에서 랜딩 관련 파일만 추출했으며, 룰 상수는 `src/lib/rules-constants.ts`에 인라인되어 있습니다.


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
| 공통 셸 | 헤더/푸터 | `src/app/(public)/layout.tsx` + `public-layout.module.css` |

컴포넌트:
- `components/brand/levli-logo.tsx` — 로고(콤비네이션/심볼)
- `components/marketing/` — 히어로 그래픽, 화살표, **`path-icons.tsx`**(홈 카드 아이콘 3종: PNG를 potrace로 벡터화한 SVG + 부위별 모션)

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
- 반응형: 760px 이하 로고 38/27/30px·간격 26/40, **575px 이하 세로 스택**

## 2. 디자인 토큰 (단일 소스)

**`src/styles/landing-tokens.css`** — `.levli-landing` 스코프의 랜딩 전용 레이어.
제품(포털) 토큰 `tokens.css`와 분리되어 있다. **랜딩에서 하드코딩 금지, 반드시 이 변수 사용.**

- 팔레트: `--lv-night`(#0b0d12) `--lv-night-soft` `--lv-ink`(#101217) `--lv-paper`(#f2f1e9)
  `--lv-paper-bright` `--lv-mint`(#00edd5) `--lv-mint-deep`(#00b8a7) `--lv-steel` `--lv-fog` 등
- 시맨틱: `--lv-action`, `--lv-line-dark`(white 15%), `--lv-line-light`(ink 20%), `--lv-muted-*`
- 타이포: display=Host Grotesk / body=Instrument Sans / value=Roboto Mono / meta=JetBrains Mono
  (전부 Google Fonts, `app/layout.tsx`에서 next/font 로드)
- 모션: `--lv-ease-out`(cubic-bezier(0.16,1,0.3,1)), `--lv-motion-fast`(180ms)
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

### Waitlist 기타
- 인풋 포커스: 민트 보더 + 글로우 (`.textInput:focus`)
- 제출 모달 틱박스: 박스→체크 순차 스트로크 드로잉 (`tickDraw`, 0.5s + 0.4s 딜레이 0.55s)
- 제출 버튼/X 공유 버튼: 민트 글로우 + 호버 시 화살표 이동
- 리더보드 페이지네이션: 50행/페이지, `‹ 1 2 3 4 … 6 ›` (윈도우 알고리즘 `buildPageItems`)

## 4. 데모 상태 재현법 (Waitlist)

등록 상태는 서버 없이 **localStorage**에만 저장된다 (키: `levli.waitlist.entry`).

- 미등록(폼) 상태: `localStorage.removeItem("levli.waitlist.entry")` 후 새로고침
- 등록 상태 강제 주입:
  ```js
  localStorage.setItem("levli.waitlist.entry", JSON.stringify({
    xHandle: "yourhandle", telegram: "yourhandle",
    wallet: "0x1111111111111111111111111111111111111111",
    referredBy: "LEVLI-TESTA", code: "LEVLI-7X8K2",
    joinedAt: new Date().toISOString(),
  })); location.reload();
  ```
- 제출 완료 모달: 폼 작성 → Join Waitlist 클릭 직후에만 표시
- 레퍼럴 자동 입력: `/waitlist?ref=LEVLI-XXXXX` 접속 → 필드 자동 입력 + "Referral code applied"
- X 공유: `x.com/intent/post` — 슬로건 + @Levli_Official + 개인 레퍼럴 링크 자동 완성
- 리더보드 YOU 행: **데모용으로 등록 시 1페이지 6위에 인라인 표시** (`waitlist-experience.tsx`의
  `isYou` 로직). 리더보드 데이터는 결정적 목데이터 273명(`LEADERBOARD_ROWS`).

## 5. 미결 사항 / 서버 연동 지점

1. **Waitlist 등록 API 없음** — 현재 프론트 단독(localStorage). 연동 시:
   - 코드 발급을 서버로 이전 (`generateReferralCode()`는 클라이언트 임시 구현, 주석 참조)
   - 중복 등록/핸들 검증, `referredBy` 유효성 검증 서버화
2. **리더보드 실데이터** — `LEADERBOARD_ROWS` 목데이터 → API로 교체, 페이지네이션은 서버
   페이징으로 전환 권장(현재 클라이언트 slice)
3. **YOU 실순위** — 데모용 "6위 고정"을 실제 순위 삽입으로 교체 (스탯 스트립 값 동일)
4. **홈 카피 잔여 Lorem ipsum** — One clear path 카드 본문, Choose your scale 부제, 홈 FAQ 답변
5. **Recent Payouts 마퀴** — `$X,XXX` 플레이스홀더 (실데이터/정책 확정 후)
6. **FAQ 히어로의 시뮬레이션 공시 밴드 제거됨**(디자인 결정) — 컴플라이언스 관점 재확인 필요.
   Rules 본문 공시 박스·16번 섹션·푸터 문구는 유지되어 있음
7. **헤더 Get Started / Log In** → `/login` 링크 (포털 연동 시점에 확정)

## 6. 품질 체크 상태

- `tsc --noEmit` 통과, 4페이지 렌더 정상
- 반응형: 1100px / 760px 브레이크포인트 (waitlist 모바일 카드 순서: How it works → 내 스탯 → 리더보드)
- 접근성: 폼 라벨(sr-only)·aria-invalid·모달 포커스 트랩/Esc·페이지네이션 aria-current·
  reduced-motion 대응 포함
