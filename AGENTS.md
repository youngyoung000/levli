# Levli 랜딩 — 디자인 확정본 적용 지시서

이 저장소는 **디자인 확정본**이다. 실서비스 로직(지갑 서명·서버 API·실데이터)은 들어 있지 않다.
목표는 이 저장소의 **화면(마크업·CSS·카피)** 을 실서비스 랜딩 코드베이스에 반영하는 것이다.

작업하는 AI 에이전트는 아래 순서를 그대로 따르면 된다.

- 라이브 확인: https://levli-landing.vercel.app
- 상태별 확인 링크: §5

**이 저장소의 화면은 디자인 확정본이다(2026-08-13 확정).** 레이아웃·간격·색·카피를 임의로 바꾸지 마라.
Partners 로고 배치(카드 없이 46/33/36px·간격 60px)도 확정 사항이므로 실서비스의 흰 카드 방식으로
되돌리지 않는다.

## 0. 배경 — 이 확정본이 만들어진 방식

실서비스 랜딩(개발 구현본)과 디자인 원안을 대조해, **공통 요소는 디자인 원안으로 되돌리고
개발 구현본에서 새로 추가된 요소는 살려서** 합친 것이 이 저장소다.

그래서 두 종류의 코드가 섞여 있다.

| 구분 | 내용 | 클래스명 |
|---|---|---|
| 개발 구현본에서 이식 | 터미널 목업 · Proof · coming-soon · waitlist 지갑 플로우 · 헤더/푸터 | 실서비스와 **동일** (배포본 CSS를 프리픽스만 제거해 가져왔다) |
| 디자인 원안 유지 | 히어로 타이포 · One clear path 계단식 카드 · 플랜 카드 · 룰 4행 · Partners 로고 배치 | 원안 클래스 |

CSS 클래스명 일치도(실서비스 배포본 대비):

| 파일 | 일치 | 불일치 항목 |
|---|---|---|
| `public-layout.module.css` | 13/13 (100%) | — |
| `coming-soon.module.css` | 22/22 (100%) | — |
| `waitlist.module.css` | 81/86 | `pagination` `pageArrow` `pageNum` `pageNumActive` `pageGap` (이 저장소에서 추가) |
| `home.module.css` | 44/52 | `planSelect` `planRadio` `planLines` `pricingFoot` `backersSection` `backerLogos` `backersLede` `finalCtaLede` (디자인 원안으로 되돌린 영역) |

## 1. 적용 대상 파일 — 두 부류로 나눠 처리한다

### (A) 그대로 덮어쓴다 — CSS 4개 + 토큰

클래스명이 실서비스와 같으므로 파일을 통째로 교체한다.

```
src/app/(public)/home.module.css
src/app/(public)/public-layout.module.css
src/app/(public)/waitlist/waitlist.module.css
src/app/(public)/coming-soon/coming-soon.module.css
```

`src/styles/landing-tokens.css` 는 **덮어쓰지 말고 아래 4개 토큰만 추가**한다(기존 팔레트 유지):

```css
--lv-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--lv-motion-medium: 360ms;
--lv-motion-press: 110ms;
--lv-shadow-action: 0 14px 34px rgb(0 237 213 / 0.2);
```

`prefers-reduced-motion: reduce` 블록에도 `--lv-motion-medium: 0ms; --lv-motion-press: 0ms;` 를 넣어라.

### (B) 구조·카피만 반영한다 — 마크업 4개 + 신규 3개

**데이터·상태 로직은 실서비스 것을 유지하고, DOM 구조와 문구만 이 저장소를 따른다.**

```
src/app/(public)/page.tsx                        홈 — 섹션 구성·카피
src/app/(public)/layout.tsx                      헤더/푸터 — 링크·지갑 진입점 배치
src/app/(public)/waitlist/waitlist-experience.tsx  waitlist — 3분기 구조·카피
src/app/(public)/coming-soon/page.tsx            신규 페이지 (그대로 복사 가능)
```

신규 파일은 그대로 복사한다:

```
src/components/marketing/terminal-preview.tsx    터미널 목업 (정적, 로직 없음)
src/components/wallet/wallet-auth.tsx            ⚠ DEMO ONLY — §3 참조
src/components/wallet/landing-wallet-login.tsx   헤더 지갑 칩·팝오버 (UI만)
```

## 2. 홈에서 디자인 원안으로 되돌려야 하는 것

실서비스 구현본이 바꾼 부분이다. **아래는 원안대로 되돌린 상태가 정답이다.**

| 항목 | 실서비스 현재 | 확정본 |
|---|---|---|
| 히어로 h1 | 2행 중 둘째 줄 민트 | 흰색 2행 |
| 히어로 콘 그래픽 | 축소·이동 | 545×541 우측, `HeroConeGraphic` |
| One clear path 카드 | 3장 동일 높이 | **계단식 320 / 356 / 392px**, 3번째 다크 |
| 카드 아이콘 | 축소 | 108px + 모션(깃발·화살표·코인) |
| 플랜 카드 | `planCard` 계열 | `planSelect`/`planRadio`/`planLines` (310×250, 가격 대형) |
| 룰 표시 | `rulePanel` 박스 + 민트 값 | `ruleGrid` 4행, 흰색 대형 타이포, 박스 없음 |
| Partners 로고 | 각 로고를 흰 카드에 담음 | 배경 없이 46/33/36px, 간격 60px |
| Get Started 호버 | 부양 + 글로우 + 아이콘 이동 | **색 전환만** |
| Recent Payouts 마퀴 | 없음 | 없음(삭제 확정) — Proof 섹션이 그 자리 |

섹션 순서: 히어로 → facts → **터미널** → One clear path → Choose your scale → Rules → **Proof** → FAQ → **Partners** → 최종 CTA

## 3. DEMO ONLY — 실서비스 반영 시 제거/교체할 것

파일 상단에 같은 내용이 주석으로 박혀 있다. 놓치면 실서비스 기능이 죽는다.

### `src/components/wallet/wallet-auth.tsx` — 파일 하나만 교체

지갑 SDK 없이 상태 전이만 재현하는 목 구현이다. **아래 인터페이스를 유지하고 내부만
wagmi/viem + `/auth/wallet/nonce`·`/auth/wallet/verify` 호출로 바꾼다.**

```ts
session: { address: string; walletName: string } | null
status : "disconnected" | "connecting" | "signing" | "authenticated"
connect(): void
disconnect(): void
```

UI(`LandingWalletLogin` · `WalletGate` · `WalletIdentity`)는 이 값만 소비하므로 **수정 불필요**.
`applyDemoSession()` 은 검토용 진입점이므로 제거한다.

### `src/app/(public)/waitlist/waitlist-experience.tsx`

| # | 데모 장치 | 교체 대상 |
|---|---|---|
| 1 | `STORAGE_KEY` localStorage 등록 상태 | 서버 등록 API 응답 |
| 2 | `generateReferralCode()` | 서버 발급 코드 |
| 3 | `?demo=wallet\|joined` (`demoState`) | 제거 |
| 4 | `?lb=ranked` (`rankedBoard`) + `LEADERBOARD_ROWS` 273명 + 페이지네이션 | 실데이터·서버 페이징 |
| 5 | `WAITLIST_TOTAL` `ACTIVE_REFERRERS` `RANKED_WAITLISTERS` | 서버 집계값 |
| 6 | `YOU_RANK` (6위 고정) | 실제 내 순위 |

리더보드가 실데이터 0건이면 빈 상태(`emptyRow`)가 그대로 정답이다. 데이터가 찼을 때의
디자인은 `?lb=ranked` 로 확인할 수 있고, 그 표현(`rankCell` 민트 숫자 · `currentRow` 행 배경 ·
`youBadge` 채움 배지)은 실서비스 CSS에 이미 있다. **페이지네이션만 이 저장소에서 추가한 것**이므로,
서버 페이징을 붙이지 않는다면 함께 제거한다.

## 4. 절대 건드리지 말 것

- **`landing-tokens.css` 팔레트 값** — 하드코딩된 색을 새로 만들지 말고 `--lv-*` 토큰을 쓴다.
- **`public/logos/*.png`** — 알파 bbox에 타이트 크롭된 상태라 CSS `height`가 곧 잉크 높이다.
  로고를 교체할 때도 같은 방식으로 크롭해야 정렬이 유지된다.
- **`public/images/final-cta-cone.png`** — 꼭지점이 이미지 하단에 딱 맞게 크롭돼 있다.
  최종 CTA 섹션 높이 490px과 그래픽 `top: 34px` / 457px 조합이 꼭지점을 섹션 하단에 맞물리게 한다.
  섹션 높이를 바꾸면 콘이 잘린 것처럼 보인다.
- **히어로 높이** — `calc(100svh - 118px)`. 헤더(74px, fixed)가 히어로 위에 겹치고 facts(118px)를
  뺀 값이라, 히어로 + facts가 정확히 첫 화면에 맞물린다. 고정 px로 바꾸면 이 정렬이 깨진다.
- **waitlist 히어로 배경 라인 모션** — 5개 그룹이 `.benefits`(가로 디바이더)와 `.heroGrid`(세로
  디바이더 = 우측 428px)에 앵커되어 끝점이 정확히 맞물린다. 근사 % 값이 아니므로 구조를 바꿀 때
  이 앵커 관계를 유지해야 한다.

## 5. 검증 절차

```bash
pnpm install
pnpm build          # 타입·빌드 통과 확인
pnpm dev            # 로컬 확인
```

라우트는 5개 전부 200이어야 한다: `/` `/rules` `/faq` `/waitlist` `/coming-soon`

상태별 확인 링크(데모 파라미터, 실서비스 반영 후에는 불필요):

| 상태 | 링크 |
|---|---|
| waitlist 지갑 미연결 | `/waitlist` |
| waitlist 지갑 연결됨 | `/waitlist?demo=wallet` |
| waitlist 등록 완료 | `/waitlist?demo=joined` |
| 리더보드 데이터 + 내 순위 | `/waitlist?lb=ranked&demo=joined` |

시각 확인 시 유의: 히어로가 `100svh` 기준이므로 **창을 아주 길게 만들어 전체 페이지를 한 장으로
캡처하면 히어로가 창 높이만큼 늘어나** 결과가 왜곡된다. 일반 창 크기에서 스크롤하며 확인하라.

반응형 브레이크포인트: 1100px / 760px (+ Partners 로고는 575px 이하 세로 스택)

## 6. 문서

- **`DESIGN_SYSTEM.md`** — 색·타이포·레이아웃·컴포넌트·모션 규칙. 새 화면을 만들거나
  기존 화면을 손볼 때 이 문서의 규칙을 따른다(§9에 체크리스트).
- `README.md` — 파일 맵·모션 스펙·상태별 확인 링크
- 섹션별 실측값(간격·크기)은 README와 CSS 주석에 남아 있다. 간격을 조정할 때는
  **렌더에서 픽셀을 재서** 맞춰라. 같은 `margin` 값이 flow / flex / absolute 배치에서 다른 결과를
  내기 때문에, 값만 보고 판단하면 어긋난다(실제로 이 저장소에서 여러 번 발생했다).
