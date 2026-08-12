import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "../../components/marketing/arrow-up-right";
import { HeroConeGraphic } from "../../components/marketing/hero-cone-graphic";
import { ChallengeIcon, FundedIcon, TradingIcon } from "../../components/marketing/path-icons";
import { TerminalPreview } from "../../components/marketing/terminal-preview";
import styles from "./home.module.css";

export default function HomePage(): React.JSX.Element {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <HeroConeGraphic className={styles.heroGraphic} />
        <div className={styles.heroInner}>
          <div className={styles.heroCopyBlock}>
            <p className={styles.eyebrow}><span /> Closed beta · Simulated trading</p>
            <h1>
              <span>Prove your skill.</span>
              <strong>Trade with size.</strong>
            </h1>
            <p className={styles.heroCopy}>
              Take a simulated challenge with live market data, clear risk rules, and
              performance-based USDC rewards.
            </p>
            <div className={styles.heroActions}>
              <Link href="/waitlist" className={styles.primaryButton}>Join the beta <ArrowUpRight /></Link>
              <Link href="/#terminal" className={styles.secondaryButton}>See the terminal</Link>
            </div>
            <ul className={styles.heroChips}>
              {HERO_CHIPS.map((chip) => <li key={chip}>{chip}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.facts} id="facts" aria-label="Levli key facts">
        <div><span>Start</span><strong>Free $10K trial</strong></div>
        <div><span>Fee</span><strong>From $29</strong></div>
        <div><span>Profit split</span><strong>Up to 90%</strong></div>
        <div><span>Settlement</span><strong>USDC rewards</strong></div>
      </section>

      <section className={styles.terminalSection} id="terminal">
        <div className={styles.terminalIntro}>
          <div className={styles.sectionIntro}>
            <h2>Your rules stay in view.</h2>
            <p>Chart, order book, ticket, and risk limits share one focused cockpit.</p>
          </div>
        </div>
        <TerminalPreview />
      </section>

      <section className={styles.pathSection} id="how-it-works">
        <div className={styles.sectionIntro}>
          <h2>One clear path.</h2>
          <p>Pick a scale. Keep the rules in view. Prove the process.</p>
        </div>
        <ol className={styles.pathGrid}>
          {PATH_STEPS.map((item) => (
            <li key={item.number}>
              <div className={styles.stepTop}><span>{item.number}</span></div>
              <item.Icon />
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.pricingSection} id="pricing">
        <div className={styles.pricingShell}>
          <div className={styles.pricingHeader}>
            <div className={styles.sectionIntro}>
              <h2>Choose your scale.</h2>
              <p>One evaluation fee. No subscription and no hidden tier.</p>
            </div>
          </div>
          <div className={styles.planGrid}>
            {PLANS.map((plan) => (
              <article key={plan.size}>
                <label className={styles.planSelect}>
                  <input
                    aria-label={`${plan.size} account size`}
                    className={styles.planRadio}
                    defaultChecked={plan.featured}
                    name="account-size"
                    type="radio"
                    value={plan.size}
                  />
                  <div className={styles.planTopline}>
                    <strong>{plan.short}</strong>
                  </div>
                  <p>{plan.size}<br />simulated buying power</p>
                  <div className={styles.planPrice}><strong>{plan.price}</strong></div>
                  <div className={styles.planLines} aria-hidden="true">
                    <i /><i /><i /><i /><i />
                  </div>
                </label>
              </article>
            ))}
          </div>
          <div className={styles.pricingFoot}>
            <Link className={styles.sectionButton} href="/waitlist">Join the beta <ArrowUpRight /></Link>
          </div>
        </div>
      </section>

      <section className={styles.rulesSection} id="rules">
        <div className={styles.rulesShell}>
          <div className={styles.rulesHeader}>
            <div className={styles.sectionIntro}>
              <h2>Rules, not surprises</h2>
              <p>One rule set across every size. Locked to your account at purchase.</p>
              <Link className={styles.textLink} href="/rules">View Full Rules <ArrowUpRight /></Link>
            </div>
          </div>
          <div className={styles.ruleGrid}>
            {RULES.map((rule) => (
              <article key={rule.label}>
                <span className={styles.ruleLabel}>{rule.label}</span>
                <div className={styles.ruleValue}>
                  <strong>{rule.value}</strong>
                  <span>{rule.example}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.proofSection} id="proof">
        <div className={styles.proofHeader}>
          <div className={styles.sectionIntro}>
            <h2>Proof, not promises.</h2>
            <p>Every rule, verdict, and reward receipt stays open to review. We publish the record, not claims.</p>
          </div>
        </div>
        <div className={styles.proofGrid}>
          {PROOF_ITEMS.map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.faqSection} id="faq">
        <div className={styles.sectionIntro}>
          <h2>Straight<br />answers.</h2>
          <Link className={styles.textLink} href="/faq">View Full FAQ <ArrowUpRight /></Link>
        </div>
        <div className={styles.faqList}>
          {FAQS.map((item) => (
            <details className={styles.faqRow} key={item.question}>
              <summary>
                <span>{item.question}</span>
                <i aria-hidden="true">+</i>
              </summary>
              <div className={styles.faqAnswer}>
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.backersSection} aria-labelledby="partners-title">
        <h2 id="partners-title">Partners</h2>
        <p className={styles.backersLede}>Meet the partners in our growing ecosystem.</p>
        <ul className={styles.backerLogos}>
          {BACKERS.map((backer) => (
            <li key={backer.name}>
              <Image
                alt={backer.name}
                height={backer.height}
                src={backer.src}
                width={backer.width}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.finalCtaGraphic} aria-hidden="true">
          <Image
            alt=""
            className={styles.finalCtaGraphicBase}
            height={457}
            src="/images/final-cta-cone.png"
            width={545}
          />
          <Image
            alt=""
            className={styles.finalCtaGraphicAccent}
            height={457}
            src="/images/final-cta-cone.png"
            width={545}
          />
        </div>
        <h2>Ready to prove it?</h2>
        <p className={styles.finalCtaLede}>Be first in line when the challenge opens.</p>
        <div className={styles.finalActions}>
          <Link href="/waitlist" className={styles.primaryButton}>Join the beta <ArrowUpRight /></Link>
          <Link href="/rules" className={styles.secondaryButton}>Read the rules</Link>
        </div>
      </section>
    </div>
  );
}

const HERO_CHIPS = ["No time limit", "Zero funding fee", "Public proof"] as const;

const PLANS = [
  { size: "$2,500", short: "2.5K", price: "$29", featured: false },
  { size: "$10,000", short: "10K", price: "$89", featured: true },
  { size: "$25,000", short: "25K", price: "$249", featured: false },
  { size: "$50,000", short: "50K", price: "$449", featured: false },
] as const;

/* 금액은 개발 버전 기준(The 10K) — 사이즈 연동 UI가 없으므로 대표값으로 고정 */
const RULES = [
  { label: "PROFIT TARGET", value: "10%", example: "$1,000 on The 10K" },
  { label: "MAX DRAWDOWN", value: "6%", example: "$600 · static" },
  { label: "DAILY LOSS", value: "4%", example: "$400 · UTC reset" },
  { label: "CONSISTENCY", value: "≤35%", example: "Best day of total profit" },
] as const;

const PATH_STEPS = [
  {
    number: "01",
    title: "Choose your challenge",
    body: "Select a 2.5K–50K simulated account. Your rules are locked when the account is created.",
    Icon: ChallengeIcon,
  },
  {
    number: "02",
    title: "Trade and pass",
    body: "Reach the target with live market data while staying inside the risk limits. There is no time limit.",
    Icon: TradingIcon,
  },
  {
    number: "03",
    title: "Get funded. Get rewarded",
    body: "Pass review, trade a simulated funded account, and become eligible for performance-based rewards.",
    Icon: FundedIcon,
  },
] as const;

const PROOF_ITEMS = [
  {
    title: "Rule snapshots",
    body: "The terms attached to an account stay available for review.",
  },
  {
    title: "Traceable verdicts",
    body: "Passes and breaches resolve against the same recorded rule set.",
  },
  {
    title: "Verified rewards",
    body: "Approved reward receipts can be published without exposing private data.",
  },
] as const;

// 로고별 렌더 높이는 시각적 무게를 맞춘 실측값(디자인 1440px 기준), width는 원본 종횡비 유지
const BACKERS = [
  { name: "Aster", src: "/logos/aster-logo.png", width: 173, height: 46 },
  { name: "Hyperliquid", src: "/logos/hyperliquid-logo.png", width: 211, height: 33 },
  { name: "Nado", src: "/logos/nado-logo.png", width: 163, height: 36 },
] as const;

const FAQS = [
  {
    question: "Is this real-money trading?",
    answer:
      "No. Trial, Evaluation, and Funded accounts are simulated. Orders use live market data but are not routed to an exchange.",
  },
  {
    question: "Where do rewards come from?",
    answer:
      "Eligible rewards are discretionary, performance-based payments made from Levli company revenue after review.",
  },
  {
    question: "What happens if I breach a rule?",
    answer:
      "A Daily Loss breach pauses trading until the next UTC day. Touching the static Max Drawdown floor ends the account.",
  },
  {
    question: "Is a reward guaranteed after I pass?",
    answer:
      "No. Passing makes you eligible for a funded-account review; every reward request still passes account, risk, and fair-play checks.",
  },
] as const;
