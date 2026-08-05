"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LevliSymbol } from "../../../components/brand/levli-logo";
import styles from "./waitlist.module.css";

/* 데모 단계: 서버 연동 전까지 등록 상태는 이 브라우저(localStorage)에만 저장된다 */
const STORAGE_KEY = "levli.waitlist.entry";
const SHARE_SLOGAN = "Prove your skill. Trade with size.";
const X_ACCOUNT = "@Levli_Official";

type WaitlistEntry = {
  xHandle: string;
  telegram: string;
  wallet: string;
  referredBy: string | null;
  code: string;
  joinedAt: string;
};

type FieldErrors = Partial<Record<"xHandle" | "telegram" | "wallet" | "referral", string>>;

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

/* 리더보드 프리뷰 목데이터 — 결정적 생성(하이드레이션 안전), 페이지당 50행 */
const LB_PAGE_SIZE = 50;
const LB_TOTAL = 273;
const LB_LETTERS = "abcdefghijklmnopqrstuvwxyz";

const LEADERBOARD_ROWS = Array.from({ length: LB_TOTAL }, (_, index) => {
  const jitter = ((index * 2654435761) >>> 16) % 9;
  const invited = Math.max(1, Math.floor(260 * Math.exp(-index / 55)) + (8 - jitter));
  const a = LB_LETTERS[(index * 7) % 26];
  const b = LB_LETTERS[(index * 13 + 3) % 26];
  const c = LB_LETTERS[(index * 19 + 11) % 26];
  return { trader: `@${a}•••••${b}${c}`, invited };
})
  .sort((x, y) => y.invited - x.invited)
  .map((row, index) => ({
    rank: index + 1,
    trader: row.trader,
    invited: row.invited.toLocaleString("en-US"),
    points: (row.invited * 100).toLocaleString("en-US"),
  }));

const LB_PAGE_COUNT = Math.ceil(LB_TOTAL / LB_PAGE_SIZE);

/* 페이지 번호 목록: 1 2 3 4 … N 패턴 (현재 페이지 위치에 따라 창 이동) */
function buildPageItems(current: number, total: number): Array<number | "gap"> {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, "gap", total];
  if (current >= total - 2) return [1, "gap", total - 3, total - 2, total - 1, total];
  return [1, "gap", current - 1, current, current + 1, "gap", total];
}

const HOW_IT_WORKS = [
  { index: "01", title: "Invite friends", body: "Share your personal referral link anywhere." },
  { index: "02", title: "They join", body: "Your friend signs up for the Levli waitlist." },
  { index: "03", title: "Both earn 100 points", body: "Levli Points move you both up the early access order." },
] as const;

function XGlyph(): React.JSX.Element {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.9 3H21l-6.8 7.8L22.2 21h-6.3l-4.9-6.4L5.4 21H2.2l7.3-8.3L2 3h6.4l4.4 5.9L17.9 3Zm-1.1 16.2h1.7L7.6 4.7H5.8l11 14.5Z" />
    </svg>
  );
}

/* 혜택/랭킹 아이콘은 제공된 PNG(공용 /icons)를 CSS mask로 민트 단색화해 사용 */

function TelegramGlyph(): React.JSX.Element {
  return (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="m21.5 3.5-19 7.7 5.7 1.9 2.1 6 3.1-3.9 5.3 3.5 2.8-15.2Z" />
      <path d="m8.2 13.1 8.5-7.4" />
    </svg>
  );
}

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

  const [xHandle, setXHandle] = useState("");
  const [telegram, setTelegram] = useState("");
  const [wallet, setWallet] = useState("");
  const [referral, setReferral] = useState("");
  const [refApplied, setRefApplied] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [entry, setEntry] = useState<WaitlistEntry | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [lbPage, setLbPage] = useState(1);
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const [origin, setOrigin] = useState("https://levli.com");

  const modalCloseRef = useRef<HTMLButtonElement>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setEntry(readStoredEntry());
    setOrigin(window.location.origin);
  }, []);

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

    const normalizedHandle = xHandle.trim().replace(/^@/, "");
    const normalizedTelegram = telegram.trim().replace(/^@/, "");
    const normalizedWallet = wallet.trim();
    const normalizedReferral = referral.trim().toUpperCase();

    const nextErrors: FieldErrors = {};
    if (!/^[A-Za-z0-9_]{1,15}$/.test(normalizedHandle)) {
      nextErrors.xHandle = "Enter a valid X handle, letters, numbers and underscores only.";
    }
    if (!/^[A-Za-z0-9_]{5,32}$/.test(normalizedTelegram)) {
      nextErrors.telegram = "Enter a valid Telegram handle, 5 to 32 characters.";
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(normalizedWallet)) {
      nextErrors.wallet = "Enter a valid EVM wallet address starting with 0x.";
    }
    if (normalizedReferral && !/^LEVLI-[A-Z0-9]{5}$/.test(normalizedReferral)) {
      nextErrors.referral = "Referral codes look like LEVLI-XXXXX.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const newEntry: WaitlistEntry = {
      xHandle: normalizedHandle,
      telegram: normalizedTelegram,
      wallet: normalizedWallet,
      referredBy: normalizedReferral || null,
      code: generateReferralCode(`${normalizedHandle}:${normalizedWallet}`),
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
              <p>
                Saved as @{entry.xHandle}. Share your link, every successful referral earns
                you and your friend 100 Levli Points.
              </p>
              <ReferralShare copied={copied} entry={entry} onCopy={handleCopy} shareUrl={shareUrl} />
            </div>
          ) : (
            <form className={styles.formPanel} noValidate onSubmit={handleSubmit}>
              <h2>Secure your spot</h2>

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
                {errors.xHandle && <p className={styles.fieldError} id="waitlist-x-error">{errors.xHandle}</p>}
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.srOnly} htmlFor="waitlist-telegram">Telegram handle</label>
                <div className={styles.inputWrap}>
                  <span aria-hidden="true" className={styles.inputIcon}><TelegramGlyph /></span>
                  <input
                    aria-describedby={errors.telegram ? "waitlist-telegram-error" : undefined}
                    aria-invalid={Boolean(errors.telegram)}
                    autoComplete="off"
                    className={`${styles.textInput} ${errors.telegram ? styles.inputInvalid : ""}`}
                    id="waitlist-telegram"
                    onChange={(event) => setTelegram(event.target.value)}
                    placeholder="Telegram"
                    type="text"
                    value={telegram}
                  />
                </div>
                {errors.telegram && (
                  <p className={styles.fieldError} id="waitlist-telegram-error">{errors.telegram}</p>
                )}
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.srOnly} htmlFor="waitlist-wallet">Wallet address</label>
                <div className={styles.inputWrap}>
                  <span aria-hidden="true" className={styles.inputIcon}><WalletGlyph /></span>
                  <input
                    aria-describedby={errors.wallet ? "waitlist-wallet-error" : undefined}
                    aria-invalid={Boolean(errors.wallet)}
                    autoComplete="off"
                    className={`${styles.textInput} ${errors.wallet ? styles.inputInvalid : ""}`}
                    id="waitlist-wallet"
                    onChange={(event) => setWallet(event.target.value)}
                    placeholder="Wallet Address"
                    spellCheck={false}
                    type="text"
                    value={wallet}
                  />
                </div>
                {errors.wallet && <p className={styles.fieldError} id="waitlist-wallet-error">{errors.wallet}</p>}
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
              <p className={styles.formFoot}><ShieldGlyph /> No payment required. Simulated accounts.</p>
            </form>
          )}
        </div>
      </section>

      <section className={styles.leaderboard} aria-label="Referral leaderboard">
        <div className={styles.lbHead}>
          <div className={styles.lbIntro}>
            <h2>Referral leaderboard</h2>
            <p>
              Invite friends, earn Levli Points.<br />
              You and your friend both earn 100 Levli Points for every successful referral.
            </p>
          </div>
          <div className={styles.lbStats}>
            <div className={styles.statCell}>
              <span>People invited</span>
              <strong>{entry ? "0" : "—"}</strong>
            </div>
            <div className={styles.statCell}>
              <span>Points earned</span>
              <strong>{entry ? (entry.referredBy ? "100" : "0") : "—"}</strong>
            </div>
            <div className={styles.statCell}>
              <span>Your rank</span>
              <strong>—</strong>
            </div>
          </div>
        </div>

        <div className={styles.lbLayout}>
          <div className={styles.lbTableCol}>
          <div className={styles.lbTableWrap}>
            <table className={styles.lbTable}>
              <thead>
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">Trader</th>
                  <th className={styles.thNum} scope="col">Invited</th>
                  <th className={styles.thNum} scope="col">Points</th>
                </tr>
              </thead>
              <tbody>
                {LEADERBOARD_ROWS.slice((lbPage - 1) * LB_PAGE_SIZE, lbPage * LB_PAGE_SIZE).map((row) => {
                  /* 데모: 가입 시 6위 자리에 본인 행을 인라인 표시 (디자인 확인용, 서버 연동 시 실순위로 대체) */
                  const isYou = Boolean(entry) && lbPage === 1 && row.rank === 6;
                  return (
                    <tr className={isYou ? styles.rowYou : undefined} key={row.rank}>
                      <td className={styles.tdRank}>
                        {row.rank}
                        {row.rank <= 3 && <span aria-hidden="true" className={styles.trophy} />}
                      </td>
                      <td className={styles.tdTrader}>
                        {isYou && entry ? (
                          <>@{entry.xHandle}<span className={styles.youTag}>You</span></>
                        ) : (
                          row.trader
                        )}
                      </td>
                      <td className={styles.tdNum}>{row.invited}</td>
                      <td className={styles.tdNum}>{row.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

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
              You&apos;ll be first to know when early access opens. Invite friends to climb
              the leaderboard and earn Levli Points.
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
