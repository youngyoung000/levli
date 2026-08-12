"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LevliSymbol } from "../../../components/brand/levli-logo";
import { shortAddress, useWalletAuth, type WalletSession, type WalletStatus } from "../../../components/wallet/wallet-auth";
import styles from "./waitlist.module.css";

/* ╔══════════════════════════════════════════════════════════════════════╗
   ║  이 파일의 DEMO ONLY 장치 — 실서비스 반영 시 제거/교체 대상             ║
   ╚══════════════════════════════════════════════════════════════════════╝
   1) STORAGE_KEY(localStorage) 등록 상태     → 서버 등록 API 응답으로 교체
   2) generateReferralCode()                  → 서버 발급 코드로 교체
   3) ?demo=wallet | joined (demoState)       → 제거 (분기 확인용 링크)
   4) ?lb=ranked (rankedBoard) + LEADERBOARD_ROWS 273명 + 페이지네이션
                                              → 실데이터 연동 시 제거
   5) WAITLIST_TOTAL / ACTIVE_REFERRERS / RANKED_WAITLISTERS 상수
                                              → 서버 집계값으로 교체
   6) YOU_RANK(6위 고정)                      → 실제 내 순위로 교체

   위를 제외한 마크업·클래스·카피는 그대로 사용할 수 있다. */
const STORAGE_KEY = "levli.waitlist.entry";
const SHARE_SLOGAN = "Prove your skill. Trade with size.";
const X_ACCOUNT = "@Levli_Official";
const CHAIN_LABEL = "Arbitrum One";
const CHAIN_ID = 42161;

type WaitlistEntry = {
  xHandle: string;
  wallet: string;
  referredBy: string | null;
  code: string;
  status: string;
  joinedAt: string;
};

type FieldErrors = Partial<Record<"xHandle" | "referral", string>>;

/* 핸들+지갑 시드로 결정적 코드 생성 — 서버 발급으로 교체 예정 */
function generateReferralCode(seed: string): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  let code = "";
  for (let index = 0; index < 5; index += 1) {
    code += alphabet[hash % alphabet.length];
    hash = Math.floor(hash / alphabet.length);
    if (hash === 0) hash = Math.imul(seed.length + index + 1, 2654435761) >>> 0;
  }
  return `LEVLI-${code}`;
}

function readStoredEntry(): WaitlistEntry | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WaitlistEntry;
    return parsed && typeof parsed.code === "string" ? parsed : null;
  } catch {
    return null;
  }
}

/* 리더보드 기본값 — 개발 버전은 실데이터 연동이며 현재 등록자가 4명뿐이라 비어 있다 */
const WAITLIST_TOTAL = 4;
const ACTIVE_REFERRERS = 0;

/* 데이터가 찬 상태(디자인 검토용, `?lb=ranked`) — 결정적 생성이라 하이드레이션 안전 */
const LB_PAGE_SIZE = 50;
const LB_TOTAL = 273;
const LB_LETTERS = "abcdefghijklmnopqrstuvwxyz";
const YOU_RANK = 6;

const LEADERBOARD_ROWS = Array.from({ length: LB_TOTAL }, (_, index) => {
  const jitter = ((index * 2654435761) >>> 16) % 9;
  const invites = Math.max(1, Math.floor(260 * Math.exp(-index / 55)) + (8 - jitter));
  const a = LB_LETTERS[(index * 7) % 26];
  const b = LB_LETTERS[(index * 13 + 3) % 26];
  const c = LB_LETTERS[(index * 19 + 11) % 26];
  return { referrer: `@${a}•••••${b}${c}`, invites };
})
  .sort((x, y) => y.invites - x.invites)
  .map((row, index) => ({
    rank: index + 1,
    referrer: row.referrer,
    invites: row.invites,
  }));

const LB_PAGE_COUNT = Math.ceil(LB_TOTAL / LB_PAGE_SIZE);
const RANKED_WAITLISTERS = 1284;

/* 페이지 번호 목록: 1 2 3 4 … N 패턴 (현재 페이지 위치에 따라 창 이동) */
function buildPageItems(current: number, total: number): Array<number | "gap"> {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, "gap", total];
  if (current >= total - 2) return [1, "gap", total - 3, total - 2, total - 1, total];
  return [1, "gap", current - 1, current, current + 1, "gap", total];
}

const HOW_IT_WORKS = [
  { index: "01", title: "Join once", body: "Join with your wallet and X account. Each person can join once." },
  { index: "02", title: "Share your link", body: "Every verified signup through your link adds one invite." },
  {
    index: "03",
    title: "Earn Points and USDC",
    body: "Verified invites become Levli Points and USDC referral commission when the service opens.",
  },
] as const;

function XGlyph(): React.JSX.Element {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.9 3H21l-6.8 7.8L22.2 21h-6.3l-4.9-6.4L5.4 21H2.2l7.3-8.3L2 3h6.4l4.4 5.9L17.9 3Zm-1.1 16.2h1.7L7.6 4.7H5.8l11 14.5Z" />
    </svg>
  );
}

/* 혜택/랭킹 아이콘은 제공된 PNG(공용 /icons)를 CSS mask로 민트 단색화해 사용 */

function WalletGlyph(): React.JSX.Element {
  return (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
      <rect height="13" rx="2" width="18" x="3" y="6.5" />
      <path d="M3 10.5h18M16.5 15.5h1.5" />
    </svg>
  );
}

function TagGlyph(): React.JSX.Element {
  return (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M3.5 10.5v-7h7l10 10-7 7-10-10Z" />
      <circle cx="8" cy="8" fill="currentColor" r="1" stroke="none" />
    </svg>
  );
}

function ShieldGlyph(): React.JSX.Element {
  return (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" viewBox="0 0 24 24">
      <path d="M12 3l7 2.8v5.4c0 4.4-3 7.4-7 8.8-4-1.4-7-4.4-7-8.8V5.8L12 3Z" />
      <path d="m9 11.6 2.1 2.1L15.3 9.5" />
    </svg>
  );
}

/* 틱박스 아이콘 (icons8 tick-box 형태) — 모달 오픈 시 스트로크 드로잉 애니메이션 */
function TickBoxGlyph(): React.JSX.Element {
  return (
    <svg aria-hidden="true" className={styles.tickBox} fill="none" viewBox="0 0 48 48">
      <rect className={styles.tickBoxRect} height="34" rx="8" stroke="currentColor" strokeWidth="2.4" width="34" x="7" y="7" />
      <path
        className={styles.tickBoxCheck}
        d="M16 24.5 23 31.5 40 10.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
      />
    </svg>
  );
}

/* 지갑 게이트 — 개발 버전의 WalletLoginPanel(지갑 연결 + 서명) UI.
   실제 지갑 SDK 대신 디자인 확인용 목 동작으로 연결된다. */
function WalletGate({
  status,
  onConnect,
}: {
  status: WalletStatus;
  onConnect: () => void;
}): React.JSX.Element {
  const busy = status === "connecting" || status === "signing";
  const label =
    status === "connecting"
      ? "Choose a wallet..."
      : status === "signing"
        ? "Check your wallet to sign..."
        : "Connect Wallet";

  return (
    <div className={styles.walletGate}>
      <div className={styles.walletNetworkRow}>
        <span><i /> {CHAIN_LABEL}</span>
        <small>Chain ID {CHAIN_ID}</small>
      </div>
      <div className={styles.walletGateIcon}><WalletGlyph /></div>
      <h3>Sign up to join</h3>
      <p>
        Choose an installed EVM wallet and sign a one-time message before completing your
        Waitlist profile.
      </p>
      <div className={styles.walletOptions}>
        <button
          aria-busy={busy}
          className={styles.walletConnectButton}
          disabled={busy}
          onClick={onConnect}
          type="button"
        >
          <WalletGlyph />
          <span>{label}</span>
          <b aria-hidden="true">→</b>
        </button>
      </div>
      <p className={styles.walletDisclosure}>
        Signing is free. It does not submit a transaction or request access to your funds.
      </p>
    </div>
  );
}

/* 연결된 지갑 요약 카드 — 등록 전/후 모두 폼 패널 상단에 노출된다 */
function WalletIdentity({
  entry,
  onDisconnect,
  session,
}: {
  entry: WaitlistEntry | null;
  onDisconnect: () => void;
  session: WalletSession;
}): React.JSX.Element {
  const joined = entry
    ? new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(
        new Date(entry.joinedAt),
      )
    : null;

  return (
    <div className={styles.walletIdentity}>
      <div className={styles.walletIdentityHead}>
        <span><i /> Wallet verified</span>
        <button onClick={onDisconnect} type="button">Disconnect</button>
      </div>
      <div className={styles.walletIdentityGrid}>
        <div>
          <small>Wallet</small>
          <strong title={session.address}>{shortAddress(session.address)}</strong>
          <em>{session.walletName}</em>
        </div>
        <div>
          <small>Network</small>
          <strong>{CHAIN_LABEL}</strong>
          <em>Chain ID {CHAIN_ID}</em>
        </div>
        <div>
          <small>Waitlist</small>
          <strong className={entry ? styles.statusRegistered : undefined}>
            {entry ? "Registered" : "Not registered"}
          </strong>
          <em>{entry ? entry.status : "Complete your profile below"}</em>
        </div>
        {entry && (
          <div>
            <small>Joined</small>
            <strong>{joined}</strong>
            <em>@{entry.xHandle}</em>
          </div>
        )}
      </div>
    </div>
  );
}

function ReferralShare({
  entry,
  onCopy,
  copied,
  shareUrl,
}: {
  entry: WaitlistEntry;
  onCopy: (target: "code" | "link") => void;
  copied: "code" | "link" | null;
  shareUrl: string;
}): React.JSX.Element {
  const shareText = `${SHARE_SLOGAN} I'm on the ${X_ACCOUNT} waitlist. Join me: ${shareUrl}`;
  const intentUrl = `https://x.com/intent/post?text=${encodeURIComponent(shareText)}`;

  return (
    <>
      <div className={styles.codePlate}>
        <span className={styles.codeLabel}>Your referral code</span>
        <div className={styles.codeRow}>
          <span className={styles.codeValue}>{entry.code}</span>
          <button
            className={`${styles.copyButton} ${copied === "code" ? styles.copied : ""}`}
            onClick={() => onCopy("code")}
            type="button"
          >
            {copied === "code" ? "Copied" : "Copy"}
          </button>
        </div>
        <div className={styles.linkRow}>
          <span className={styles.linkValue}><span>{shareUrl}</span></span>
          <button
            className={`${styles.copyButton} ${copied === "link" ? styles.copied : ""}`}
            onClick={() => onCopy("link")}
            type="button"
          >
            {copied === "link" ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <a className={styles.shareButton} href={intentUrl} rel="noreferrer" target="_blank">
        <XGlyph /> Share on X
      </a>
    </>
  );
}

export function WaitlistExperience(): React.JSX.Element {
  const searchParams = useSearchParams();
  const refParam = searchParams.get("ref");
  /* 디자인 검토용: ?demo=wallet(지갑 연결됨) / ?demo=joined(등록 완료)로 분기를 바로 확인한다.
     저장소를 건드리지 않으므로 파라미터를 빼면 원래 상태로 돌아온다. 서버 연동 시 제거. */
  const demoState = searchParams.get("demo");
  /* 리더보드 데이터 상태는 가입 분기와 독립적으로 켠다 (`?lb=ranked`) */
  const rankedBoard = searchParams.get("lb") === "ranked";

  const [xHandle, setXHandle] = useState("");
  const [referral, setReferral] = useState("");
  const [refApplied, setRefApplied] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [entry, setEntry] = useState<WaitlistEntry | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const [lbPage, setLbPage] = useState(1);
  const [origin, setOrigin] = useState("https://levli.com");
  const auth = useWalletAuth();
  const wallet = auth.session;
  const walletStatus = auth.status;

  const modalCloseRef = useRef<HTMLButtonElement>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setEntry(readStoredEntry());
    setOrigin(window.location.origin);
  }, []);

  /* 데모 분기 강제 (저장하지 않음) */
  useEffect(() => {
    if (demoState !== "wallet" && demoState !== "joined") return;
    auth.applyDemoSession();
    if (demoState === "joined") {
      const address = "0x8F3c72a1B49e5C7d0aD24f6E1b9C83aE7f21D40b";
      setEntry({
        xHandle: "levlitrader",
        wallet: address,
        referredBy: null,
        code: generateReferralCode(`levlitrader:${address}`),
        status: "CONVERTED",
        joinedAt: "2026-08-11T09:00:00.000Z",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoState]);

  /* URL ?ref=CODE 감지 → 레퍼럴 코드 자동 입력 */
  useEffect(() => {
    if (refParam && refParam.trim()) {
      setReferral(refParam.trim().toUpperCase());
      setRefApplied(true);
    }
  }, [refParam]);

  /* 모달 열림: 포커스 이동 + 배경 스크롤 잠금 + Esc 닫기 */
  useEffect(() => {
    if (!modalOpen) return;
    modalCloseRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") setModalOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [modalOpen]);

  /* YOU 행의 초대 수와 스탯의 Your invites를 같은 값으로 맞춘다 */
  const youInvites = LEADERBOARD_ROWS[YOU_RANK - 1]?.invites ?? 0;

  const shareUrl = useMemo(
    () => (entry ? `${origin}/waitlist?ref=${entry.code}` : ""),
    [entry, origin],
  );

  const handleCopy = useCallback(
    (target: "code" | "link") => {
      if (!entry) return;
      const value = target === "code" ? entry.code : shareUrl;
      void navigator.clipboard?.writeText(value);
      setCopied(target);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(null), 2000);
    },
    [entry, shareUrl],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!wallet) return;

    const normalizedHandle = xHandle.trim().replace(/^@/, "");
    const normalizedReferral = referral.trim().toUpperCase();

    const nextErrors: FieldErrors = {};
    if (!/^[A-Za-z0-9_]{1,15}$/.test(normalizedHandle)) {
      nextErrors.xHandle = "Enter a valid X handle, letters, numbers and underscores only.";
    }
    if (normalizedReferral && !/^LEVLI-[A-Z0-9]{5}$/.test(normalizedReferral)) {
      nextErrors.referral = "Referral codes look like LEVLI-XXXXX.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const newEntry: WaitlistEntry = {
      xHandle: normalizedHandle,
      wallet: wallet.address,
      referredBy: normalizedReferral || null,
      code: generateReferralCode(`${normalizedHandle}:${wallet.address}`),
      status: "CONVERTED",
      joinedAt: new Date().toISOString(),
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntry));
    } catch {
      /* 프라이빗 모드 등 저장 실패는 무시 — 세션 내 상태로만 유지 */
    }
    setEntry(newEntry);
    setModalOpen(true);
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          {/* 배경 라인 모션(그룹 2·3): 그리드 우측 컬럼(=세로 디바이더 실제 위치)에 앵커 */}
          <span aria-hidden="true" className={`${styles.lineGroup} ${styles.lgBottomLeft}`}><i /><i /><i /><i /><i /><i /></span>
          <span aria-hidden="true" className={`${styles.lineGroup} ${styles.lgTopRight}`}><i /><i /><i /><i /><i /><i /></span>
          <div className={styles.heroCopy}>
            <span className={styles.badge}>Onchain Prop Trading</span>
            <h1>
              <span>Join the</span>
              <strong>Levli <em>Waitlist</em></strong>
            </h1>
            <p className={styles.heroLead}>
              Get early access to the $10K Free Trial<br />
              and experience Levli&apos;s onchain prop trading platform.
            </p>
            <div className={styles.benefits}>
              {/* 라인 모션 그룹 1·4·5 — 가로 디바이더(벤핏 상단)·세로 디바이더에 정확히 맞물리도록 여기에 앵커 */}
              <span aria-hidden="true" className={`${styles.lineGroup} ${styles.lgTopCenter}`}><i /><i /><i /><i /><i /><i /></span>
              <span aria-hidden="true" className={`${styles.lineGroup} ${styles.lgBottomCenter}`}><i /><i /><i /><i /><i /><i /></span>
              <span aria-hidden="true" className={`${styles.lineGroup} ${styles.lgMidLeft}`}><i /><i /><i /><i /><i /><i /></span>
              <div className={styles.benefit}>
                <i aria-hidden="true" className={`${styles.benefitIcon} ${styles.icoGift}`} />
                <div>
                  <strong>$10K</strong>
                  <span>Free Trial</span>
                </div>
              </div>
              <div className={styles.benefit}>
                <i aria-hidden="true" className={`${styles.benefitIcon} ${styles.icoCash}`} />
                <div>
                  <em>Up to</em>
                  <strong>$50K</strong>
                  <span>Challenge</span>
                </div>
              </div>
              <div className={styles.benefit}>
                <i aria-hidden="true" className={`${styles.benefitIcon} ${styles.icoBag}`} />
                <div>
                  <em>Up to</em>
                  <strong>90%</strong>
                  <span>Profit Split</span>
                </div>
              </div>
            </div>
          </div>

          {entry ? (
            <div className={`${styles.formPanel} ${styles.joinedPanel}`}>
              <h2>You&apos;re on the waitlist</h2>
              {wallet && (
                <WalletIdentity entry={entry} onDisconnect={auth.disconnect} session={wallet} />
              )}
              <p>Your registration is confirmed on Levli&apos;s Waitlist server.</p>
              <ReferralShare copied={copied} entry={entry} onCopy={handleCopy} shareUrl={shareUrl} />
            </div>
          ) : (
            <form className={styles.formPanel} noValidate onSubmit={handleSubmit}>
              <h2>Secure your spot</h2>
              {wallet ? (
                <>
                  <WalletIdentity entry={null} onDisconnect={auth.disconnect} session={wallet} />

                  <div className={styles.fieldGroup}>
                    <label className={styles.srOnly} htmlFor="waitlist-x">X handle</label>
                    <div className={styles.inputWrap}>
                      <span aria-hidden="true" className={styles.inputIcon}><XGlyph /></span>
                      <input
                        aria-describedby={errors.xHandle ? "waitlist-x-error" : undefined}
                        aria-invalid={Boolean(errors.xHandle)}
                        autoComplete="off"
                        className={`${styles.textInput} ${errors.xHandle ? styles.inputInvalid : ""}`}
                        id="waitlist-x"
                        onChange={(event) => setXHandle(event.target.value)}
                        placeholder="X Handle"
                        type="text"
                        value={xHandle}
                      />
                    </div>
                    {errors.xHandle && (
                      <p className={styles.fieldError} id="waitlist-x-error">{errors.xHandle}</p>
                    )}
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.srOnly} htmlFor="waitlist-referral">Referral code (optional)</label>
                    <div className={styles.inputWrap}>
                      <span aria-hidden="true" className={styles.inputIcon}><TagGlyph /></span>
                      <input
                        aria-describedby={errors.referral ? "waitlist-referral-error" : undefined}
                        aria-invalid={Boolean(errors.referral)}
                        autoComplete="off"
                        className={`${styles.textInput} ${errors.referral ? styles.inputInvalid : ""}`}
                        id="waitlist-referral"
                        onChange={(event) => {
                          setReferral(event.target.value);
                          setRefApplied(false);
                        }}
                        placeholder="Referral Code (Optional)"
                        spellCheck={false}
                        type="text"
                        value={referral}
                      />
                    </div>
                    {refApplied && !errors.referral && <p className={styles.refNotice}>Referral code applied</p>}
                    {errors.referral && (
                      <p className={styles.fieldError} id="waitlist-referral-error">{errors.referral}</p>
                    )}
                  </div>

                  <button className={styles.submitButton} type="submit">
                    <LevliSymbol className={styles.submitMark} />
                    Join Waitlist
                    <span aria-hidden="true" className={styles.submitArrow}>→</span>
                  </button>
                  <p className={styles.formFoot}>
                    <ShieldGlyph /> Verified wallet · server-confirmed registration.
                  </p>
                </>
              ) : (
                <WalletGate onConnect={auth.connect} status={walletStatus} />
              )}
            </form>
          )}
        </div>
      </section>

      <section aria-labelledby="waitlist-leaderboard-title" className={styles.leaderboard}>
        <div className={styles.lbHead}>
          <div className={styles.lbIntro}>
            <h2 id="waitlist-leaderboard-title">Invite. Share. Move up.</h2>
            <p>
              See the most active Waitlist referrers.<br />
              Verified invites earn Levli Points and USDC commission at launch.
            </p>
          </div>
          <div className={styles.lbStats}>
            <div className={styles.statCell}>
              <span>Waitlisters</span>
              <strong>{rankedBoard ? RANKED_WAITLISTERS.toLocaleString("en-US") : WAITLIST_TOTAL}</strong>
            </div>
            <div className={styles.statCell}>
              <span>Active referrers</span>
              <strong>{rankedBoard ? LB_TOTAL.toLocaleString("en-US") : ACTIVE_REFERRERS}</strong>
            </div>
            <div className={styles.statCell}>
              <span>Your invites</span>
              <strong>{entry ? (rankedBoard ? youInvites.toLocaleString("en-US") : "0") : "—"}</strong>
            </div>
          </div>
        </div>

        <div className={styles.lbLayout}>
          <div className={styles.lbTableCol}>
            <div className={styles.lbTableWrap}>
              <table className={styles.lbTable}>
                <thead>
                  <tr>
                    <th className={styles.rankHeading} scope="col">Rank</th>
                    <th scope="col">Referrer</th>
                    <th className={styles.inviteHeading} scope="col">Waitlist invites</th>
                  </tr>
                </thead>
                <tbody>
                  {rankedBoard ? (
                    LEADERBOARD_ROWS.slice((lbPage - 1) * LB_PAGE_SIZE, lbPage * LB_PAGE_SIZE).map((row) => {
                      /* 데모: 등록 시 6위 자리에 본인 행을 인라인 표시 (서버 연동 시 실순위로 대체) */
                      const isYou = Boolean(entry) && lbPage === 1 && row.rank === YOU_RANK;
                      return (
                        <tr className={isYou ? styles.currentRow : undefined} key={row.rank}>
                          <td className={styles.rankCell}>{row.rank}</td>
                          <td className={styles.tdTrader}>
                            <span className={styles.waitlistHandle}>
                              {isYou && entry ? `@${entry.xHandle}` : row.referrer}
                              {isYou && <span className={styles.youBadge}>You</span>}
                            </span>
                          </td>
                          <td className={styles.inviteCell}>{row.invites.toLocaleString("en-US")}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className={styles.emptyRow}>
                      <td colSpan={3}>
                        No ranked invites yet. Join the Waitlist and share your personal link to start.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {rankedBoard && (
              <nav aria-label="Leaderboard pages" className={styles.pagination}>
                <button
                  aria-label="Previous page"
                  className={styles.pageArrow}
                  disabled={lbPage === 1}
                  onClick={() => setLbPage(Math.max(1, lbPage - 1))}
                  type="button"
                >
                  <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="m14.5 6.5-5.5 5.5 5.5 5.5" />
                  </svg>
                </button>
                {buildPageItems(lbPage, LB_PAGE_COUNT).map((item, index) =>
                  item === "gap" ? (
                    <span aria-hidden="true" className={styles.pageGap} key={`gap-${index}`}>…</span>
                  ) : (
                    <button
                      aria-current={item === lbPage ? "page" : undefined}
                      className={`${styles.pageNum} ${item === lbPage ? styles.pageNumActive : ""}`}
                      key={item}
                      onClick={() => setLbPage(item)}
                      type="button"
                    >
                      {item}
                    </button>
                  ),
                )}
                <button
                  aria-label="Next page"
                  className={styles.pageArrow}
                  disabled={lbPage === LB_PAGE_COUNT}
                  onClick={() => setLbPage(Math.min(LB_PAGE_COUNT, lbPage + 1))}
                  type="button"
                >
                  <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="m9.5 6.5 5.5 5.5-5.5 5.5" />
                  </svg>
                </button>
              </nav>
            )}
          </div>

          <aside className={styles.howPanel}>
            <h3>How it works</h3>
            <ol className={styles.howList}>
              {HOW_IT_WORKS.map((step) => (
                <li key={step.index}>
                  <span className={styles.howIndex}>{step.index}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </div>

      </section>

      {modalOpen && entry && (
        <div
          className={styles.overlay}
          onClick={(event) => {
            if (event.target === event.currentTarget) setModalOpen(false);
          }}
          role="presentation"
        >
          <div aria-labelledby="waitlist-success-title" aria-modal="true" className={styles.modal} role="dialog">
            <button
              aria-label="Close"
              className={styles.modalClose}
              onClick={() => setModalOpen(false)}
              ref={modalCloseRef}
              type="button"
            >
              ×
            </button>
            <TickBoxGlyph />
            <h2 id="waitlist-success-title">You&apos;re on the Levli waitlist</h2>
            <p className={styles.modalLead}>
              You&apos;ll be first to know when early access opens. Your referral link is now
              server-confirmed; rewards begin only after verified product milestones.
            </p>
            <ReferralShare copied={copied} entry={entry} onCopy={handleCopy} shareUrl={shareUrl} />
            <div className={styles.modalActions}>
              <button className={styles.doneButton} onClick={() => setModalOpen(false)} type="button">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
