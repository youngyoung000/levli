"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/* ╔══════════════════════════════════════════════════════════════════════╗
   ║  DEMO ONLY — 이 파일 하나만 교체하면 된다                              ║
   ╚══════════════════════════════════════════════════════════════════════╝
   실제 서비스는 EVM 지갑 연결 + SIWE 서명 → 서버 세션이다.
   이 저장소는 디자인 전달용이라 지갑 SDK 없이 상태 전이만 재현한다.

   교체 방법: 아래 인터페이스만 유지하고 내부를 wagmi/viem + /auth/wallet/*
   호출로 바꾼다. UI(LandingWalletLogin, WalletGate, WalletIdentity)는 이 값만
   소비하므로 수정이 필요 없다.

     session: { address, walletName } | null
     status : "disconnected" | "connecting" | "signing" | "authenticated"
     connect() / disconnect()

   applyDemoSession()은 디자인 검토용 진입점이므로 실서비스에서는 제거한다. */

const WALLET_KEY = "levli.wallet.session";
const DEMO_ADDRESS = "0x8F3c72a1B49e5C7d0aD24f6E1b9C83aE7f21D40b";

export type WalletSession = {
  address: string;
  walletName: string;
};

export type WalletStatus = "disconnected" | "connecting" | "signing" | "authenticated";

type WalletAuth = {
  session: WalletSession | null;
  status: WalletStatus;
  connect: () => void;
  disconnect: () => void;
};

const WalletAuthContext = createContext<WalletAuth | null>(null);

export function shortAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function WalletAuthProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [session, setSession] = useState<WalletSession | null>(null);
  const [status, setStatus] = useState<WalletStatus>("disconnected");

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(WALLET_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as WalletSession;
      if (parsed && typeof parsed.address === "string") {
        setSession(parsed);
        setStatus("authenticated");
      }
    } catch {
      /* 저장소 접근 실패는 무시 */
    }
  }, []);

  /* connecting → signing → authenticated 단계만 재현 (실제 서명 없음) */
  const connect = useCallback(() => {
    setStatus("connecting");
    window.setTimeout(() => setStatus("signing"), 600);
    window.setTimeout(() => {
      const next: WalletSession = { address: DEMO_ADDRESS, walletName: "Demo Wallet" };
      try {
        window.sessionStorage.setItem(WALLET_KEY, JSON.stringify(next));
      } catch {
        /* 무시 */
      }
      setSession(next);
      setStatus("authenticated");
    }, 1400);
  }, []);

  const disconnect = useCallback(() => {
    try {
      window.sessionStorage.removeItem(WALLET_KEY);
    } catch {
      /* 무시 */
    }
    setSession(null);
    setStatus("disconnected");
  }, []);

  /* 디자인 검토용: waitlist의 ?demo= 파라미터가 세션을 강제로 주입할 수 있게 한다 */
  const applyDemoSession = useCallback(() => {
    setSession({ address: DEMO_ADDRESS, walletName: "Demo Wallet" });
    setStatus("authenticated");
  }, []);

  const value = useMemo<WalletAuth & { applyDemoSession: () => void }>(
    () => ({ session, status, connect, disconnect, applyDemoSession }),
    [session, status, connect, disconnect, applyDemoSession],
  );

  return <WalletAuthContext.Provider value={value}>{children}</WalletAuthContext.Provider>;
}

export function useWalletAuth(): WalletAuth & { applyDemoSession: () => void } {
  const context = useContext(WalletAuthContext);
  if (!context) throw new Error("useWalletAuth must be used inside WalletAuthProvider.");
  return context as WalletAuth & { applyDemoSession: () => void };
}
