# Levli 랜딩 디자인 시스템

랜딩(퍼블릭 5페이지)에 실제로 적용된 디자인 규칙이다. 값은 모두 코드에서 추출했으며,
**단일 소스는 `src/styles/landing-tokens.css`** 다. 이 문서는 그 토큰이 어떻게 쓰이는지를 설명한다.

- 스코프: `.levli-landing` 클래스 하위에서만 적용된다. 제품(포털) 토큰 `tokens.css`와 분리돼 있다.
- 적용 범위: `/` `/rules` `/faq` `/waitlist` `/coming-soon`
- 라이브: https://levli-landing.vercel.app

**원칙 하나만 기억하면 된다 — 색·간격·폰트를 하드코딩하지 말고 `--lv-*` 토큰을 쓴다.**

---

## 1. 색

### 브랜드 팔레트

| 토큰 | 값 | 용도 |
|---|---|---|
| `--lv-night` | `#0b0d12` | 다크 섹션 기본 배경(히어로, 최종 CTA 외) |
| `--lv-night-soft` | `#151822` | 다크 섹션 중 한 단계 밝은 면(FAQ, 선택 요약 바) |
| `--lv-ink` | `#101217` | 라이트 섹션의 텍스트, 다크 카드 배경(path 3번째 카드) |
| `--lv-paper` | `#f2f1e9` | 라이트 섹션 배경(facts, 터미널, path, Proof, Partners, 최종 CTA) |
| `--lv-paper-bright` | `#fbfaf4` | 라이트 섹션 위 카드 면 |
| `--lv-white` | `#ffffff` | 다크 배경 위 제목·값 |
| `--lv-mint` | `#00edd5` | 액션(CTA), 강조, 라이브 신호 |
| `--lv-mint-deep` | `#00b8a7` | 호버 상태, 라이트 배경 위 민트(대비 확보용) |
| `--lv-mint-soft` | `#a8f7e9` | 보조 강조 |
| `--lv-mint-pale` | `#d7fbf5` | 테이블 행 호버 |
| `--lv-fog` | `#dfe4e1` | 카드 면(path 2번째 카드), 수식 박스 |
| `--lv-steel` | `#9aa2b2` | **다크 배경** 위 보조 텍스트 |

### 시맨틱

| 토큰 | 값 |
|---|---|
| `--lv-action` / `--lv-action-ink` | `mint` / `#001715` (민트 버튼 위 글자색) |
| `--lv-line-dark` | `rgb(255 255 255 / 0.15)` — 다크 섹션 구분선 |
| `--lv-line-light` | `rgb(16 18 23 / 0.2)` — 라이트 섹션 구분선 |
| `--lv-muted-dark` | `rgb(255 255 255 / 0.62)` — 다크 배경 보조 텍스트 |
| `--lv-muted-light` | `rgb(16 18 23 / 0.62)` — **라이트 배경 보조 텍스트** |

### 사용 규칙 — 배경에 따라 보조 텍스트 색이 갈린다

이 규칙을 어기면 대비가 무너진다. 실제로 여러 번 발생했던 실수다.

| 배경 | 제목 | 본문·리드문 |
|---|---|---|
| 다크(`night`, `night-soft`, `ink`) | `--lv-white` | `--lv-steel` |
| 라이트(`paper`, `paper-bright`) | `--lv-ink` | `--lv-muted-light` |

민트도 배경에 따라 다르다. **다크 위에서는 `--lv-mint`, 라이트 위에서는 `--lv-mint-deep`** 을 쓴다
(`paper` 위의 `mint`는 눈에 잘 띄지 않는다).

---

## 2. 타이포

### 폰트 (전부 Google Fonts, `app/layout.tsx`에서 `next/font` 로드)

| 토큰 | 폰트 | 용도 |
|---|---|---|
| `--lv-font-display` | Host Grotesk | 제목(h1~h3) |
| `--lv-font-body` | Instrument Sans | 본문, 버튼, 라벨 |
| `--lv-font-value` | Roboto Mono | **수치**(가격, 순위, KPI, 주소) |
| `--lv-font-meta` | JetBrains Mono | **메타 라벨**(eyebrow, 표 헤더, 칩, 상태) |

### 실제 사용 스케일

| 역할 | 값 | 자간 |
|---|---|---|
| 히어로 h1 | `500 72px/70.56px` display | `-2.88px` |
| 섹션 h2 | `500 64px/62.72px` display | `-2.24px` |
| 페이지 h1 (Rules/FAQ) | `500 clamp(64px, 6vw, 88px)/0.92` display | `-0.045em` |
| coming-soon h1 | `500 clamp(58px, 5.5vw, 82px)/.95` display | `-.055em` |
| 카드 h3 | `600 24px/26.4px` display | `-0.6px` |
| 패널 h2 (waitlist 폼) | `500 26px/1.12` display | `-.02em` |
| 히어로 리드문 | `400 18px/27px` body | — |
| **본문·섹션 리드문** | `400 15px/23.25px` body | — |
| 긴 본문 (Rules) | `400 17px/28px` body | — |
| 버튼·링크 | `600 14px/18px` body | — |
| 보조 텍스트 | `400 13px/20px` body | — |
| **수치 (KPI·가격·순위)** | `700 20px/20px` value | `-0.4px` |
| eyebrow / 섹션 라벨 | `600 10px/14px` meta | `.13em`, uppercase |
| 표 헤더 | `600 10px/13px` meta | `.08em`, uppercase |
| 칩 | `500 10px/12px` meta | `.02em` |
| 최소 라벨 (지갑 카드) | `600 8px/11px` meta | `.08em`, uppercase |

### 규칙

- **수치는 반드시 mono + `font-variant-numeric: tabular-nums`** — 값이 바뀔 때 자리가 흔들리지 않아야 한다.
- 메타 라벨은 `uppercase` + 자간 `.08em~.14em`. 소문자로 쓰지 않는다.
- 모바일(760px 이하)에서 h1은 48px/47.04, h2는 44px/44로 내려간다.

---

## 3. 레이아웃

### 컨테이너

```css
/* 방식 A — 셸 요소 */
width: min(1280px, calc(100% - 160px));
margin: 0 auto;

/* 방식 B — 섹션 자체에 패딩 */
padding: <y> max(80px, calc((100vw - 1280px) / 2));
```

두 방식이 같은 결과를 낸다. **콘텐츠 폭 1280px, 최소 좌우 여백 80px**(모바일 20px, 태블릿 40px).

### 브레이크포인트

| 폭 | 변화 |
|---|---|
| `1100px` | 컨테이너 여백 40px, 3열 → 축소, 터미널 2열 |
| `760px` | 모바일 — 여백 20px, 단일 컬럼, 타이포 축소, 버튼 세로 스택 |
| `575px` | Partners 로고 세로 스택 |
| `359px` | 플랜 카드 1열 |

### 첫 화면 구성 (홈)

```
헤더 74px (fixed, 히어로 위에 겹침)
히어로 calc(100svh - 118px)   ← facts 높이만 뺀 값
facts 118px                    ← 첫 화면 하단에 정확히 맞물린다
```

히어로 콘텐츠는 세로 중앙 정렬(광학 보정 26px 위). `min-height: 700px`.

### 라운딩

| 값 | 용도 |
|---|---|
| `999px` | 버튼·칩·배지 (가장 많이 쓰인다) |
| `50%` | 상태 점, 원형 아이콘 |
| `0` | **카드·패널 — 각을 살린다** (path 카드, 플랜 카드, 터미널 프레임) |
| `4px` / `6px` / `8px` | 지갑 카드, 모달, 코드 플레이트 |

카드에 큰 라운딩을 주지 않는 것이 이 랜딩의 성격이다.

---

## 4. 섹션 패턴

### 섹션 헤드

```
[eyebrow]        ● TEXT        ← 6px 민트 점 + meta 10px uppercase (선택)
h2               제목.
p                리드문         ← 타이틀 잉크 하단에서 24px
```

**리드문 간격은 24px로 통일돼 있다.** 단, 같은 `margin: 21px`이 배치 방식에 따라 다른 결과를 내므로
새 섹션을 만들 때는 **렌더에서 픽셀을 재서** 맞춰야 한다(flow 24px / flex 36px / absolute 45px로
어긋난 사례가 있다).

eyebrow는 pill이 아니라 **점 + 텍스트**다. 점은 `statusPulse` 2s로 숨쉰다.

### 배경 리듬 (홈)

```
히어로 night → facts paper → 터미널 paper → path paper → 가격 ink
→ 룰 ink → Proof paper → FAQ night-soft → Partners paper → 최종 CTA paper
```

다크 구간에서 상품·룰을 보여주고, 라이트 구간에서 설명·증거를 보여주는 리듬이다.

---

## 5. 컴포넌트

### 버튼

세 종류 모두 공통 골격: `height 48px · radius 999px · font 600 14px/18px body · gap 10px`

| 종류 | 스타일 | 호버 |
|---|---|---|
| `primaryButton` / `sectionButton` | 민트 채움, 글자 `ink`, 폭 174px | `mint-deep`로 색 전환만 |
| `secondaryButton` | 투명 + 흰 테두리 22%, `min-width 132px` | 테두리 흰색 |
| `startLink` (헤더 CTA) | 민트 채움, 142×38px, `space-between` + 화살표 | 색 전환만 |

**호버는 색 전환만 한다.** 부양(`translate`)·글로우(`box-shadow`)·아이콘 이동은 쓰지 않는다
(개발 구현본에 있었으나 디자인 결정으로 제거).

### 칩 / 배지

```css
/* 히어로 벤핏 칩 */
color: #ffffff8f;  font: 500 10px/12px meta;  letter-spacing: .02em;
background: #ffffff06;  border: 1px solid #ffffff21;  border-radius: 999px;  padding: 7px 11px;

/* waitlist 히어로 pill (테두리 있는 강조형) */
height: 36px;  padding: 0 20px;  border: 1px solid rgb(0 237 213 / 0.45);
background: rgb(0 237 213 / 0.06);  box-shadow: 0 0 28px rgb(0 237 213 / 0.14);
color: mint;  font: 600 10px/12px meta;  letter-spacing: .14em;  uppercase
```

### 카드 3종

| 카드 | 특징 |
|---|---|
| **path (One clear path)** | 계단식 높이 **320 / 356 / 392px**, 3번째만 다크(`ink`). 배경 `paper-bright` / `fog` / `ink`. radius 0, 하단 테두리 없음 |
| **plan (Choose your scale)** | 310×250px, 선택된 카드는 민트 채움. 가격은 대형 mono. 라디오는 `sr-only` |
| **proof** | 3열, 테두리로만 구분, 번호(mono) 상단 + 제목·본문 하단. 텍스트 스타일은 path 카드와 동일 |

### 입력 (waitlist)

```
높이 52px · 좌측 아이콘 46px 패딩 · 테두리 line-dark
포커스: 배경 흰색 6% + 민트 테두리 70% + box-shadow 0 0 16px rgb(0 237 213 / 0.18)
에러: inputInvalid + fieldError(12px) + invalidNudge 흔들림
```

### 표 (리더보드)

```
th: 600 10px/13px meta, uppercase, .08em, 하단 테두리
td: padding 19px 22px, 하단 테두리 ink 10%
행 호버: mint-pale
내 행: currentRow(민트 10% 배경) + rankCell(민트 숫자) + youBadge(민트 채움 배지)
```

### 지갑 카드 (waitlist·헤더)

```
게이트: radial-gradient(circle at 100% 0, #00edd51a, transparent 42%) + #ffffff06
        원형 아이콘 46px + 민트 글로우, pill Connect 버튼(화살표 absolute right 18px)
연결됨: 민트 테두리 + gradient, 2열 그리드(gap 1px + 배경으로 1px 라인 효과)
헤더 칩: pill, 민트 점 + 주소(mono 12px) + ▼, 클릭 시 팝오버(278px)
```

---

## 6. 모션

### 토큰

| 토큰 | 값 | 용도 |
|---|---|---|
| `--lv-ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | 기본 이징 |
| `--lv-ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 튕기는 등장 |
| `--lv-motion-fast` | `180ms` | 색·테두리 전환 |
| `--lv-motion-medium` | `360ms` | 패널 등장, 그림자 |
| `--lv-motion-press` | `110ms` | 누름 피드백 |
| `--lv-motion-slow` | `700ms` | 큰 요소 전환 |

`prefers-reduced-motion: reduce`에서 **네 duration이 모두 0ms가 되고**, 무한 루프 애니메이션은
개별 규칙으로 정지/숨김 처리된다. 새 모션을 넣을 때 이 대응을 빠뜨리지 않는다.

### keyframes 카탈로그

| 파일 | 애니메이션 |
|---|---|
| `home.module.css` | `flagWave`(깃발 2.6s) `trailReveal`(화살표 그려짐 3.6s) `coinBob`(코인 2.2s) · `drawChart` `chartPoint` `bookDepth`(터미널) · `statusPulse`(라벨 점 2s) `glowBreath`(히어로 글로우 7s) `heroCopyIn` `sectionReveal` `payout-flow` |
| `waitlist.module.css` | `lineSpread`(배경 라인 5그룹 13.5s 루프) · `tickDraw`(모달 체크) `modalReveal` `overlayReveal` `panelReveal` · `copiedPop` `feedbackReveal` `invalidNudge` `leaderboardShimmer` |
| `coming-soon.module.css` | `lineReveal`(h1 두 줄 순차) `consoleReveal` `glowBreath` `statusPulse` |
| `public-layout.module.css` | `menuReveal`(지갑 팝오버) |

### waitlist 히어로 배경 라인 — 앵커 구조 (중요)

5개 그룹이 순차로 "기존 라인에서 펼쳐졌다 복귀"한다. 총 **13.5s 루프**, 그룹당 펼침 0.6s(ease-out)
→ 유지 0.5s → 복귀 0.6s(ease-in), 그룹 간 1s.

**근사 % 값이 아니다.** 그룹 1·4·5는 `.benefits`(가로 디바이더 호스트), 그룹 2·3은
`.heroGrid`(세로 디바이더 = 우측 428px)에 앵커하고 라인을 길게 뻗은 뒤 히어로 `overflow: hidden`으로
잘라, 끝점이 항상 다른 라인과 정확히 맞물린다. 구조를 바꿀 때 이 관계를 유지해야 한다.

---

## 7. 아이콘 · 에셋 규칙

| 대상 | 규칙 |
|---|---|
| icons8 PNG (waitlist 벤핏·메달) | **CSS mask로 민트 단색화** — `mask: url(...) center/contain no-repeat; background: var(--lv-mint)` |
| path 카드 아이콘 3종 | PNG를 potrace로 벡터화한 SVG. 부위별로 클래스를 나눠 모션을 건다(`flagCloth` `trailPath` `coinGroup`) |
| Partners 로고 | **알파 bbox에 타이트 크롭**돼 있어 CSS `height`가 곧 잉크 높이다. 교체 시 같은 방식으로 크롭해야 정렬이 유지된다 |
| 최종 CTA 콘 | 꼭지점이 이미지 하단에 딱 맞게 크롭돼 있다. 섹션 490px + `top 34px` / 457px 조합이 꼭지점을 섹션 하단에 맞물리게 한다 |
| 히어로 콘 | SVG(`HeroConeGraphic`) 545×541, 링·점이 rAF로 움직인다 |

---

## 8. 건드리면 깨지는 실측 상수

디자인 시안에서 픽셀로 재서 넣은 값이다. 임의로 바꾸면 정렬이 무너진다.

| 값 | 이유 |
|---|---|
| 히어로 `calc(100svh - 118px)` | 헤더(74px, fixed)가 겹치고 facts(118px)를 뺀 값 → 히어로 + facts가 첫 화면에 맞물린다 |
| 최종 CTA 490px | 콘 그래픽 꼭지점이 섹션 하단에 닿는 높이 |
| path 카드 320 / 356 / 392px | 계단식 리듬 |
| Partners 로고 46 / 33 / 36px, 간격 60px | 로고별 시각 무게를 맞춘 값. Hyperliquid만 `translateY(3px)`(x-height 광학 정렬) |
| 리드문 간격 24px | 전 섹션 통일. 배치 방식별로 margin 값이 달라야 같은 결과가 나온다 |
| waitlist 히어로 우측 컬럼 428px | 세로 디바이더 위치 = 라인 모션 앵커 |

---

## 9. 새 화면을 만들 때

1. **토큰만 쓴다.** 새 색·간격이 필요하면 먼저 토큰에 추가할지 검토한다.
2. **배경을 정하고 그에 맞는 텍스트 색 세트를 쓴다**(§1 사용 규칙).
3. 섹션 헤드는 §4 패턴을 따르고, **간격은 렌더에서 픽셀을 재서** 24px에 맞춘다.
4. 수치는 mono + `tabular-nums`, 메타 라벨은 uppercase + 자간.
5. 카드는 radius 0, 버튼·칩은 999px.
6. 모션을 넣으면 `prefers-reduced-motion` 대응을 함께 넣는다.
7. 1100 / 760px 두 브레이크포인트를 확인한다. 모바일에서 데스크톱용 고정 높이·flex 정렬이
   남아 있으면 콘텐츠가 잘린다(실제 발생 사례).
