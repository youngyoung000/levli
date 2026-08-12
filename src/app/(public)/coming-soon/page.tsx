import type { Metadata } from "next";
import Link from "next/link";
import styles from "./coming-soon.module.css";

/* 개발 버전(levli-landing-two)의 /coming-soon 을 DOM 구조·값 그대로 옮겼다.
   CSS도 배포본에서 이식했으므로 수정 시 배포본과의 차이를 문서에 남길 것. */

export const metadata: Metadata = {
  title: "Coming Soon | Levli",
  description:
    "The Levli terminal is not public yet. Join the Waitlist to keep a verified place for upcoming beta access.",
};

function ArrowGlyph(): React.JSX.Element {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <path d="M4 12 12 4M6 4h6v6" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const ACCESS_FILL_PATH =
  "M0 175C48 168 72 181 113 147C151 115 183 137 217 111C254 82 292 109 328 78C363 47 402 67 437 42C472 18 515 35 560 8";

export default function ComingSoonPage(): React.JSX.Element {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div aria-hidden="true" className={styles.heroGrid} />
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><span /> Closed beta · Enrollment open</p>
          <h1>
            <span>Trading starts soon.</span>
            <strong>Your place starts now.</strong>
          </h1>
          <p className={styles.lead}>
            The Levli terminal isn’t public yet. Connect your wallet, join the Waitlist, and keep
            one verified place for upcoming beta access.
          </p>
          <div className={styles.actions}>
            <Link className={styles.primaryAction} href="/waitlist">
              Join the Waitlist <ArrowGlyph />
            </Link>
            <Link className={styles.secondaryAction} href="/#how-it-works">How Levli works</Link>
          </div>
          <ul aria-label="Waitlist sign-up details" className={styles.assurances}>
            {ASSURANCES.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>

        <aside aria-label="Levli beta access status" className={styles.accessConsole}>
          <div className={styles.consoleTopbar}>
            <span>LEVLI / ACCESS CONSOLE</span>
            <span className={styles.liveStatus}><i /> Enrollment live</span>
          </div>
          <div aria-hidden="true" className={styles.consoleVisual}>
            <div className={styles.chartGrid} />
            <svg fill="none" preserveAspectRatio="none" viewBox="0 0 560 205">
              <defs>
                <linearGradient id="access-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#00edd5" stopOpacity="0.22" />
                  <stop offset="1" stopColor="#00edd5" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`${ACCESS_FILL_PATH}V205H0Z`} fill="url(#access-fill)" />
              <path d={ACCESS_FILL_PATH} stroke="#00edd5" strokeWidth="2" />
            </svg>
            <div className={styles.consoleSignal}>
              <small>Access status</small>
              <strong>WAITLIST OPEN</strong>
              <span>Verified wallet entry is available now.</span>
            </div>
          </div>
          <ol className={styles.accessTrack}>
            {ACCESS_TRACK.map((row, index) => (
              <li className={index === 0 ? styles.activeTrack : undefined} key={row.label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{row.label}</strong>
                <em>{row.state}</em>
              </li>
            ))}
          </ol>
          <div className={styles.consoleFooter}>
            <span>Next action</span>
            <Link href="/waitlist">Secure your place <ArrowGlyph /></Link>
          </div>
        </aside>
      </section>

      <section className={styles.journey}>
        <header>
          <div>
            <p>Early access path</p>
            <h2>From Waitlist<br />to terminal.</h2>
          </div>
          <p>Three clear steps. No deposit, transaction, or guaranteed invite is created by joining.</p>
        </header>
        <ol aria-label="Early access process" className={styles.steps}>
          {STEPS.map((step, index) => (
            <li key={step.title}>
              <div className={styles.stepMeta}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <em>{step.state}</em>
              </div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

const ASSURANCES = ["Free wallet signature", "No deposit required", "Arbitrum One"] as const;

const ACCESS_TRACK = [
  { label: "Waitlist enrollment", state: "Open" },
  { label: "Beta invitation", state: "Rolling" },
  { label: "Trading terminal", state: "Soon" },
] as const;

const STEPS = [
  {
    state: "Open now",
    title: "Verify one place",
    body: "Connect an EVM wallet, sign a free message, and complete your Waitlist profile.",
  },
  {
    state: "Rolling",
    title: "Watch for your invite",
    body: "We’ll open beta onboarding in waves as new testing capacity becomes available.",
  },
  {
    state: "Coming soon",
    title: "Enter the terminal",
    body: "Invited members can move from their verified wallet into the Levli trading experience.",
  },
] as const;
