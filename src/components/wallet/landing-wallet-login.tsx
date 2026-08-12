"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../app/(public)/public-layout.module.css";
import { shortAddress, useWalletAuth } from "./wallet-auth";

/* 헤더/모바일 메뉴의 지갑 진입점 — 개발 버전 구조를 그대로 따른다.
   미연결이면 Log In 버튼, 연결되면 주소 칩 + 팝오버(주소 복사 / 연결 해제). */
export function LandingWalletLogin({ mobile = false }: { mobile?: boolean }): React.JSX.Element {
  const router = useRouter();
  const auth = useWalletAuth();
  const requestedRef = useRef(false);
  const menuRef = useRef<HTMLDetailsElement>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [copied, setCopied] = useState(false);
  const busy = auth.status === "connecting" || auth.status === "signing";

  /* 헤더에서 연결을 시작한 경우에만 waitlist로 이동 */
  useEffect(() => {
    if (requestedRef.current && auth.session) {
      requestedRef.current = false;
      router.push("/waitlist");
    }
  }, [auth.session, router]);

  /* 바깥 클릭·Esc로 팝오버 닫기 */
  useEffect(() => {
    const onPointerDown = (event: PointerEvent): void => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        menuRef.current.removeAttribute("open");
      }
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") menuRef.current?.removeAttribute("open");
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const copyAddress = (): void => {
    if (!auth.session) return;
    void navigator.clipboard?.writeText(auth.session.address);
    setCopied(true);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(false), 1600);
  };

  if (auth.session) {
    return (
      <div className={`${styles.walletLoginAction} ${mobile ? styles.mobileWalletAction : ""}`}>
        <details className={styles.walletMenu} ref={menuRef}>
          <summary className={`${styles.walletMenuSummary} ${mobile ? styles.mobileWalletSummary : ""}`}>
            <span aria-hidden="true" className={styles.walletStatusDot} />
            <span className={styles.walletAddress}>{shortAddress(auth.session.address)}</span>
            <svg aria-hidden="true" fill="none" viewBox="0 0 12 8">
              <path d="m1 1.5 5 5 5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </summary>
          <div className={styles.walletPopover}>
            <div className={styles.walletPopoverHeader}>
              <span><i /> Wallet connected</span>
              <small>Arbitrum One</small>
            </div>
            <div className={styles.walletIdentity}>
              <span>Wallet</span>
              <strong title={auth.session.address}>{shortAddress(auth.session.address)}</strong>
              <small>{auth.session.walletName}</small>
            </div>
            <div className={styles.walletMenuActions}>
              <button onClick={copyAddress} type="button">{copied ? "Copied" : "Copy address"}</button>
              <button
                onClick={() => {
                  auth.disconnect();
                  menuRef.current?.removeAttribute("open");
                }}
                type="button"
              >
                Disconnect
              </button>
            </div>
          </div>
        </details>
      </div>
    );
  }

  return (
    <div className={`${styles.walletLoginAction} ${mobile ? styles.mobileWalletLogin : ""}`}>
      <button
        aria-busy={busy}
        className={styles.loginLink}
        disabled={busy}
        onClick={() => {
          requestedRef.current = true;
          auth.connect();
        }}
        type="button"
      >
        {busy ? "Connecting..." : "Log In"}
      </button>
    </div>
  );
}
