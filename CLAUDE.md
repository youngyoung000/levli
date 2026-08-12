# Levli 랜딩 — 작업 규칙

**먼저 [`AGENTS.md`](./AGENTS.md)를 읽어라.** 디자인 규칙은 [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)에 있다. 이 저장소를 실서비스 코드에 반영하는 순서,
파일별 처리 방법(그대로 덮어쓸 CSS 4개 / 구조·카피만 반영할 마크업 4개),
제거해야 할 DEMO ONLY 코드, 사람에게 확인해야 할 항목이 모두 그 문서에 있다.

핵심만 요약하면:

- 이 저장소는 **디자인 확정본**이다. 지갑 서명·서버 API·실데이터는 없다.
- 색·간격·폰트는 `src/styles/landing-tokens.css`의 `--lv-*` 토큰만 쓴다. 하드코딩 금지.
- `src/components/wallet/wallet-auth.tsx`는 목 구현이다. 인터페이스를 유지하고 내부만 교체한다.
- waitlist의 `?demo=` · `?lb=ranked` · 목데이터 273명 · 페이지네이션은 검토용이다. 실연동 시 제거.
- 간격을 조정할 때는 **렌더에서 픽셀을 재라**. 같은 `margin`이 flow / flex / absolute에서 다르게 나온다.
- 히어로 높이 `calc(100svh - 118px)`, 최종 CTA 섹션 490px, 로고 PNG의 타이트 크롭은
  의도된 값이다. 바꾸면 정렬이 깨진다(AGENTS.md §4).

설명·주석은 한국어, UI 라벨·코드 식별자는 영어.
