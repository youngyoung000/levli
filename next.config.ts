import type { NextConfig } from "next";

/**
 * - 폰트: WattVision 디자인 시스템 채택(2026-07-10, 사용자 지시)으로 next/font/google
 *   (Inter·JetBrains Mono) 사용 — 빌드 타임에 1회 다운로드 후 셀프호스팅되므로 런타임
 *   원격 요청은 없다(구 "원격 리소스 금지" 지시는 런타임 기준으로 유지).
 * - webpack externals: wagmi→WalletConnect→pino의 optional deps(pino-pretty 등)가
 *   미설치 상태로 해석 시도되면 dev 핫리컴파일에서 클라이언트 번들이 조용히 깨져
 *   페이지가 백지(hidden Suspense shell)로 남는다 — 번들에서 제외해 차단.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 외부 공유 모드(scripts/share.sh): Cloudflare quick tunnel 도메인에서 dev 에셋(/_next/*)
  // 요청이 들어오면 Next 15가 cross-origin으로 차단하므로 명시 허용(dev 서버 전용 옵션).
  allowedDevOrigins: ["*.trycloudflare.com"],
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding", "@react-native-async-storage/async-storage");
    return config;
  },
};

export default nextConfig;
